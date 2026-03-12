#!/usr/bin/env node
/**
 * Pushes Tempo icon SVG data to Figma via the WebSocket Bridge API.
 * First stores data in batches via globalThis, then creates all components.
 */
import { readFileSync } from 'fs';
import { WebSocket } from 'ws';

const batches = JSON.parse(readFileSync('/Users/vcartier/Desktop/sds/scripts/smart-batches.json', 'utf8'));
console.log(`Loaded ${batches.length} batches, ${batches.flat().length} icons total`);

// Connect to the Figma Desktop Bridge WebSocket
const WS_PORT = 9225;

async function sendToFigma(code, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}`);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error('Timeout'));
    }, timeout);

    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'execute',
        code: code
      }));
    });

    ws.on('message', (data) => {
      clearTimeout(timer);
      const msg = JSON.parse(data.toString());
      ws.close();
      resolve(msg);
    });

    ws.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function main() {
  // Step 1: Initialize the global storage
  console.log('Initializing storage...');
  await sendToFigma('globalThis.__tempoIcons = []; return "initialized";');

  // Step 2: Upload icon data in batches
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const dataStr = JSON.stringify(batch).replace(/\\/g, '\\\\').replace(/`/g, '\\`');
    const code = `
      const data = JSON.parse(\`${dataStr}\`);
      globalThis.__tempoIcons.push(...data);
      return "batch ${i}: " + data.length + " icons, total: " + globalThis.__tempoIcons.length;
    `;

    try {
      const result = await sendToFigma(code);
      console.log(`Batch ${i}/${batches.length - 1}: ${batch.length} icons -`, result.result || result);
    } catch (err) {
      console.error(`Batch ${i} failed:`, err.message);
      // Retry once
      try {
        const result = await sendToFigma(code, 15000);
        console.log(`Batch ${i} retry OK:`, result.result || result);
      } catch (err2) {
        console.error(`Batch ${i} retry failed:`, err2.message);
      }
    }
  }

  // Step 3: Verify all data uploaded
  const verify = await sendToFigma('return "Total icons stored: " + globalThis.__tempoIcons.length;');
  console.log('\n' + verify.result);

  // Step 4: Create icon components in batches of 15
  console.log('\nCreating Figma components...');
  const CREATE_BATCH = 15;
  const totalIcons = batches.flat().length;
  const createBatches = Math.ceil(totalIcons / CREATE_BATCH);

  for (let i = 0; i < createBatches; i++) {
    const start = i * CREATE_BATCH;
    const code = `
      const SECTION_ID = "3017:16010";
      const section = await figma.getNodeByIdAsync(SECTION_ID);
      if (!section) return "Section not found";

      const icons = globalThis.__tempoIcons.slice(${start}, ${start + CREATE_BATCH});
      const created = [];
      const COLS = 20;

      for (let j = 0; j < icons.length; j++) {
        const icon = icons[j];
        const idx = ${start} + j;
        try {
          const svgNode = figma.createNodeFromSvg(icon.svg);
          const comp = figma.createComponent();
          comp.name = icon.name;
          comp.resize(24, 24);
          comp.clipsContent = true;

          // Move SVG children into component
          for (const child of [...svgNode.children]) {
            comp.appendChild(child);
          }
          svgNode.remove();

          // Position in grid
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          comp.x = col * 48;
          comp.y = row * 48;

          section.appendChild(comp);
          created.push(icon.name);
        } catch (e) {
          created.push(icon.name + ":ERROR:" + e.message);
        }
      }
      return JSON.stringify({ batch: ${i}, created: created.length, names: created });
    `;

    try {
      const result = await sendToFigma(code, 15000);
      const parsed = JSON.parse(result.result);
      const errors = parsed.names.filter(n => n.includes(':ERROR:'));
      console.log(`Create batch ${i + 1}/${createBatches}: ${parsed.created} icons` +
        (errors.length ? ` (${errors.length} errors)` : ''));
      if (errors.length) console.log('  Errors:', errors);
    } catch (err) {
      console.error(`Create batch ${i + 1} failed:`, err.message);
    }
  }

  // Step 5: Resize section to fit
  await sendToFigma(`
    const section = await figma.getNodeByIdAsync("3017:16010");
    if (section) {
      section.resizeWithoutConstraints(
        Math.max(...section.children.map(c => c.x + c.width)) + 24,
        Math.max(...section.children.map(c => c.y + c.height)) + 24
      );
    }
    return "Section resized, total children: " + section.children.length;
  `);

  console.log('\nDone! Check the Icons page in Figma.');
}

main().catch(console.error);

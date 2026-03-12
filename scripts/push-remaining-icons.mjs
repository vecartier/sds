#!/usr/bin/env node
/**
 * Pushes remaining 255 Tempo icons to Figma via the WebSocket Bridge.
 * Phase 1: Upload icon data to globalThis in batches
 * Phase 2: Create Figma components in batches of 10
 */
import { readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('ws');

const uploadChunks = JSON.parse(readFileSync('/tmp/upload-chunks.json', 'utf8'));
const totalIcons = uploadChunks.flat().length;
console.log(`Loaded ${uploadChunks.length} upload chunks, ${totalIcons} icons total`);

const WS_PORT = 9225;

function sendToFigma(code, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}`);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error('Timeout'));
    }, timeout);

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'execute', code }));
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
  // Phase 1: Initialize storage
  console.log('Initializing...');
  await sendToFigma('globalThis.__remainingIcons = []; return "initialized";');

  // Phase 2: Upload data
  for (let i = 0; i < uploadChunks.length; i++) {
    const chunk = uploadChunks[i];
    const dataStr = JSON.stringify(chunk);
    const code = `const data = ${dataStr}; globalThis.__remainingIcons.push(...data); return "chunk ${i}: " + data.length + " icons, total: " + globalThis.__remainingIcons.length;`;

    try {
      const result = await sendToFigma(code);
      console.log(`Upload ${i + 1}/${uploadChunks.length}: ${chunk.length} icons - ${result.result || JSON.stringify(result)}`);
    } catch (err) {
      console.error(`Upload ${i} failed: ${err.message}, retrying...`);
      try {
        const result = await sendToFigma(code, 60000);
        console.log(`Upload ${i} retry OK: ${result.result}`);
      } catch (err2) {
        console.error(`Upload ${i} retry failed: ${err2.message}`);
        process.exit(1);
      }
    }
  }

  // Phase 3: Verify
  const verify = await sendToFigma('return "Total stored: " + globalThis.__remainingIcons.length;');
  console.log('\n' + verify.result);

  // Phase 4: Create components in batches of 10
  const CREATE_BATCH = 10;
  const createBatches = Math.ceil(totalIcons / CREATE_BATCH);
  console.log(`\nCreating ${totalIcons} components in ${createBatches} batches...`);

  for (let i = 0; i < createBatches; i++) {
    const start = i * CREATE_BATCH;
    const globalOffset = 70; // 70 priority icons already placed
    const code = `
      const SECTION_ID = "3017:16010";
      const section = await figma.getNodeByIdAsync(SECTION_ID);
      if (!section) return "Section not found";
      const icons = globalThis.__remainingIcons.slice(${start}, ${start + CREATE_BATCH});
      const created = [];
      const COLS = 20;
      for (let j = 0; j < icons.length; j++) {
        const icon = icons[j];
        const idx = ${globalOffset + start} + j;
        try {
          const svgNode = figma.createNodeFromSvg(icon.svg);
          const comp = figma.createComponent();
          comp.name = icon.name;
          comp.resize(24, 24);
          comp.clipsContent = true;
          for (const child of [...svgNode.children]) { comp.appendChild(child); }
          svgNode.remove();
          comp.x = (idx % COLS) * 48;
          comp.y = Math.floor(idx / COLS) * 48;
          section.appendChild(comp);
          created.push(icon.name);
        } catch (e) {
          created.push(icon.name + ":ERROR:" + e.message);
        }
      }
      return JSON.stringify({ batch: ${i}, created: created.length, names: created });
    `;

    try {
      const result = await sendToFigma(code, 30000);
      const parsed = JSON.parse(result.result);
      const errors = parsed.names.filter(n => n.includes(':ERROR:'));
      const progress = Math.min(start + CREATE_BATCH, totalIcons);
      console.log(`Create ${i + 1}/${createBatches}: ${parsed.created} icons (${progress}/${totalIcons})` +
        (errors.length ? ` [${errors.length} errors]` : ''));
      if (errors.length) console.log('  Errors:', errors);
    } catch (err) {
      console.error(`Create batch ${i + 1} failed: ${err.message}`);
    }
  }

  // Phase 5: Resize section
  console.log('\nResizing section...');
  const resize = await sendToFigma(`
    const section = await figma.getNodeByIdAsync("3017:16010");
    if (section) {
      const maxX = Math.max(...section.children.map(c => c.x + c.width));
      const maxY = Math.max(...section.children.map(c => c.y + c.height));
      section.resizeWithoutConstraints(maxX + 24, maxY + 24);
      return "Resized to " + (maxX+24) + "x" + (maxY+24) + ", " + section.children.length + " total components";
    }
    return "Section not found";
  `);
  console.log(resize.result);

  console.log('\nDone!');
}

main().catch(console.error);

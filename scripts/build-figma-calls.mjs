#!/usr/bin/env node
/**
 * Generates a single large Figma execute code block that creates all priority icons.
 * Outputs the code to stdout for each chunk, which can be run sequentially.
 */
import { readFileSync, writeFileSync } from 'fs';

const chunks = JSON.parse(readFileSync('/Users/vcartier/Desktop/sds/scripts/priority-batches.json', 'utf8'));

// Skip chunk 0 (already created)
for (let i = 1; i < chunks.length; i++) {
  const data = JSON.stringify(chunks[i]);
  const offset = chunks.slice(0, i).flat().length;

  const code = `const SECTION_ID = '3017:16010';
const section = await figma.getNodeByIdAsync(SECTION_ID);
const icons = ${data};
const created = [];
for (let j = 0; j < icons.length; j++) {
  const icon = icons[j];
  const idx = ${offset} + j;
  const svgNode = figma.createNodeFromSvg(icon.svg);
  const comp = figma.createComponent();
  comp.name = icon.name;
  comp.resize(24, 24);
  for (const child of [...svgNode.children]) { comp.appendChild(child); }
  svgNode.remove();
  comp.x = (idx % 20) * 48;
  comp.y = Math.floor(idx / 20) * 48;
  section.appendChild(comp);
  created.push(icon.name);
}
return JSON.stringify(created);`;

  writeFileSync(`/tmp/figma_chunk_${i}.js`, code);
  console.log(`Chunk ${i}: ${chunks[i].length} icons, ${code.length} chars, offset=${offset}`);
}

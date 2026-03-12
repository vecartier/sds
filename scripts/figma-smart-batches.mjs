#!/usr/bin/env node
/**
 * Creates smart-sized batches where each batch stays under MAX_BATCH_SIZE chars.
 */
import { readFileSync, writeFileSync } from 'fs';

const batches = JSON.parse(readFileSync('/Users/vcartier/Desktop/sds/scripts/icon-batches.json', 'utf8'));
const allIcons = batches.flat();

const MAX_BATCH_SIZE = 20000; // ~20KB per batch
const smartBatches = [];
let currentBatch = [];
let currentSize = 0;

for (const icon of allIcons) {
  const iconSize = JSON.stringify(icon).length;
  if (currentSize + iconSize > MAX_BATCH_SIZE && currentBatch.length > 0) {
    smartBatches.push(currentBatch);
    currentBatch = [];
    currentSize = 0;
  }
  currentBatch.push(icon);
  currentSize += iconSize;
}
if (currentBatch.length > 0) smartBatches.push(currentBatch);

writeFileSync('/Users/vcartier/Desktop/sds/scripts/smart-batches.json', JSON.stringify(smartBatches));

console.log(`${smartBatches.length} smart batches from ${allIcons.length} icons`);
smartBatches.forEach((b, i) => {
  const size = JSON.stringify(b).length;
  console.log(`  Batch ${i}: ${b.length} icons, ${size} chars`);
});

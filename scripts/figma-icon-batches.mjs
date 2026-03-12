#!/usr/bin/env node
/**
 * Generates JSON batches of icon SVG data for Figma import.
 * Each batch contains ~10 icons to keep the payload manageable.
 */
import { readFileSync, writeFileSync } from 'fs';

const REGISTRY_PATH = '/Users/vcartier/Desktop/Sandbox - Deezer/src/icons/registry.ts';
const OUTPUT_PATH = '/Users/vcartier/Desktop/sds/scripts/icon-batches.json';

const registryContent = readFileSync(REGISTRY_PATH, 'utf-8');
const icons = [];
const iconRegex = /^\s+(\w+):\s*\{\s*viewBox:\s*'([^']+)',\s*paths:\s*\[(.+)\]\s*\},?\s*$/;

for (const line of registryContent.split('\n')) {
  const match = line.match(iconRegex);
  if (!match) continue;
  const [, name, viewBox, pathsStr] = match;

  // Build SVG path elements
  const paths = [];
  const pathRegex = /\{\s*d:\s*'([^']+)'(?:,\s*fillRule:\s*'([^']+)')?\s*\}/g;
  let pathMatch;
  while ((pathMatch = pathRegex.exec(pathsStr)) !== null) {
    let pathEl = `<path d="${pathMatch[1]}"`;
    if (pathMatch[2]) pathEl += ` fill-rule="${pathMatch[2]}"`;
    pathEl += `/>`;
    paths.push(pathEl);
  }

  if (paths.length > 0) {
    // Determine display size based on viewBox
    const vbParts = viewBox.split(' ').map(Number);
    const vbW = vbParts[2];
    const vbH = vbParts[3];
    // UI icons are 24x24, genre icons are 32x32 — normalize to 24px display
    const displaySize = 24;

    const svg = `<svg viewBox="${viewBox}" width="${displaySize}" height="${displaySize}" fill="black" xmlns="http://www.w3.org/2000/svg">${paths.join('')}</svg>`;
    icons.push({ name, svg });
  }
}

// Split into batches of 10
const BATCH_SIZE = 10;
const batches = [];
for (let i = 0; i < icons.length; i += BATCH_SIZE) {
  batches.push(icons.slice(i, i + BATCH_SIZE));
}

writeFileSync(OUTPUT_PATH, JSON.stringify(batches, null, 0));
console.log(`Generated ${batches.length} batches (${icons.length} icons total)`);
console.log(`Output: ${OUTPUT_PATH}`);

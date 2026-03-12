#!/usr/bin/env node
/**
 * Converts Tempo icon registry (from Sandbox) into individual .tsx icon component files
 * matching the SDS pattern: one file per icon, exported from index.ts
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const REGISTRY_PATH = '/Users/vcartier/Desktop/Sandbox - Deezer/src/icons/registry.ts';
const ICONS_DIR = '/Users/vcartier/Desktop/sds/src/ui/icons';

// Read the registry file
const registryContent = readFileSync(REGISTRY_PATH, 'utf-8');

// Parse icons from the registry
// Each line looks like:
//   IconName: { viewBox: 'X Y W H', paths: [{ d: '...', fillRule?: 'evenodd' }, ...] },
const icons = [];
const iconRegex = /^\s+(\w+):\s*\{\s*viewBox:\s*'([^']+)',\s*paths:\s*\[(.+)\]\s*\},?\s*$/;

for (const line of registryContent.split('\n')) {
  const match = line.match(iconRegex);
  if (!match) continue;

  const [, name, viewBox, pathsStr] = match;

  // Parse individual paths
  const paths = [];
  const pathRegex = /\{\s*d:\s*'([^']+)'(?:,\s*fillRule:\s*'([^']+)')?\s*\}/g;
  let pathMatch;
  while ((pathMatch = pathRegex.exec(pathsStr)) !== null) {
    paths.push({
      d: pathMatch[1],
      fillRule: pathMatch[2] || null,
    });
  }

  if (paths.length > 0) {
    icons.push({ name, viewBox, paths });
  }
}

console.log(`Parsed ${icons.length} icons from registry`);

// Clean out existing icon files (keep only the directory)
const existingFiles = readdirSync(ICONS_DIR).filter(f => f.startsWith('Icon') && f.endsWith('.tsx'));
for (const file of existingFiles) {
  unlinkSync(join(ICONS_DIR, file));
}
console.log(`Removed ${existingFiles.length} old icon files`);

// Generate new icon files
for (const icon of icons) {
  const componentName = `Icon${icon.name}`;
  const fileName = `${componentName}.tsx`;

  // Build path elements
  const pathElements = icon.paths.map(p => {
    const attrs = [`d="${p.d}"`];
    if (p.fillRule) attrs.push(`fillRule="${p.fillRule}"`);
    return `<path ${attrs.join(' ')}/>`;
  }).join('');

  const content = `import { IconProps, Icon } from "primitives";
export const ${componentName} = (props: IconProps) => (
  <Icon {...props} viewBox="${icon.viewBox}">${pathElements}</Icon>
);
`;

  writeFileSync(join(ICONS_DIR, fileName), content);
}
console.log(`Generated ${icons.length} new icon files`);

// Generate index.ts
const indexContent = icons
  .map(icon => `export { Icon${icon.name} } from "./Icon${icon.name}.tsx";`)
  .sort()
  .join('\n') + '\n';

writeFileSync(join(ICONS_DIR, 'index.ts'), indexContent);
console.log(`Updated index.ts with ${icons.length} exports`);

// Print icon name mapping for reference
console.log('\n--- Icon names ---');
icons.forEach(i => console.log(`  Icon${i.name}`));

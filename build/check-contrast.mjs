#!/usr/bin/env node
// Enforces tokens/contrast.json against every variant. Run with `npm run check`.

import { fileURLToPath } from 'node:url';
import { contrast } from './lib/color.mjs';
import { loadTokens, readJson } from './lib/load.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

const { variants } = await loadTokens(root);
const { rules } = await readJson(root, 'tokens/contrast.json');

let checked = 0;
let failures = 0;

for (const [id, variant] of Object.entries(variants)) {
  console.log(`\n${variant.label} (${id})`);
  for (const rule of rules) {
    for (const fg of rule.fg) {
      for (const role of [fg, rule.bg]) {
        if (!variant.roles[role]) throw new Error(`contrast.json references unknown role "${role}"`);
      }
      const ratio = contrast(variant.roles[fg], variant.roles[rule.bg]);
      const ok = ratio >= rule.min;
      checked++;
      if (!ok) failures++;
      console.log(
        `  ${ok ? 'ok  ' : 'FAIL'} ${fg.padEnd(22)} on ${rule.bg.padEnd(16)} ${ratio.toFixed(2)}:1 (min ${rule.min})`,
      );
    }
  }
}

console.log(`\n${checked - failures}/${checked} contrast checks passed.`);
if (failures) {
  console.error(`${failures} check(s) failed. Adjust tokens/semantic.json or tokens/essence.json.`);
  process.exit(1);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { contrast, hexToOklch, hexToRgb, oklchToHex } from '../build/lib/color.mjs';
import { loadTokens } from '../build/lib/load.mjs';
import * as vscode from '../build/targets/vscode.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

test('contrast: black on white is 21:1', () => {
  assert.ok(Math.abs(contrast('#000000', '#FFFFFF') - 21) < 0.01);
});

test('OKLCH round trip stays within one unit per channel', () => {
  for (const hex of ['#1E9BD7', '#F2B01E', '#E8892B', '#A3B83A']) {
    const { L, C, h } = hexToOklch(hex);
    const back = hexToRgb(oklchToHex(L, C, h));
    const original = hexToRgb(hex);
    back.forEach((v, i) => assert.ok(Math.abs(v - original[i]) <= 1, `${hex}, channel ${i}`));
  }
});

test('every seed stays exactly as its palette base', async () => {
  const { essence, palette } = await loadTokens(root);
  for (const [name, seed] of Object.entries(essence.seeds)) {
    assert.equal(palette[name].base, seed.hex.toUpperCase());
  }
});

test('every variant defines exactly the roles in tokens/roles.json', async () => {
  // loadTokens throws when a role is missing or unknown.
  await loadTokens(root);
});

test('the VS Code target resolves every role it references', async () => {
  const { variants } = await loadTokens(root);
  for (const [variantId, variant] of Object.entries(variants)) {
    const [themeFile] = await vscode.build({ root, variantId, variant });
    const theme = JSON.parse(themeFile.content);
    assert.ok(Object.keys(theme.colors).length > 50, 'expected a substantial colors map');
    for (const value of Object.values(theme.colors)) {
      assert.match(value, /^#[0-9A-F]{6}([0-9A-F]{2})?$/);
    }
  }
});

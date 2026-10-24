import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { generatePalette } from './palette.mjs';
import { resolveRoles } from './resolve.mjs';

export async function readJson(root, rel) {
  return JSON.parse(await readFile(join(root, rel), 'utf8'));
}

/** Loads every token file, builds the palette, and resolves each variant's roles to hex. */
export async function loadTokens(root) {
  const essence = await readJson(root, 'tokens/essence.json');
  const semantic = await readJson(root, 'tokens/semantic.json');
  const rolesDoc = await readJson(root, 'tokens/roles.json');

  const spec = Object.assign({}, ...rolesDoc.groups.map((g) => g.roles));
  const palette = generatePalette(essence);

  const variants = {};
  for (const [id, variant] of Object.entries(semantic.variants)) {
    assertRoles(id, variant.roles, spec);
    variants[id] = { ...variant, roles: resolveRoles(variant.roles, palette) };
  }

  return { essence, rolesDoc, palette, variants };
}

function assertRoles(id, roles, spec) {
  const missing = Object.keys(spec).filter((r) => !(r in roles));
  const unknown = Object.keys(roles).filter((r) => !(r in spec));
  if (missing.length || unknown.length) {
    throw new Error(
      `Variant "${id}" does not match tokens/roles.json.` +
        (missing.length ? ` Missing: ${missing.join(', ')}.` : '') +
        (unknown.length ? ` Unknown: ${unknown.join(', ')}.` : ''),
    );
  }
}

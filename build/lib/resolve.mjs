import { withAlpha } from './color.mjs';

/** "azul.base" | "neutral.900" | "#RRGGBB" -> "#RRGGBB" */
export function resolveRef(ref, palette) {
  if (/^#[0-9a-f]{6}$/i.test(ref)) return ref.toUpperCase();
  const [family, step] = ref.split('.');
  const hex = palette[family]?.[step];
  if (!hex) throw new Error(`Unknown palette reference: "${ref}"`);
  return hex;
}

/** { role: "family.step" } -> { role: "#RRGGBB" } */
export function resolveRoles(variantRoles, palette) {
  const out = {};
  for (const [role, ref] of Object.entries(variantRoles)) {
    out[role] = resolveRef(ref, palette);
  }
  return out;
}

/**
 * Mapping layers (per-app files) refer to colors as "role" or "role@35",
 * where 35 is an alpha percentage. Returns #RRGGBB or #RRGGBBAA.
 */
export function colorFor(spec, roles) {
  const [role, alpha] = spec.split('@');
  const hex = roles[role];
  if (!hex) throw new Error(`Unknown role in mapping: "${role}"`);
  return alpha === undefined ? hex : withAlpha(hex, Number(alpha));
}

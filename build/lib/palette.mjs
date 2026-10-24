import { hexToOklch, oklchToHex } from './color.mjs';

/**
 * Turns the essence (seed colors + a few knobs) into a full palette.
 *
 * For each seed we keep its hue and chroma, and walk it along the lightness ramp.
 * `base` is always the exact seed color, so the bird's real colors stay in the theme.
 * Chroma fades toward the very light and very dark steps (see `chromaFalloff`) so the
 * extremes don't look neon; out-of-gamut colors are pulled back into sRGB.
 */
export function generatePalette(essence) {
  const { seeds, neutral, ramp, params = {} } = essence;
  const chromaScale = params.chromaScale ?? 1;
  const falloff = params.chromaFalloff ?? 1.4;
  const floor = params.chromaFloor ?? 0.2;

  const palette = {};

  for (const [name, seed] of Object.entries(seeds)) {
    const { L: seedL, C: seedC, h } = hexToOklch(seed.hex);
    const scale = { base: seed.hex.toUpperCase() };
    for (const [step, L] of Object.entries(ramp.chromatic)) {
      const factor = Math.max(floor, 1 - falloff * Math.abs(L - seedL));
      scale[step] = oklchToHex(L, seedC * factor * chromaScale, h);
    }
    palette[name] = scale;
  }

  palette.neutral = {};
  for (const [step, L] of Object.entries(ramp.neutral)) {
    palette.neutral[step] = oklchToHex(L, neutral.chroma, neutral.hue);
  }

  return palette;
}

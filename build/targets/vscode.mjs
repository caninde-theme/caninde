import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { colorFor } from '../lib/resolve.mjs';

export const id = 'vscode';

/**
 * VS Code target. The only app-specific knowledge lives in packages/vscode/mapping.json
 * (which VS Code key or scope uses which semantic role); this file just applies it.
 */
export async function build({ root, variantId, variant }) {
  const mapping = JSON.parse(await readFile(join(root, 'packages/vscode/mapping.json'), 'utf8'));
  const { roles } = variant;

  const settings = ({ role, fontStyle }) => ({
    ...(role ? { foreground: colorFor(role, roles) } : {}),
    ...(fontStyle ? { fontStyle } : {}),
  });

  const theme = {
    $schema: 'vscode://schemas/color-theme',
    name: variant.label,
    type: variant.type,
    semanticHighlighting: true,
    colors: Object.fromEntries(
      Object.entries(mapping.colors).map(([key, spec]) => [key, colorFor(spec, roles)]),
    ),
    tokenColors: mapping.tokenColors.map(({ name, scope, role, fontStyle }) => ({
      name,
      scope,
      settings: settings({ role, fontStyle }),
    })),
    semanticTokenColors: Object.fromEntries(
      Object.entries(mapping.semanticTokenColors).map(([key, value]) => [key, settings(value)]),
    ),
  };

  return [
    {
      path: `packages/vscode/themes/caninde-${variantId}-color-theme.json`,
      content: JSON.stringify(theme, null, 2) + '\n',
    },
    // vsce expects the license next to the extension manifest.
    {
      path: 'packages/vscode/LICENSE',
      content: await readFile(join(root, 'LICENSE'), 'utf8'),
    },
  ];
}

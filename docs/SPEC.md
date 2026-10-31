# Canindé specification (v2.0)

This is the contract for anyone porting Canindé. The goal: any app that follows it should *feel* like Canindé, even though each app exposes very different knobs.

## 1. Architecture

Three layers, and only the last one changes from app to app:

1. **Essence** (`tokens/essence.json`): the seed colors taken from the bird, a neutral, and a few parameters. The palette (`tokens/palette.json`) is *generated* from it in OKLCH, so lightness steps stay perceptually even.
2. **Semantic roles** (`tokens/roles.json`, `tokens/semantic.json`): what a color is *for* (`bg.base`, `syntax.keyword`, `status.error`, `ansi.red`…), resolved per variant. The full list is in [ROLES.md](ROLES.md).
3. **App mapping** (`packages/<app>/`): which role goes where in a given app.

Rule of thumb: **if you are typing a hex code in an app mapping, you are in the wrong layer.** Use a role. If no role fits, propose a new one (see §8).

## 2. The essence

| Field | Effect |
| --- | --- |
| `seeds.<name>.hex` | The exact color. It is exposed as `<name>.base` and its scale (`50`…`950`) keeps the same hue and chroma. |
| `neutral.hue` / `neutral.chroma` | The tint of backgrounds, borders and text. |
| `params.chromaScale` | Multiplies chroma of every seed scale. `1` is the identity. |
| `params.chromaFalloff` / `chromaFloor` | How quickly chroma fades toward very light and very dark steps. |
| `ramp.chromatic` / `ramp.neutral` | OKLCH lightness of each step. |

Seeds marked `"from": "ave"` come from the bird. `urucum` (`"cultura"`) and `ipe` (`"flora"`) are deliberate additions from Brazilian culture and nature, because the bird has no red or purple.

## 3. Rules of use

These rules are what make a port recognizably Canindé.

| Hue | Used for | Never used for |
| --- | --- | --- |
| **Blue** | Keywords, tags, focus, links, primary buttons, the status bar | Errors |
| **Gold** | Functions, cursor, active markers, badges, bright highlights | Large surfaces, errors |
| **Sky** | Strings, success, additions | Warnings |
| **Orange** | Numbers, constants, parameters, warnings | Errors |
| **Green** | Types, info messages, ANSI cyan | Errors |
| **Red** | Errors, deletions, invalid code | Anything else |
| **Glow** | Decorators, escapes, regular expressions, ANSI magenta | Common tokens |

Additional rules:

- Comments are **always italic** and use `syntax.comment`.
- Parameters and `this`/`self` are italic.
- Markdown headings and bold are bold; quotes are italic; links are underlined.
- The **cursor is gold** (`accent.secondary`), and active markers (active tab top border, activity bar marker) are gold.
- The **status bar is blue** (`accent.primary`) with `fg.inverse` text.
- Backgrounds use the three surface roles to create depth: chrome (`bg.sunken`) is darker than the canvas (`bg.base`), floating UI (`bg.overlay`) is lighter.
- Selection and highlight backgrounds are translucent accents (`role@alpha`) so they work over any surface.

## 4. Terminal (ANSI)

| ANSI | Role | Hue |
| --- | --- | --- |
| black / bright black | `ansi.black` / `ansi.brightBlack` | neutral (dim text uses bright black) |
| red | `ansi.red` | red |
| green | `ansi.green` | sky |
| yellow | `ansi.yellow` | gold |
| blue | `ansi.blue` | blue |
| magenta | `ansi.magenta` | glow |
| cyan | `ansi.cyan` | green |
| white | `ansi.white` | neutral |

Bright variants are the lighter step of the same hue. Terminal foreground is `fg.default`, background is `bg.base`, cursor is `accent.secondary`.

## 5. Accessibility

Contrast is a build-time gate, not a promise. `tokens/contrast.json` lists pairs and minimum ratios, and `npm run check` fails the build if any pair drops below:

- **7:1** for default text on the main canvas.
- **4.5:1** (WCAG AA) for every other text role on the surfaces it appears on.

Do not rely on color alone to separate errors from warnings; use icons, underlines or labels where the app allows it.

## 6. Variants

A variant is one entry under `variants` in `tokens/semantic.json`, mapping every role to a palette reference. The build generates one theme per variant per app.

- v0.1 ships the dark variant **Canindé**.
- Planned: a light variant (**Canindé Claro**), then high-contrast and color-blind friendly variants.
- Every variant must define exactly the roles in `tokens/roles.json` (the build fails otherwise) and pass `tokens/contrast.json`.

## 7. Naming

- Display name: **Canindé**, with the accent. Light variant: **Canindé Claro**.
- Technical IDs, package names, file names and URLs: **`caninde`**, ASCII, lowercase. Variant ids are `caninde-dark`, `caninde-light`.

## 8. Changing the spec

The spec uses [Semantic Versioning](https://semver.org/):

- **Patch:** tweaking values or mappings without changing the contract.
- **Minor:** adding roles, variants or rules.
- **Major:** removing or renaming roles, or changing the meaning of an existing role.

To propose a new role, open an issue describing the role, which apps need it, and a suggested value for each variant.

![arara](https://github.com/caninde-theme/caninde/blob/main/assets/arara.jpg)
_Photo by [LeonardoRamos](https://commons.wikimedia.org/wiki/User:LeonardoRamos), licensed under [CC BY-SA 4.0](https://creativecommons.org) via Wikimedia Commons._

# Canindé 🦜

[🇧🇷 Português](README.md) · **🇺🇸 English**

> An open-source color theme inspired by the **Arara-Canindé** (blue-and-yellow macaw): blue on the back, gold on the chest, and a deep beak-black canvas for your code to breathe.

> **Status:** v0.1, work in progress. Not yet published to the Marketplace.

## The story

The Arara-Canindé (*Ara ararauna*) is one of Brazil's most recognizable birds: vivid blue back and wings, a golden chest, a white face patch lined with black, a touch of green on the crown, and a large, curved black beak.

Canindé starts from those colors and turns them into a **theme system** for editors and terminals: dark, saturated just enough, and accessible by contrast. VS Code is the first target. The goal is for the community to carry the same identity to other apps.

## The palette (the essence)

| Visualização | Color | Hex | Where it comes from |
| :---: | --- | --- | --- |
| ![#1E9BD7](https://shields.io) | Azul (blue) | `#1E9BD7` | Back and wings. The brand color |
| ![#2BB5B0](https://shields.io) | Turquesa (turquoise) | `#2BB5B0` | Where the green crown meets the blue |
| ![#A3B83A](https://shields.io) | Verde (green) | `#A3B83A` | Crown |
| ![#F2B01E](https://shields.io) | Ouro (gold) | `#F2B01E` | Chest. The highlight color |
| ![#E8892B](https://shields.io) | Laranja (orange) | `#E8892B` | Neck, the warm transition |
| ![#E85D52](https://shields.io) | Urucum (annatto red) | `#E85D52` | Not on the bird: annatto pigment, reserved for errors |
| ![#C77FD8](https://shields.io) | Ipê (purple) | `#C77FD8` | Not on the bird: ipê blossoms, a rare accent |



Backgrounds and text come from a "beak-black" neutral with a faint blue tint, defined in `tokens/essence.json`.

## How it works

The essence lives in one place. Every app is just a generator that reads those tokens:

```
tokens/essence.json      seed colors and parameters (you edit)
        │
        ▼
tokens/palette.json      scales generated in OKLCH (generated)
        │
tokens/semantic.json     roles: bg.base, syntax.keyword, ansi.red… (you edit)
        │
        ▼
packages/<app>/          role-to-app mapping + generator
```

- **Tokens, not loose colors:** no app mapping uses raw hex, only roles. Change a seed color and everything regenerates.
- **Verified contrast:** `npm run check` enforces WCAG AA (7:1 for default text) on every build.
- **A clear contract:** [`docs/SPEC.md`](docs/SPEC.md) and [`docs/ROLES.md`](docs/ROLES.md) say which color goes to which role, so anyone can port it to another app and keep the identity.

## Getting started (development)

Requirements: **Node.js 18+**. There are no dependencies to install.

```bash
git clone https://github.com/caninde-theme/caninde.git
cd caninde
npm run verify     # build + contrast + tests
```

To see the theme in VS Code, open the project folder and press **F5**. An *Extension Development Host* window opens on the `samples/` folder (TypeScript, Python, HTML, Markdown and JSON) so you can judge the theme. Use **Developer: Inspect Editor Tokens and Scopes** to find which scope to color.

## Tweak the essence

Edit `tokens/essence.json`, run `npm run build`, and see the result:

- **`seeds`**: each seed color (change the hex and its whole scale is recomputed).
- **`neutral`**: hue and chroma of backgrounds and text.
- **`params.chromaScale`**: global saturation (`0.8` softens everything).
- **`ramp`**: the lightness of each scale step.

To create variants (light, high contrast, color-blind friendly), add an entry to `tokens/semantic.json`. See [`docs/SPEC.md`](docs/SPEC.md).

## Apps

| App | Status |
| --- | --- |
| VS Code | ✅ v0.1 (dark) |
| Terminals (Alacritty, Windows Terminal, iTerm2, Kitty, WezTerm) | 💡 contributions wanted |
| Vim / Neovim | 💡 contributions wanted |
| JetBrains, Obsidian, GitHub, Slack… | 💡 contributions wanted |

## Contributing

Want to bring Canindé to your favorite app? Start with [`docs/PORTING.md`](docs/PORTING.md) and open an issue with the **New app port** template (label `good first port`). See also [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues and PRs in Portuguese are very welcome too.


## Acknowledgments

Some of the code (syntax) examples were taken from the [syntax-highlighting-samples](https://github.com/uloco/syntax-highlighting-samples) repository.

## Created by

**Andre Duarch** ([@duarch](https://github.com/duarch)), creator and maintainer, and [everyone who contributes](https://github.com/caninde-theme/caninde/graphs/contributors).

## License

[MIT](LICENSE)

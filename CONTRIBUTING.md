# Contributing to Canindé

Thank you for helping! Issues and pull requests in **English or Portuguese** are both welcome.

## Ways to contribute

- **Port Canindé to a new app.** The most valuable contribution. Start with [docs/PORTING.md](docs/PORTING.md) and open a **New app port** issue (label `good first port`).
- **Report a color problem.** Wrong color for a token, low contrast, something unreadable. Use the **Color or contrast problem** issue template and include a screenshot.
- **Improve the docs.** Typos, clearer explanations, translations.
- **Propose a palette change.** See below, these need discussion first.

## Development setup

You need **Node.js 18+**. There are no dependencies to install.

```bash
git clone https://github.com/caninde-theme/caninde.git
cd caninde
npm run verify
```

Open the folder in VS Code and press **F5** to launch the theme on the files in `samples/`.

## Ground rules

1. **Never edit generated files by hand.** `tokens/palette.json`, `docs/ROLES.md`, and everything under `packages/*/themes/` are produced by `npm run build`. Edit the sources and rebuild.
2. **Use roles, not hex.** App mappings refer to semantic roles ([docs/ROLES.md](docs/ROLES.md)). If the role you need does not exist, propose one.
3. **Keep the contract.** Follow the rules of use in [docs/SPEC.md](docs/SPEC.md).
4. **Run `npm run verify` before pushing.** It builds, checks contrast and runs the tests. CI runs the same, and also fails if committed generated files are out of date.
5. **Show, don't tell.** For anything visual, attach before/after screenshots.

## Changing the palette or the essence

Edits to `tokens/essence.json` or `tokens/semantic.json` change how every app looks, so please **open an issue first** with:

- what you want to change and why,
- before/after screenshots on the same sample file,
- the output of `npm run check`.

## Commits and pull requests

- Small, focused PRs are easier to review.
- Clear commit messages. [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`) are appreciated but not required.
- Fill in the pull request template.

## License

Canindé is released under the [MIT License](LICENSE). By contributing, you agree that your contributions are licensed under the same terms. You keep the copyright on your own contributions, and your authorship stays in the Git history and on the contributors page.

## Code of conduct

Everyone participating is expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

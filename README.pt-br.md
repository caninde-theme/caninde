![arara](https://github.com/caninde-theme/caninde/blob/main/assets/arara.jpg)
_Foto por [LeonardoRamos](https://commons.wikimedia.org/wiki/User:LeonardoRamos), licenciada sob [CC BY-SA 4.0](https://creativecommons.org) via Wikimedia Commons._


# Canindé 🦜

**🇧🇷 Português** · [🇺🇸 English](README.md)

> Um tema de cores open source inspirado na **Arara-Canindé**: azul no dorso, ouro no peito e um preto-bico profundo para o código respirar.

> **Status:** v0.1, em desenvolvimento. Ainda não publicado no Marketplace.

## A história

A Arara-Canindé (*Ara ararauna*) é uma das aves mais reconhecíveis do Brasil: dorso e asas num azul vibrante, peito dourado, uma máscara branca riscada de preto, um toque de verde na coroa e um bico preto, grande e curvo.

Canindé parte dessas cores e as transforma em um **sistema de tema** para editores e terminais: escuro, saturado na medida certa e com contraste acessível. O VS Code é o primeiro destino. A ideia é que a comunidade leve a mesma identidade para outros apps.

## A paleta (a essência)

| Amostra | Cor | Hex | De onde vem |
| :---: | --- | --- | --- |
| ![](https://img.shields.io/badge/-%23039EF0-039EF0?style=flat-square) | **Blue** Bell | `#1E9BD7` | Costas e asas. A cor da marca |
| ![](https://img.shields.io/badge/-%237CCB04-7CCB04?style=flat-square) | Yellow **Green** | `#2BB5B0` | Onde a coroa verde encontra o azul |
| ![](https://img.shields.io/badge/-%2369B1CD-69B1CD?style=flat-square) | **Sky** Reflection | `#A3B83A` | Partes das asas |
| ![](https://img.shields.io/badge/-%23DFAB07-DFAB07?style=flat-square) | **Gold**enrod | `#F2B01E` | Peito. A cor de destaque |
| ![](https://img.shields.io/badge/-%23EE7B00-EE7B00?style=flat-square) | Tiger **Orange** | `#E8892B` | Cabeça da Arara-vermelha (Ara chloropterus). |
| ![](https://img.shields.io/badge/-%23D41015-D41015?style=flat-square) | Flag **Red** | `#E85D52` | Vem de uma variação da Arara-Canindé, a Arara-vermelha (Ara chloropterus). |
| ![](https://img.shields.io/badge/-%23DFCF00-DFCF00?style=flat-square) | Golden **Glow** | `#C77FD8` | Partes das asas |

Fundo e texto vêm de um neutro "preto-bico" com um leve tom azulado, em `tokens/essence.json`.

## Como funciona

A essência vive em um único lugar. Cada app é só um gerador que lê esses tokens:

```
tokens/essence.json      cores-semente e parâmetros (você edita)
        │
        ▼
tokens/palette.json      escalas geradas em OKLCH (gerado)
        │
tokens/semantic.json     papéis: bg.base, syntax.keyword, ansi.red… (você edita)
        │
        ▼
packages/<app>/          mapeamento de papéis para o app + gerador
```

- **Tokens, não cores soltas:** nenhum mapeamento de app usa hex direto, só papéis. Troque uma cor-semente e tudo se regenera.
- **Contraste verificado:** `npm run check` garante WCAG AA (7:1 para o texto padrão) em cada build.
- **Contrato claro:** [`docs/SPEC.md`](docs/SPEC.md) e [`docs/ROLES.md`](docs/ROLES.md) dizem qual cor vai em qual papel, e qualquer pessoa consegue portar para outro app mantendo a identidade.

## Começando (desenvolvimento)

Requisitos: **Node.js 18+**. Não há dependências para instalar.

```bash
git clone https://github.com/caninde-theme/caninde.git
cd caninde
npm run verify     # build + contraste + testes
```

Para ver o tema no VS Code, abra a pasta do projeto e pressione **F5**. Uma janela *Extension Development Host* abre com a pasta `samples/` (TypeScript, Python, HTML, Markdown e JSON) para você avaliar o tema. Use **Developer: Inspect Editor Tokens and Scopes** para descobrir qual escopo colorir.

## Parametrize a essência

Edite `tokens/essence.json`, rode `npm run build` e veja o resultado:

- **`seeds`**: cada cor-semente (troque o hex e a escala inteira é recalculada).
- **`neutral`**: matiz e croma do fundo e do texto.
- **`params.chromaScale`**: saturação global (`0.8` deixa tudo mais suave).
- **`ramp`**: a luminosidade de cada degrau das escalas.

Para criar variantes (claro, alto contraste, daltônicos), adicione uma entrada em `tokens/semantic.json`. Veja [`docs/SPEC.md`](docs/SPEC.md).

## Apps

| App | Status |
| --- | --- |
| VS Code | ✅ v0.1 (escuro) |
| Terminais (Alacritty, Windows Terminal, iTerm2, Kitty, WezTerm) | 💡 procuramos contribuições |
| Vim / Neovim | 💡 procuramos contribuições |
| JetBrains, Obsidian, GitHub, Slack… | 💡 procuramos contribuições |

## Contribua

Quer levar o Canindé para o seu app favorito? Comece pelo [`docs/PORTING.md`](docs/PORTING.md) e abra uma issue com o modelo **New app port** (etiqueta `good first port`). Veja também o [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues e PRs em português são muito bem-vindos.

## Agradecimentos

Parte dos exemplos de códigos(sintaxe) foram tirados do repositório [syntax-highlighting-samples](https://github.com/uloco/syntax-highlighting-samples)

## Criado por

**Andre Duarch** ([@duarch](https://github.com/duarch)), criador e mantenedor, e [todas as pessoas que contribuem](https://github.com/caninde-theme/caninde/graphs/contributors).

## Licença

[MIT](LICENSE)

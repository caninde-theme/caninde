![arara](https://github.com/caninde-theme/caninde/blob/main/assets/arara.jpg)
_Foto por [LeonardoRamos](https://commons.wikimedia.org/wiki/User:LeonardoRamos), licenciada sob [CC BY-SA 4.0](https://creativecommons.org) via Wikimedia Commons._


# Canindé 🦜

**🇧🇷 Português** · [🇺🇸 English](README.en.md)

> Um tema de cores open source inspirado na **Arara-Canindé**: azul no dorso, ouro no peito e um preto-bico profundo para o código respirar.

> **Status:** v0.1, em desenvolvimento. Ainda não publicado no Marketplace.

## A história

A Arara-Canindé (*Ara ararauna*) é uma das aves mais reconhecíveis do Brasil: dorso e asas num azul vibrante, peito dourado, uma máscara branca riscada de preto, um toque de verde na coroa e um bico preto, grande e curvo.

Canindé parte dessas cores e as transforma em um **sistema de tema** para editores e terminais: escuro, saturado na medida certa e com contraste acessível. O VS Code é o primeiro destino. A ideia é que a comunidade leve a mesma identidade para outros apps.

## A paleta (a essência)

| Cor | Hex | De onde vem |
| --- | --- | --- |
| Azul | `#1E9BD7` | Dorso e asas. A cor da marca |
| Turquesa | `#2BB5B0` | Onde a coroa verde encontra o azul |
| Verde | `#A3B83A` | Coroa |
| Ouro | `#F2B01E` | Peito. A cor de destaque |
| Laranja | `#E8892B` | Pescoço, a transição quente |
| Urucum | `#E85D52` | Fora da ave: o pigmento do urucum, reservado para erros |
| Ipê | `#C77FD8` | Fora da ave: flores de ipê, um acento raro |

## The palette (the essence)

| Visualização | Color | Hex | Where it comes from |
| :---: | --- | --- | --- |
| ![#1E9BD7](https://img.shields.io/static/v1?label=&message=%231E9BD7&color=1E9BD7&style=flat-square) | Azul | `#1E9BD7` | Dorso e asas. A cor da marca |
| ![#2BB5B0](https://img.shields.io/static/v1?label=&message=%232BB5B0&color=2BB5B0&style=flat-square) | Turquesa | `#2BB5B0` | Onde a coroa verde encontra o azul |
| ![#A3B83A](https://img.shields.io/static/v1?label=&message=%23A3B83A&color=A3B83A&style=flat-square) | Verde | `#A3B83A` | Coroa |
| ![#F2B01E](https://img.shields.io/static/v1?label=&message=%23F2B01E&color=F2B01E&style=flat-square) | Ouro | `#F2B01E` | Peito. A cor de destaque |
| ![#E8892B](https://img.shields.io/static/v1?label=&message=%23E8892B&color=E8892B&style=flat-square) | Laranja | `#E8892B` | Pescoço, a transição quente |
| ![#E85D52](https://img.shields.io/static/v1?label=&message=%23E85D52&color=E85D52&style=flat-square) | Urucum | `#E85D52` | Fora da ave: o pigmento do urucum, reservado para erros |
| ![#C77FD8](https://img.shields.io/static/v1?label=&message=%23C77FD8&color=C77FD8&style=flat-square) | Ipê | `#C77FD8` | Fora da ave: flores de ipê, um acento raro |



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

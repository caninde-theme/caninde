# Como lançar uma nova versão do Canindé (VS Code)

Este guia é o passo a passo para publicar uma nova versão da extensão `caninde-theme.caninde` no **VS Code Marketplace** e no **Open VSX**.

Resumo do que acontece: você sobe a versão, abre um PR, faz o merge e **cria uma tag `vX.Y.Z`**. A tag dispara o workflow `.github/workflows/publish.yml`, que valida tudo e publica nas duas lojas, sem nenhum token (usa *Trusted Publishing*).

## Fluxo completo em uma tela

```bash
# 1. Parta da main atualizada e crie um branch
git switch main && git pull
git switch -c release/v2.1.0

# 2. Edite as fontes (veja a tabela abaixo) e valide
npm run verify

# 3. Teste visualmente: abra o projeto no VS Code e aperte F5

# 4. Suba a versão e anote no CHANGELOG
cd packages/vscode && npm version minor --no-git-tag-version && cd ../..
#    edite packages/vscode/CHANGELOG.md

# 5. Valide de novo, faça commit e abra o PR
npm run verify
git add -A && git commit -m "release: v2.1.0"
git push -u origin release/v2.1.0
gh pr create --fill          # ou abra o PR pelo site

# 6. Depois do merge, crie a tag a partir da main
git switch main && git pull
VERSION=$(node -p "require('./packages/vscode/package.json').version")
git tag "v$VERSION" && git push origin "v$VERSION"

# 7. Acompanhe a publicação
gh run watch                 # ou veja a aba Actions
```

## Quem edita o quê

**Arquivos que você edita:**

| Para mudar... | Edite | Observações |
| --- | --- | --- |
| Cores-semente, saturação, escalas | `tokens/essence.json` | `seeds`, `neutral`, `params`, `ramp`. Veja `docs/SPEC.md` §2 |
| Qual cor cada papel usa | `tokens/semantic.json` | Papéis apontam para `semente.degrau` (ex.: `red.500`) |
| Contraste mínimo exigido | `tokens/contrast.json` | Só afrouxe com muita justificativa |
| Qual chave ou escopo do VS Code usa cada papel | `packages/vscode/mapping.json` | `colors`, `tokenColors`, `semanticTokenColors`. Sem hex, só papéis |
| **Número da versão** | `packages/vscode/package.json` (`version`) | Use `npm version` (passo 4) |
| Nome, descrição, ícone, keywords, banner | `packages/vscode/package.json` | Máximo de 30 keywords |
| Notas da versão | `packages/vscode/CHANGELOG.md` | Uma seção nova por versão |
| Página da extensão nas lojas | `packages/vscode/README.md` e `packages/vscode/images/` | Imagens com URL HTTPS ou caminho dentro de `packages/vscode/` |
| Página do GitHub | `README.md` e `README.pt-br.md` | Tabela de paleta, status dos apps |
| Samples de teste | `samples/` | Só material próprio |
| Nova variante (claro, etc.) | `tokens/semantic.json` + `contributes.themes` | Veja a seção "Nova variante" |

**Arquivos gerados (nunca edite à mão):** `tokens/palette.json`, `docs/ROLES.md`, `packages/vscode/themes/*.json` e `packages/vscode/LICENSE`. São produzidos por `npm run build` e **precisam ser commitados**: o CI falha se estiverem desatualizados.

**Não renomeie** `.github/workflows/publish.yml` nem o repositório: as duas lojas confiam no workflow pelo nome. Se mudar, é preciso apagar e recriar as políticas de *Trusted Publishing*.

## Passo a passo

### 1. Prepare o branch

```bash
git switch main && git pull
git switch -c release/v2.1.0
```

### 2. Faça as alterações

Edite apenas os arquivos da primeira tabela. Exemplo de ciclo para ajustar uma cor:

1. Mude o `hex` da semente em `tokens/essence.json`.
2. Rode `npm run build && npm run check`.
3. Se algum par de contraste falhar, ajuste o papel em `tokens/semantic.json` para um degrau mais claro (por exemplo, `red.base` para `red.500`). Veja `docs/SPEC.md` §5.

### 3. Valide

```bash
npm run verify     # build + contraste + testes
```

Tudo precisa passar. O `verify` encadeia os passos: se o contraste falhar, os testes nem rodam.

### 4. Teste visualmente

1. Abra a **raiz** do repositório no VS Code e pressione **F5**.
2. Na janela *Extension Development Host*, abra os arquivos de `samples/` (principalmente `showcase.ts`, `sample.md`, `sample.diff`) e o terminal integrado.
3. Se as cores não baterem com o esperado, verifique `workbench.colorCustomizations` nas suas settings de usuário: ele é aplicado por cima de qualquer tema. Para um teste limpo, acrescente `"--profile-temp"` aos `args` do `.vscode/launch.json`.
4. Se a aparência mudou, atualize os screenshots em `packages/vscode/images/`. Tire-os num perfil limpo.

### 5. Empacote e teste o `.vsix` (recomendado)

```bash
cd packages/vscode
npx @vscode/vsce package
code --install-extension caninde-X.Y.Z.vsix
```

Uma versão publicada **não pode ser reutilizada**, nem depois de apagada. Teste antes de criar a tag.

### 6. Suba a versão

```bash
cd packages/vscode
npm version minor --no-git-tag-version     # ou: patch | major | 2.1.0
cd ../..
```

Isso altera só o campo `version` em `packages/vscode/package.json`. O comando imprime a nova versão, que é a que vai na tag. Veja a seção "Escolhendo o número" mais abaixo.

O `package.json` da **raiz** é privado e não é publicado. Se quiser, mantenha a versão dele alinhada, só para evitar confusão.

### 7. Atualize o CHANGELOG

Em `packages/vscode/CHANGELOG.md`, acrescente uma seção **acima** das anteriores:

```markdown
## [2.1.0] - 2026-11-05

### Added
- ...

### Changed
- ...

### Fixed
- ...
```

Use a data do dia do lançamento e mantenha só as categorias que tiverem itens.

### 8. Atualize a documentação (se a paleta mudou)

- Tabela de paleta nos READMEs (`README.md` e `README.pt-br.md`): hex, nome e descrição devem bater com `tokens/essence.json`.
- Se a história ou o papel de alguma cor mudou, ajuste `docs/SPEC.md` §2 e §3.
- Screenshots do `packages/vscode/README.md`.

### 9. Valide de novo e abra o PR

```bash
npm run verify
git add -A
git commit -m "release: v2.1.0"
git push -u origin release/v2.1.0
gh pr create --fill
```

O workflow `CI` (`.github/workflows/ci.yml`) roda no PR: build, conferência de arquivos gerados, contraste, testes e empacotamento. Faça o merge quando estiver verde.

### 10. Crie a tag (é isso que publica)

```bash
git switch main && git pull
VERSION=$(node -p "require('./packages/vscode/package.json').version")
git tag "v$VERSION"
git push origin "v$VERSION"
```

> **Atenção:** qualquer tag que comece com `v` dispara a publicação. Não crie tags de teste com esse prefixo.

O workflow `Publish` faz:

1. **`verify`**: confere que a tag é igual à versão do `package.json` e roda `npm run verify`.
2. **`open-vsx`** e **`marketplace`**, em paralelo e independentes: cada um publica com um token temporário (OIDC). Se um falhar, o outro continua.

### 11. Confira a publicação

```bash
gh run watch
```

Depois de alguns minutos, confira as duas páginas:

- https://marketplace.visualstudio.com/items?itemName=caninde-theme.caninde
- https://open-vsx.org/extension/caninde-theme/caninde

No VS Code, abra a aba de extensões e veja se aparece a atualização do Canindé.

### 12. Crie a release no GitHub (opcional)

```bash
gh release create "v$VERSION" --generate-notes
```

Ou copie as notas do `CHANGELOG.md` pela interface do site.

## Escolhendo o número da versão

Seguimos o [Semantic Versioning](https://semver.org/). O Marketplace só aceita `major.minor.patch`, sem sufixos como `-beta`.

| Tipo | Quando usar | Exemplos |
| --- | --- | --- |
| **patch** (`2.0.1`) | Correção de mapping, contraste ou cor pontual, sem mudar a identidade | Escopo de sintaxe que estava branco; badge com a cor errada |
| **minor** (`2.1.0`) | Novidade compatível | Nova variante, novas chaves de interface, novos papéis |
| **major** (`3.0.0`) | A identidade visual muda de forma perceptível, ou o contrato do `SPEC.md` quebra | Nova paleta, renomear ou remover papéis |

## Nova variante (por exemplo, "Canindé Claro")

1. Em `tokens/semantic.json`, acrescente uma entrada em `variants` (por exemplo, `"light"`), com `label`, `type: "light"` e **todos** os papéis de `tokens/roles.json`. O build falha se faltar algum.
2. Em `packages/vscode/package.json`, registre o tema em `contributes.themes`:

```json
{
  "label": "Canindé Claro",
  "uiTheme": "vs",
  "path": "./themes/caninde-light-color-theme.json"
}
```

3. Rode `npm run verify`. O contraste é conferido para cada variante.
4. Faça uma release **minor** seguindo os passos acima.

## Problemas comuns

| Sintoma | Causa e solução |
| --- | --- |
| `verify` falha em `FAIL ... on bg.base` | Contraste abaixo do mínimo. Clareie a semente ou use um degrau mais claro no `semantic.json` |
| `Unknown palette reference` | Uma referência do `semantic.json` usa um nome de semente que não existe mais. Corrija o nome |
| CI falha em "Generated files are up to date" | Você esqueceu de commitar os arquivos gerados. Rode `npm run build` e commite |
| O job `verify` do Publish falha na conferência da tag | A tag não é igual à versão do `package.json`. Apague a tag, corrija e recrie (comandos abaixo) |
| Marketplace: versão já existe | Números de versão nunca são reutilizados. Suba o patch e crie uma tag nova |
| `No trusted publisher matches the presented token` | Confira dono, repositório e nome do workflow na política da loja, se a extensão ainda tem versão ativa e se o `publisher` do `package.json` tem a mesma caixa do namespace |
| Um job publicou e o outro falhou | Na aba Actions, use **Re-run failed jobs**. Não rode tudo de novo: a loja que já publicou rejeita a mesma versão |
| `vsce package`: ícone não encontrado | O caminho de `icon` no `package.json` não existe ou está no `.vscodeignore` |
| Cores diferentes do esperado no seu VS Code | `workbench.colorCustomizations` nas suas settings de usuário sobrescrevendo o tema |

Para desfazer uma tag errada (só antes de a publicação concluir):

```bash
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
```

## Configuração que já existe (não precisa refazer)

- **VS Code Marketplace:** publisher `caninde-theme`, com uma política de *Trusted Publishing* (dono `caninde-theme`, repositório `caninde`, workflow `publish.yml`, ambiente em branco).
- **Open VSX:** namespace `caninde-theme`, com um *Trusted Publisher* registrado para o mesmo repositório e workflow. Nenhum token fica salvo no GitHub.
- **Workflows:** `ci.yml` (PRs e `main`) e `publish.yml` (tags `v*`).

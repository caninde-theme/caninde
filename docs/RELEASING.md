# Como lançar uma nova versão do Canindé (VS Code)

Este guia é o passo a passo para publicar uma nova versão da extensão `caninde-theme.caninde` no **VS Code Marketplace** e no **Open VSX**. Foi escrito para quem nunca fez uma release.

## A ideia em 30 segundos

1. Você muda o tema nos arquivos-fonte e testa.
2. Você **decide o número da nova versão** e o grava no `package.json`.
3. Você abre um *pull request*, faz o merge na `main` e cria uma **tag** com esse número.
4. A tag dispara o GitHub Actions, que publica nas duas lojas sozinho, sem token.

## Onde está registrada a versão

A versão da extensão fica em **um único lugar**: o campo `"version"` do arquivo `packages/vscode/package.json`.

```json
{
  "name": "caninde",
  "version": "2.0.0",
  ...
}
```

Para ver a versão atual a qualquer momento (rode na raiz do repositório):

```bash
node -p "require('./packages/vscode/package.json').version"
```

Para ver o histórico do que já foi publicado, olhe as **tags** do Git:

```bash
git tag --sort=-v:refname | head -5
```

Se ainda não houver tags (por exemplo, a primeira versão foi enviada à mão), o `package.json` é a sua versão-base. O `package.json` da **raiz** do repositório tem outra versão, mas ele é privado e não é publicado: ignore-o.

## Pequeno glossário

| Termo | O que é |
| --- | --- |
| **Branch** | Uma cópia de trabalho do projeto onde você mexe sem afetar a `main` |
| **Commit** | Um "salvar" do seu trabalho no histórico do Git |
| **Pull request (PR)** | O pedido para juntar o seu branch na `main`. É nele que o CI confere tudo |
| **Merge** | A junção em si, feita depois que o CI passou |
| **Tag** | Uma etiqueta num commit, como `v2.1.0`. Aqui, **criar a tag é o que publica** |
| **CI** | Os testes automáticos do GitHub Actions |

## Como escolher o número da versão

O número tem três partes: `MAJOR.MINOR.PATCH`, por exemplo `2.1.3`. Você escolhe **o tipo** de mudança, e o comando calcula o número. Parta da versão atual (aqui, `2.0.0`):

| Tipo | Quando usar | `2.0.0` vira |
| --- | --- | --- |
| **patch** | Só corrigi algo: um escopo de sintaxe, um contraste, uma cor pontual | `2.0.1` |
| **minor** | Acrescentei algo sem mudar o que existia: nova variante, novas chaves de interface | `2.1.0` |
| **major** | A cara do tema mudou de forma perceptível (nova paleta), ou o contrato do `SPEC.md` quebrou | `3.0.0` |

Regra prática: *consertei* é patch, *acrescentei* é minor, *mudei a identidade* é major. Em dúvida, escolha patch ou minor.

O Marketplace só aceita três números, sem sufixos como `-beta`. E **um número já publicado nunca pode ser reutilizado**, nem se você apagar a versão. Se já enviou a `2.0.0` à mão, a próxima precisa ser a `2.0.1` ou maior.

## O fluxo completo em uma tela

Na ordem em que se executa. Os trechos entre `<...>` são coisas que você decide.

```bash
# 1. Comece da main atualizada e crie um branch (o nome é livre)
git switch main && git pull
git switch -c release/proxima-versao

# 2. Edite os arquivos-fonte (tabela abaixo) e valide
npm run verify

# 3. Teste visualmente: abra o projeto no VS Code e aperte F5

# 4. Decida o tipo da mudança e grave a nova versão
cd packages/vscode
npm version <patch|minor|major> --no-git-tag-version   # imprime a nova versão, ex.: v2.1.0
cd ../..

# 5. Anote no CHANGELOG usando essa versão (packages/vscode/CHANGELOG.md)

# 6. Empacote e teste o arquivo .vsix (já com a versão nova no nome)
cd packages/vscode
npx @vscode/vsce package
code --install-extension "caninde-$(node -p "require('./package.json').version").vsix"
cd ../..

# 7. Valide de novo, faça commit e abra o PR
npm run verify
git add -A && git commit -m "release: <versão>"
git push -u origin release/proxima-versao
gh pr create --fill            # ou abra o PR pelo site do GitHub

# 8. Depois do merge, crie a tag a partir da main (isso publica)
git switch main && git pull
VERSION=$(node -p "require('./packages/vscode/package.json').version")
git tag "v$VERSION" && git push origin "v$VERSION"

# 9. Acompanhe
gh run watch                   # ou a aba Actions no GitHub
```

## Um exemplo do começo ao fim

Situação: a versão atual é `2.0.0` e você corrigiu a cor de um escopo de sintaxe.

1. Você editou `packages/vscode/mapping.json`, rodou `npm run verify` e testou no F5.
2. É uma correção, então o tipo é **patch**:
   ```bash
   cd packages/vscode
   npm version patch --no-git-tag-version
   ```
   O comando imprime `v2.0.1` e muda o `"version"` do `package.json` de `2.0.0` para `2.0.1`. Pronto, agora você sabe a versão.
3. No `CHANGELOG.md`, você cria a seção `## [2.0.1] - 2026-11-03` e descreve a correção.
4. Você empacota (`npx @vscode/vsce package`), e o arquivo sai com o número no nome: `caninde-2.0.1.vsix`.
5. Commit, PR, merge, e por fim a tag `v2.0.1`. O GitHub publica.

## Perguntas frequentes sobre a versão

**O `X.Y.Z` do guia antigo era um placeholder?** Sim. Era o lugar do número real da versão (por exemplo, `2.0.1`). O comando `vsce package` **não gera** a versão: ele lê o `package.json` e usa o número no nome do arquivo. Por isso a versão precisa ser gravada **antes** de empacotar (passos 4 e 6).

**Quem define a versão, eu ou o comando?** Você escolhe o *tipo* (patch, minor ou major). O `npm version` faz a conta a partir da versão atual, grava no `package.json` e imprime o resultado. Se preferir, informe o número exato: `npm version 2.1.0 --no-git-tag-version`.

**Preciso saber a versão ao criar o branch?** Não. O nome do branch é livre. Você só decide a versão **depois** de saber o que mudou (passo 4).

**O que significa `--no-git-tag-version`?** Que o `npm version` só altera o arquivo e **não** cria commit nem tag. A tag é criada por você no passo 8, depois do merge.

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

## Detalhes de cada passo

### 2. Faça as alterações

Edite apenas os arquivos da tabela acima. Exemplo de ciclo para ajustar uma cor:

1. Mude o `hex` da semente em `tokens/essence.json`.
2. Rode `npm run build && npm run check`.
3. Se algum par de contraste falhar, ajuste o papel em `tokens/semantic.json` para um degrau mais claro (por exemplo, `red.base` para `red.500`). Veja `docs/SPEC.md` §5.

`npm run verify` faz tudo em sequência: build, contraste e testes. Se o contraste falhar, os testes nem rodam.

### 3. Teste visualmente

1. Abra a **raiz** do repositório no VS Code e pressione **F5**.
2. Na janela *Extension Development Host*, abra os arquivos de `samples/` (principalmente `showcase.ts`, `sample.md` e `sample.diff`) e o terminal integrado.
3. Se as cores não baterem com o esperado, verifique `workbench.colorCustomizations` nas suas settings de usuário: ele é aplicado por cima de qualquer tema. Para um teste limpo, acrescente `"--profile-temp"` aos `args` do `.vscode/launch.json`.
4. Se a aparência mudou, atualize os screenshots em `packages/vscode/images/` (tire-os num perfil limpo).

### 5. CHANGELOG

Em `packages/vscode/CHANGELOG.md`, acrescente uma seção **acima** das anteriores, com a versão do passo 4 e a data de hoje:

```markdown
## [2.0.1] - 2026-11-03

### Fixed
- Cor do escopo X estava sem destaque.
```

Categorias possíveis: `Added` (novidade), `Changed` (mudança), `Fixed` (correção). Use só as que tiverem itens.

### 6. Empacotar e testar o `.vsix`

O arquivo é criado em `packages/vscode/`, com a versão no nome (por exemplo, `caninde-2.0.1.vsix`). Para ver o nome exato: `ls packages/vscode/*.vsix`. Arquivos `.vsix` antigos ficam acumulados, mas o Git os ignora e você pode apagá-los.

Instale-o e confira três coisas: o ícone aparece, o tema "Canindé" está na lista de temas, e as cores batem com o F5.

### 7. Documentação (se a paleta mudou)

- Tabela de paleta nos READMEs: hex, nome e descrição devem bater com `tokens/essence.json`.
- Se o papel ou a história de alguma cor mudou, ajuste `docs/SPEC.md` §2, §3 e §4.
- Screenshots do `packages/vscode/README.md`.

### 8. A tag (é isso que publica)

> **Atenção:** qualquer tag que comece com `v` dispara a publicação. Não crie tags de teste com esse prefixo.

O workflow `Publish` faz:

1. **`verify`**: confere que a tag é igual à versão do `package.json` e roda `npm run verify`.
2. **`open-vsx`** e **`marketplace`**, em paralelo e independentes: cada um publica com um token temporário (OIDC). Se um falhar, o outro continua.

### 9. Conferir a publicação

Depois de alguns minutos:

- https://marketplace.visualstudio.com/items?itemName=caninde-theme.caninde
- https://open-vsx.org/extension/caninde-theme/caninde

No VS Code, abra a aba de extensões e veja se aparece a atualização do Canindé. Opcionalmente, crie a release no GitHub: `gh release create "v$VERSION" --generate-notes`.

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

(Aqui `vX.Y.Z` é um placeholder: troque pelo número da tag errada, por exemplo `v2.0.1`.)

## Configuração que já existe (não precisa refazer)

- **VS Code Marketplace:** publisher `caninde-theme`, com uma política de *Trusted Publishing* (dono `caninde-theme`, repositório `caninde`, workflow `publish.yml`, ambiente em branco).
- **Open VSX:** namespace `caninde-theme`, com um *Trusted Publisher* registrado para o mesmo repositório e workflow. Nenhum token fica salvo no GitHub.
- **Workflows:** `ci.yml` (PRs e `main`) e `publish.yml` (tags `v*`).

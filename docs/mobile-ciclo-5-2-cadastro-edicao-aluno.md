# Ciclo 5.2 - Cadastro e edicao do aluno mobile

Data da validacao: 2026-07-13

## Arquivos analisados

- `src/features/alunos/components/AlunosList.jsx`
- `src/features/alunos/components/AlunosHeader.jsx`
- `src/features/alunos/components/AlunoCardMobile.jsx`
- `src/features/alunos/components/AlunosTable.jsx`
- `src/features/alunos/hooks/useAlunosPage.js`
- `src/index.css`
- `scripts/validate-alunos-mobile-cdp.mjs`

## Arquivos alterados

- `src/features/alunos/components/AlunosList.jsx`
- `src/features/alunos/components/AlunosHeader.jsx`
- `src/index.css`
- `package.json`
- `scripts/validate-aluno-form-mobile-cdp.mjs`

## Estrutura original

O formulario de aluno era exibido como modal inline dentro da pagina `/alunos`.

Estrutura original:

- overlay fixo com `position: fixed` e `inset: 0`;
- card centralizado com `maxHeight: calc(100vh - 48px)`;
- scroll aplicado no proprio card;
- cabecalho e formulario no mesmo fluxo;
- botao `Salvar` dentro do grid de campos;
- sem rodape separado;
- sem area rolavel nomeada;
- sem seletores estaveis para validacao.

Campos existentes no formulario:

- Nome do aluno;
- WhatsApp;
- Data de nascimento;
- Inicio do plano;
- Plano contratado;
- Vencimento;
- Valor.

O cadastro e a edicao usam o mesmo componente e diferem apenas pelo estado `alunoEditandoId`, que muda o titulo e os valores carregados.

## Causa-raiz

Havia duas causas principais:

- o modal nao tinha a divisao estrutural `cabecalho + conteudo rolavel + rodape`, fazendo o botao de salvar depender do fluxo do grid;
- uma regra responsiva global para `[style*="position: fixed"][style*="inset: 0"]` adicionava `padding: 88px 12px 16px` em mobile, reservando espaco para o cabecalho global e deixando o rodape do formulario cortado no retrato.

## Correcao estrutural

- O modal passou a ser renderizado via `createPortal` no `document.body`.
- O container recebeu `role="dialog"`, `aria-modal`, `aria-labelledby` e `aria-describedby`.
- O formulario passou a usar estrutura flex:
  - `.aluno-form-header`;
  - `.aluno-form-scroll`;
  - `.aluno-form-footer`.
- O body fica bloqueado enquanto o modal esta aberto.
- O rodape contem `Cancelar` e `Salvar`.
- O botao `Fechar` permanece no cabecalho.
- Em ate 640px, o overlay especifico do aluno sobrescreve a regra global antiga e remove o padding de 88px.
- Inputs e selects receberam `max-width: 100%`, `min-width: 0` e `box-sizing: border-box`.
- Foram adicionados seletores estaveis para QA.

## Resultados por area

- Cabecalho: titulo, subtitulo e Fechar ficam visiveis em retrato, paisagem e desktop.
- Area rolavel: criada como `.aluno-form-scroll`; em paisagem e desktop com pouco espaco ela rola ate o final.
- Rodape: `Cancelar` e `Salvar` permanecem acessiveis em todos os viewports.
- Grids: no mobile ficam em uma coluna; desktop preservado.
- Inputs: largura contida, fonte mobile de 16px, sem overflow.
- Selects: trigger contido e texto nao amplia layout.
- Datas: inputs nativos preservados, largura correta.
- Telefone: mascara e regra existente preservadas; `type="tel"` e `autocomplete="tel"`.
- Campos numericos: `Valor` preserva `type="number"`, `step` e recebe `inputMode="decimal"`.
- Observacoes: o campo nao existe no formulario atual; aparece apenas nos detalhes do aluno. Nao foi adicionado campo novo neste ciclo.
- Campos condicionais: selecao de plano segue calculando vencimento/valor pelas regras existentes.
- Validacoes: envio vazio foi provocado sem salvar dados; mensagens via toast existentes foram preservadas.
- Teclado: foco em campo final testado no viewport 390 sem overflow horizontal.
- Cadastro: preenchido sem salvar e cancelado.
- Edicao: aluno real QA aberto, campo alterado temporariamente e cancelado sem persistencia.
- Fechamento/cancelamento: `Fechar` e `Cancelar` fecham o modal e restauram o scroll do body.
- Bottom navigation: nao cobre o formulario nem o rodape.

## Medicoes

Formato: `clientWidth/scrollWidth`.

| Viewport | Fluxo | Documento | Body | Dialog | Scroll | Rodape | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320x800 | cadastro | 320/320 | 320/320 | 289/289 | 289/289 | visivel | aprovado |
| 320x800 | edicao | 320/320 | 320/320 | 289/289 | 289/289 | visivel | aprovado |
| 360x800 | cadastro | 360/360 | 360/360 | 289/289 | 289/289 | visivel | aprovado |
| 375x812 | cadastro | 375/375 | 375/375 | 289/289 | 289/289 | visivel | aprovado |
| 390x844 | cadastro | 390/390 | 390/390 | 289/289 | 289/289 | visivel | aprovado |
| 390x844 | edicao | 390/390 | 390/390 | 289/289 | 289/289 | visivel | aprovado |
| 412x915 | cadastro | 412/412 | 412/412 | 289/289 | 289/289 | visivel | aprovado |
| 430x932 | cadastro | 430/430 | 430/430 | 289/289 | 289/289 | visivel | aprovado |
| 800x360 | cadastro | 800/800 | 800/800 | 776/776 | 776/776 | visivel | aprovado |
| 844x390 | cadastro | 844/844 | 844/844 | 820/820 | 820/820 | visivel | aprovado |
| 844x390 | edicao | 844/844 | 844/844 | 820/820 | 820/820 | visivel | aprovado |
| 915x412 | cadastro | 915/915 | 915/915 | 891/891 | 891/891 | visivel | aprovado |
| 1024x768 | cadastro | 1009/1009 | 1009/1009 | 985/985 | 970/970 | visivel | aprovado |
| 1366x768 | cadastro | 1351/1351 | 1351/1351 | 680/680 | 665/665 | visivel | aprovado |
| 1366x768 | edicao | 1351/1351 | 1351/1351 | 680/680 | 665/665 | visivel | aprovado |
| 1440x900 | cadastro | 1425/1425 | 1425/1425 | 680/680 | 680/680 | visivel | aprovado |

## Screenshots

Evidencias em `tmp-responsive-screenshots/aluno-form-mobile/`:

- `cadastro-320-inicio.png`, `cadastro-320-final.png`, `cadastro-320-validacoes.png`
- `cadastro-360-inicio.png`, `cadastro-360-final.png`
- `cadastro-375-inicio.png`, `cadastro-375-final.png`
- `cadastro-390-inicio.png`, `cadastro-390-final.png`, `cadastro-390-teclado.png`
- `cadastro-412-inicio.png`, `cadastro-412-final.png`
- `cadastro-430-inicio.png`, `cadastro-430-final.png`
- `edicao-320-inicio.png`, `edicao-320-final.png`
- `edicao-390-inicio.png`, `edicao-390-final.png`
- `cadastro-paisagem-844x390-inicio.png`, `cadastro-paisagem-844x390-final.png`
- `edicao-paisagem-844x390-inicio.png`, `edicao-paisagem-844x390-final.png`
- `cadastro-desktop-1366-inicio.png`, `cadastro-desktop-1366-final.png`
- `edicao-desktop-1366-inicio.png`, `edicao-desktop-1366-final.png`

Tambem foram geradas evidencias adicionais para 800x360, 915x412, 1024 e 1440.

## Automacao

Criado `scripts/validate-aluno-form-mobile-cdp.mjs` e comando:

```bash
npm run qa:aluno-form-mobile
```

O script:

- autentica via `.env.qa.local`;
- abre `/alunos`;
- testa cadastro e edicao;
- preenche sem salvar;
- provoca validacao no cadastro;
- cancela as alteracoes;
- mede documento, body, dialog, area rolavel e rodape;
- captura screenshots;
- falha com codigo diferente de zero em qualquer overflow ou rodape inacessivel.

## Seguranca

- `.env.qa.local` permanece ignorado.
- `git ls-files .env.qa.local` retornou vazio.
- Nenhuma credencial, token, cookie ou armazenamento de sessao foi documentado.
- Nao houve alteracao de banco, Supabase, queries, RLS, regras de negocio ou validacoes.

## Pendencias para 5.3

- Avaliar se o cadastro de aluno deve expor o campo `observacoes`, hoje existente no modelo/detalhes mas ausente no formulario.
- Avaliar foco inicial e restauracao de foco com uma camada acessivel padronizada para modais.
- Considerar remover futuramente a regra global responsiva baseada em `[style*="position: fixed"][style*="inset: 0"]`, substituindo por classes especificas.

Status final: aprovado.

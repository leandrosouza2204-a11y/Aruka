# Ciclo 6.2.2 - Biblioteca e geracao por modelos prontos

## Objetivo

Criar uma biblioteca inicial de modelos oficiais para iniciar a montagem de treinos, permitindo escolher genero de referencia, divisao, modelo, aluno e confirmacao antes de abrir uma copia editavel no editor.

## Schema encontrado

Arquivos auditados:

- `supabase/treinos.sql`
- `src/services/treinosService.js`
- `src/data/treinosModelos.js`
- `src/features/treinos/hooks/useTreinosPage.js`
- `src/features/treinos/components/TreinosHeader.jsx`
- `src/features/treinos/components/TreinosList.jsx`
- `src/components/TreinoModal.jsx`

Estrutura atual:

- `treinos`: ficha principal vinculada a `user_id` e `aluno_id`.
- `treino_dias`: dias/sessoes por treino, com `nome`, `grupo_muscular` e `ordem`.
- `treino_exercicios`: exercicios copiados por nome, series, repeticoes, carga, descanso, observacoes, video e ordem.

Nao foi encontrada tabela persistida de biblioteca de exercicios. O app atual ja salva exercicios como texto dentro de cada treino. Por isso, a biblioteca oficial foi implementada como dados versionados no frontend e a geracao cria uma copia independente no estado do editor, usando o mesmo payload atual de treino/dias/exercicios.

## Migrations e RLS

Nao foram criadas migrations neste ciclo.

Motivo:

- Nao existe biblioteca de exercicios persistida para referenciar por `exercise_id`.
- Criar tabelas `workout_templates` agora exigiria seed com referencias inexistentes ou uma nova biblioteca de exercicios, o que ampliaria o escopo.
- O requisito de copia independente ja e atendido pela estrutura atual de `treinos`, `treino_dias` e `treino_exercicios`.

RLS existente preservada:

- `treinos`: usuario lista, cria, atualiza e exclui apenas seus treinos.
- `treino_dias`: acesso condicionado ao treino do usuario.
- `treino_exercicios`: acesso condicionado ao dia de treino do usuario.

Modelos oficiais nao sao editaveis nem excluiveis pelo frontend porque nao sao persistidos como registros mutaveis; sao constantes versionadas em `src/data/treinosModelos.js`.

## Modelos oficiais

Foram criados 10 modelos:

- Masculino - ABC
- Masculino - ABCD
- Masculino - ABCDE
- Masculino - Full Body
- Masculino - Upper/Lower
- Feminino - ABC
- Feminino - ABCD
- Feminino - ABCDE
- Feminino - Full Body
- Feminino - Upper/Lower

Os rotulos Masculino e Feminino sao apenas perfis de referencia e organizacao. O fluxo permite escolher qualquer modelo para qualquer aluno.

## Exercicios utilizados

Os modelos usam nomes de exercicios compatíveis com o formato atual do Aruka:

- Supino reto
- Supino inclinado com halteres
- Desenvolvimento militar
- Elevacao lateral
- Triceps na polia
- Puxada na frente
- Remada curvada
- Remada baixa
- Rosca direta
- Rosca martelo
- Agachamento livre
- Leg press
- Cadeira extensora
- Mesa flexora
- Panturrilha em pe
- Hip thrust
- Abducao de quadril
- Gluteo na polia
- Stiff
- Prancha
- E variacoes equivalentes por divisao.

Como nao existe tabela de exercicios a referenciar, nao houve criacao, alteracao ou duplicacao de exercicios no banco.

## Prescricao inicial

Valores conservadores e editaveis:

- Compostos: 3 series, 8-12 repeticoes, 90s.
- Pesados: 4 series, 6-10 repeticoes, 120s.
- Acessorios: 3 series, 10-15 repeticoes, 60s.
- Core: 3 series, 12-15 repeticoes, 60s.
- Carga: vazia.
- Tecnicas avancadas: nenhuma por padrao.

Observacao padrao adicionada ao treino gerado:

`Modelo inicial editavel. Ajuste o treino conforme objetivo, experiencia, disponibilidade e necessidades do aluno.`

## Fluxo de geracao

CTA criado:

- `Gerar por modelo`

Etapas:

- Genero de referencia: Masculino, Feminino ou Todos.
- Divisao: ABC, ABCD, ABCDE, Full Body ou Upper/Lower.
- Modelo: cards com nome, dias, nivel, descricao e resumo de grupos.
- Destino: aluno, nome do novo treino e data de inicio.
- Confirmacao: resumo e preview antes de gerar.

Ao confirmar, o fluxo chama `criarModeloTreino(modelo.id, opcoes)` e abre `TreinoModal` com `treinoBase`. Nada e salvo automaticamente. O treino so persiste se o usuario clicar em `Salvar Treino` no editor.

## Preview

O preview mostra:

- Dias.
- Nome e descricao do dia.
- Exercicios.
- Series.
- Repeticoes.
- Descanso.
- Observacoes quando existirem.

No mobile, o preview usa `details/summary` por dia, uma coluna, textos com quebra e sem edicao direta.

## Mobile e desktop

O modal de modelos usa:

- Cabeçalho fixo.
- Conteudo rolavel.
- Rodape com Voltar/Continuar/Gerar.
- `100dvh` e safe area em mobile.
- Cards em uma coluna no mobile.
- Grids adaptaveis em tablet/desktop.
- `overflow-x: clip`, `min-width: 0` e quebra de texto para evitar overflow horizontal.

## QA

Criado:

- `scripts/validate-treino-templates-mobile-cdp.mjs`
- `npm run qa:treino-templates-mobile`

Validacao autenticada executada:

- CDP: `127.0.0.1:9222`.
- App local: `http://127.0.0.1:5173`.
- Autenticacao: aprovada via `.env.qa.local`.
- Persistencia durante automacao: nao executada por padrao.
- Viewports: 390x844, 844x390, 820x1180 e 1366x768.
- Generos: aprovados.
- Divisoes: aprovadas.
- Modelos obrigatorios: aprovados.
- Preview: aprovado.
- Confirmacao: aprovada.
- Overflow: aprovado.

Screenshots geradas em:

- `tmp-responsive-screenshots/treino-templates-mobile/`

## Rollback

O QA nao confirmou geracao persistente. Portanto nao houve necessidade de rollback de treino QA.

Geracao real foi validada ate a tela de confirmacao e pela abertura do editor quando o usuario confirma manualmente. Para automacao de persistencia futura, sera necessario aluno QA dedicado e rotina de exclusao segura do treino criado.

## Validacoes tecnicas

- `node --check scripts\validate-treino-templates-mobile-cdp.mjs`: aprovado.
- `npm.cmd run qa:treino-templates-mobile`: aprovado.
- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado.

## Limitacoes

- Biblioteca oficial nao foi persistida em tabelas SQL neste ciclo por falta de tabela de exercicios existente para referencia segura.
- Exercicios dos modelos sao nomes copiados para o treino, seguindo o formato atual do app.
- QA nao salva treino real por padrao; persistencia completa deve ser validada apenas com aluno QA e rollback seguro.

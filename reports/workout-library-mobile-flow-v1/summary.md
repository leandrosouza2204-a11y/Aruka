# Ciclo 1.6 - Resultado

Decisao: `READY_WITH_LIMITATIONS`.

Branch: `feat/workout-library-mobile-flow-v1`.

SHA inicial da main: `8645a9ebc9ff121889d45a9f7d1ae195d111bbfa`.

PR de closeout confirmada: #28. PR funcional do Ciclo 1.5 confirmada: #27, merge `f4541113408cbaf6057acf6d5974932878eb0932`.

## Escopo

Foram auditadas e corrigidas jornadas mobile da Biblioteca de Treinos: descoberta, filtros, cards, menus, preview, aplicacao guiada, criacao, edicao e duplicacao de modelos pessoais.

## Correcoes

- Menus de cards agora usam `button` real, `aria-expanded` e `aria-controls`.
- Escape fecha menu aberto ou modal principal quando nao ha persistencia em andamento nem modal filho ativo.
- Menus sao limitados por viewport e aceitam textos longos.
- Modais da biblioteca usam `dvh` com fallback `vh`.
- Formulario de modelo pessoal ganhou footer sticky dentro da area rolavel.
- Dialogs recebem `aria-busy` durante persistencia.
- Indicador grafico de etapas e decorativo; etapa atual aparece em texto como `Etapa X de Y: Nome`.
- Erro do nome do modelo foi vinculado ao campo e erro geral de exercicios foi vinculado a secao correspondente.

Ajuste final pos-revisao: o indicador grafico voltou a ficar escondido das tecnologias assistivas com `aria-hidden="true"`, o `aria-label` do container decorativo foi removido e `aria-current` saiu dos marcadores. O nome da etapa atual foi incorporado ao texto visivel, o QA estatico foi atualizado, a suite completa foi repetida, a correcao hierarquica do Escape permaneceu intacta e a associacao do erro de exercicios permaneceu ativa.

## Validacao

Passaram:

- `node --test src\features\treinos\utils\*.test.js` - 70/70.
- `npm.cmd run qa:workout-template-sanitization`.
- `npm.cmd run qa:workout-templates-data`.
- `npm.cmd run qa:workout-template-discovery`.
- `npm.cmd run qa:workout-template-guided-application`.
- `npm.cmd run qa:personal-workout-template-management`.
- `npm.cmd run qa:workout-library-mobile-flow`.
- `npm.cmd run lint`.
- `npm.cmd run build`.
- `git diff --check`.

Runtime/CDP autenticado: `BLOCKED_INFRASTRUCTURE`. Nao foram geradas screenshots e nenhuma viewport foi declarada como runtime validada.

Runners tentados:

- `npm.cmd run qa:treino-templates-mobile` - bloqueado: Chrome CDP nao respondeu na porta 9222.
- `npm.cmd run qa:treino-exercises-mobile` - bloqueado: Chrome CDP nao respondeu na porta 9222.
- `npm.cmd run qa:treino-template-editor-flow` - bloqueado: `.env` ausente.
- `npm.cmd run qa:treino-custom-templates` - bloqueado: `.env` ausente.

## Supabase

Nenhum arquivo Supabase foi alterado.

## Proximo Ciclo

Ciclo 1.7 - Integracao com entrega e acompanhamento do aluno.

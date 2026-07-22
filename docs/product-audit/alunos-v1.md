# Auditoria Funcional v1 - Modulo Alunos

Data: 2026-07-22
Branch: `qa/alunos-functional-audit-v1`
Commit auditado: `af33c9f`
Ambiente: LOCAL_QA com frontend `http://127.0.0.1:5173` e Supabase local `http://127.0.0.1:54321`

## Baseline funcional

O modulo Alunos esta funcional para listagem, busca, filtros, cadastro, edicao, detalhes, check-in via WhatsApp e exclusao com confirmacao. A tela usa tabela no desktop e cards no mobile, com seletores estaveis de QA em listagem, filtros, formulario, detalhes e acoes.

## Fluxos auditados

- Listagem inicial com 14 alunos ficticios LOCAL_QA.
- Busca por aluno existente e inexistente.
- Filtro por status.
- Limpeza de filtros.
- Abertura/fechamento de detalhes.
- Cadastro aberto, validacao de obrigatorios e cancelamento.
- Edicao aberta, alteracao local e cancelamento.
- Confirmacao de exclusao aberta e cancelada.
- Menus de acoes no primeiro e ultimo aluno.
- Responsividade em 320, 360, 375, 390, 412, 430, 768 tablet, 1024, 1366, 1440 e zoom 125/150/200.

## Achados principais

### Pontos fortes

- Nenhum overflow horizontal foi detectado nos validadores CDP.
- Formulario manteve footer e campos acessiveis em mobile, paisagem e desktop.
- A exclusao exige confirmacao e o cancelamento foi validado.
- O check-in fica desabilitado quando nao ha telefone normalizado.
- O modulo possui boa cobertura de `data-testid`, reduzindo fragilidade da automacao.

### Problemas

1. ALU-P1-001 - Ficha do aluno nao oferece atalhos para Treinos, Avaliacoes ou Financeiro.
   Impacto: o usuario precisa sair manualmente do contexto do aluno para continuar a operacao.
   Evidencia: `scripts/validate-aluno-actions-mobile-cdp.mjs` retornou `treinos=false`, `avaliacoes=false`, `financeiro=false`.

2. ALU-P2-001 - Busca/filtros nao sincronizam completamente com URL.
   Impacto: contexto pode se perder ao voltar, compartilhar link ou navegar entre modulos.
   Evidencia: `useAlunosPage` inicializa `status` pela URL, mas busca e plano permanecem somente em estado local; `limparFiltros` tambem nao limpa query string.

3. ALU-P2-002 - Cadastro nao tem prevencao explicita de duplicidade.
   Impacto: risco de cadastrar o mesmo aluno mais de uma vez quando nome/telefone ja existem.
   Evidencia: `salvarAluno` valida nome, WhatsApp, inicio e plano, mas nao consulta duplicidade.

4. ALU-P2-003 - Estados vazios/erro/loading nao foram exercitados com fixture isolada.
   Impacto: ha risco residual de UX pouco clara em base vazia ou erro de rede.
   Evidencia: os cenarios automatizados validaram sem resultado por filtro, mas nao base sem alunos nem falha forcada de API.

5. ALU-P3-001 - Filtros processam a lista inteira no cliente.
   Impacto: aceitavel no volume local, mas pode degradar com muitos alunos.
   Evidencia: `buscarAlunosSupabase()` carrega todos os alunos do usuario; filtros, busca e ordenacao rodam no cliente.

## Decisao

READY_WITH_LIMITATIONS.

O modulo esta pronto para uso local e para demonstracao controlada, mas os proximos ciclos devem priorizar preservacao de contexto e acoes integradas da ficha do aluno.

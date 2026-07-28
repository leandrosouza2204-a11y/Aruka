# Ciclo 1.7 - Registro de riscos

| ID | Categoria | Risco | Evidencia | Probabilidade | Impacto | Severidade | Mitigacao | Etapa | Bloqueante |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WDI-001 | Autorizacao | Portal do aluno sem identidade/policy propria poderia expor treinos indevidos | Ausencia de rota de aluno em `src/App.jsx`; `alunos` e entidade, nao usuario | Media | Alto | Alto | Decidir identidade do aluno antes de visualizacao autenticada | 1/5 | Nao |
| WDI-002 | Produto/Dados | Salvar/aplicar hoje funciona como disponibilizacao implicita | `useTreinosPage.aplicarModeloTreino` persiste direto via `adicionarTreinoSupabase` | Alta | Alto | Alto | Criar estados e entrega explicita protegida no banco | 1/2/3 | Nao |
| WDI-003 | Rastreabilidade | Origem do modelo aplicado nao e persistida | `treinos` sem coluna de origem; `templateId` so em memoria | Alta | Medio | Alto | Adicionar campos de origem/aplicacao | 1/2 | Nao |
| WDI-004 | Integridade | Retry apos sucesso pode duplicar treino aplicado | Idempotencia atual e ref local em `submitWorkoutTemplateApplicationOnce` | Media | Medio | Medio | Idempotency key, constraint ou deteccao por origem/aluno/janela | 2 | Nao |
| WDI-005 | Estado | Multiplos treinos ativos conflitantes por aluno | Sem indice/check de ativo por aluno em schema atual | Media | Medio | Medio | Definir regra de cardinalidade de ativo | 1 | Nao |
| WDI-006 | Historico | Update apaga/recria dias e nao preserva alteracoes | RPC deleta `treino_dias` antes de recriar | Media | Medio | Medio | Criar eventos de status/entrega e, se necessario, snapshots | 1/4 | Nao |
| WDI-007 | Escopo | Confundir acompanhamento financeiro com execucao de treino | `acompanhamento_eventos` e `alunos.acompanhamento_status` sao financeiros/operacionais | Media | Medio | Medio | Separar entrega, execucao e financeiro no contrato | 1 | Nao |
| WDI-008 | Financeiro | Alterar `alunos` ou `acompanhamento_eventos` pode quebrar modulo financeiro | Financeiro usa `alunos`, `pagamentos`, `planos`, `acompanhamento_eventos` | Baixa | Alto | Medio | Nao alterar financeiro no 1.7 salvo leitura | 1/QA | Nao |
| WDI-009 | Mobile | Novas acoes de entrega podem gerar overflow em 320 px | Ciclo 1.6 validou fluxo existente, nao entrega | Media | Medio | Medio | QA mobile especifico e menus responsivos | 3/6 | Nao |
| WDI-010 | Dados | Modelo pessoal JSONB continua pouco restrito no banco | `workout_templates.template_data jsonb` e check apenas objeto | Media | Baixo | Baixo | Manter validacao forte em service/RPC e QA de contrato | 2/6 | Nao |
| WDI-011 | Runtime | Evidencia autenticada segue limitada por infraestrutura | Closeout 1.6 registra `.env`/CDP indisponiveis | Media | Medio | Medio | Planejar QA estatico + unitario e runtime quando ambiente estiver pronto | 6 | Nao |
| WDI-012 | Autorizacao | Manipulacao de ID no frontend deve continuar bloqueada no banco | RPC valida aluno/treino por `auth.uid()` | Baixa | Alto | Baixo | Manter validacoes na RPC para novas acoes | 1/2 | Nao |

# Treinos Cycle 4 - Resiliencia, Erros e Retry

## Diagnostico

O modulo Treinos ja cobria contexto por `alunoId`, integridade do editor e operabilidade da biblioteca, mas ainda precisava de tratamento explicito para falhas de carga e acoes destrutivas ou duplicadoras. Antes deste ciclo, erros eram exibidos como texto generico, sem retry estruturado, sem classificacao amigavel e sem uma suite dedicada para provar preservacao de contexto apos falhas.

Prioridade final adotada: alta para carga da biblioteca e retry; alta para falhas de duplicacao/exclusao; media para salvamento; alta para mobile e acessibilidade do estado de erro.

## Alteracoes

- `useTreinosPage()` passou a representar erro como objeto com titulo, descricao, tipo e retryabilidade, preservando filtros e contexto da URL.
- A carga de treinos ganhou retry explicito com `aria-busy`, bloqueio contra cliques concorrentes e tentativa silenciosa quando ja existem dados em tela.
- A biblioteca passou a exibir `data-testid="treinos-load-error"`, `role="alert"` e botao `data-testid="treinos-retry-load"`.
- Falhas de duplicacao, exclusao e salvamento agora usam mensagens amigaveis sem expor stack trace ou detalhes internos.
- Acoes de duplicar/excluir continuam desbloqueadas no `finally`, preservando o treino original quando a chamada falha.
- O servico de Treinos ganhou flags LOCAL_QA por `localStorage.ARUKA_QA_TREINOS_FAIL` para simular `load`, `duplicate` e `delete` apenas em `localhost`/`127.0.0.1`.
- Foi criada a suite `qa:treinos-resiliencia-erros-retry`.

## Mensagens

- Carga: "Nao foi possivel carregar os treinos." / "Verifique sua conexao e tente novamente."
- Duplicacao: "Nao foi possivel duplicar este treino." / "O treino original foi preservado. Tente novamente em instantes."
- Exclusao: "O treino nao foi excluido." / "Tente novamente em instantes."
- Salvamento: "Nao foi possivel salvar o treino." / "Revise os dados e tente novamente."

## Retry

O retry limpa o erro anterior, preserva `alunoId`, `returnTo`, `busca`, `objetivo`, `nivel` e `status`, exibe feedback acessivel durante a tentativa e permite nova tentativa quando a falha persiste. Quando o retry tem sucesso, o modulo sai do estado de erro e volta para um estado carregado coerente: lista com cards ou empty state filtrado/contextual.

## Validacao

- PASS: estado de erro recuperavel na carga inicial.
- PASS: retry com sucesso preservando URL e recuperando a biblioteca.
- PASS: retry com nova falha desbloqueando nova tentativa.
- PASS: falha ao duplicar preservando o treino original.
- PASS: falha ao excluir preservando o treino original.
- PASS: contexto por URL sobrevive a erro, retry e refresh.
- PASS: viewports 320, 375, 390, 768 e 1366 sem overflow no estado de erro.
- PASS: `qa:treinos-mobile` em matriz ampliada de viewports.

## Limitacoes

A regressao completa permanece incompleta porque a suite Cycle 1 (`qa:treinos-context-onboarding`) falhou por ambiente/autenticacao, permanecendo em `/login` aguardando `[data-testid="treinos-page"]`. Nao houve entrada no modulo Treinos nessa execucao, portanto a falha nao comprova regressao funcional do Cycle 4.

## Riscos Residuais

- A suite Cycle 1 precisa ser reexecutada em ambiente autenticado para fechamento formal sem limitacoes.
- As suites legadas nao executadas individualmente continuam fora da evidencia deste ciclo.
- As falhas LOCAL_QA validam os caminhos principais de carga, duplicacao e exclusao, mas nao substituem testes de indisponibilidade real da Supabase em ambientes remotos.

## Decisao

READY_WITH_LIMITATIONS.

Motivo: implementacao e suite dedicada do Cycle 4 passaram, lint/build passaram, Cycle 2/Cycle 3/mobile passaram, mas a regressao completa ficou limitada por falha ambiental/autenticacao na suite do Cycle 1.

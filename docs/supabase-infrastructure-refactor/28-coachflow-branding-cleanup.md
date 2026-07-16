# CoachFlow Branding Cleanup

## Escopo

Busca executada por `CoachFlow`, `coachflow` e `COACHFLOW` em todo o repositorio. O objetivo foi corrigir apenas referencias ativas de marca, preservando historico, evidencias, contexto de rebranding, dominios antigos e chaves `legacy`.

## Resultado

- Ocorrencias encontradas antes da limpeza: 11.
- Ocorrencias substituidas: 3.
- Ocorrencias preservadas: 8.
- Arquivos alterados: 2.

## Arquivos alterados

| Arquivo | Ocorrencias | Classificacao | Acao |
| --- | ---: | --- | --- |
| `supabase/migrations/20260705090000_hardening_admin_functions.sql` | 1 | A. Referencia ativa de marca em cabecalho de migration | `CoachFlow Database Migration` substituido por `Aruka Database Migration` |
| `supabase/migrations/README.md` | 2 | A. Documentacao operacional atual | Titulo e descricao textual substituidos por Aruka |

## Ocorrencias preservadas

| Arquivo | Ocorrencias | Classificacao | Justificativa |
| --- | ---: | --- | --- |
| `branding/README.md` | 2 | C. Documento historico de rebranding | Explica a transicao CoachFlow -> Aruka e deve preservar o nome antigo como contexto |
| `CHANGELOG_BRANDING.md` | 1 | C. Changelog historico | Evidencia historica do rebranding |
| `README.md` | 1 | C. Documento historico de rebranding | Linha declara a transicao de marca e preserva o contexto |
| `supabase/migrations/20260705091000_rls_indices_multitenant.sql` | 1 | F. Migration historica nao solicitada | Nao foi alterada para manter escopo minimo; pode ser tratada em limpeza futura se aprovada |
| `supabase/auditoria_dados_recomendacoes.sql` | 1 | E. Evidencia/auditoria historica | Arquivo de auditoria legado, nao operacional de marca |
| `src/config/sessionConfig.js` | 2 | B. Comentario tecnico / chave legacy | Chaves `coachflow_*` sao compatibilidade de sessao e nao devem ser renomeadas sem migracao funcional |

## Confirmacao

Nenhuma URL, dominio antigo, evidencia historica, nome de commit, snapshot ou relatorio bruto foi alterado indevidamente. As alteracoes foram limitadas a identidade textual ativa.

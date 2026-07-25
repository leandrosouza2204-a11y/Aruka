# Risk Register

| ID | Risco | Probabilidade | Impacto | Mitigacao | Dono sugerido |
| --- | --- | --- | --- | --- | --- |
| R-01 | QA cresce por scripts isolados e aumenta custo de manutencao. | Alta | Alto | Criar core compartilhado e contrato de decision. | Engenharia |
| R-02 | Fluxos mobile passam visualmente, mas seguem lentos para uso real. | Media | Alto | Validar jornadas completas, nao apenas screenshots. | Produto + Engenharia |
| R-03 | Templates de treino divergem entre oficiais, pessoais e treinos persistidos. | Media | Alto | Formalizar contrato de `template_data` e testes de transformacao. | Engenharia |
| R-04 | Gravacoes compostas geram estado parcial. | Media | Alto | Avaliar transacoes/RPCs para treino, avaliacao e financeiro. | Engenharia + Dados |
| R-05 | Listagens client-side degradam com crescimento de alunos e historico. | Media | Alto | Revisar consultas, paginacao e indices por modulo. | Dados |
| R-06 | Onboarding fraco reduz conversao mesmo com produto funcional. | Alta | Alto | Criar checklist de primeiro uso e estados vazios acionaveis. | Produto |
| R-07 | Financeiro usa conceitos ambiguos para usuario final. | Media | Alto | Padronizar linguagem e QA de cenarios financeiros. | Produto |
| R-08 | Evidencias Supabase/branch protection ficam defasadas. | Media | Medio | Revalidar runtime antes de qualquer piloto comercial. | Engenharia |
| R-09 | Dados demo confundem operacao real. | Media | Medio | Separar fixtures, seeds e demo mode com nomenclatura explicita. | Produto + Engenharia |
| R-10 | Mudancas legais bloqueiam usuario sem caminho claro. | Baixa | Alto | Revisar termos, aceite e mensagens de bloqueio. | Produto + Juridico |
| R-11 | Admin nao tem informacao suficiente para suporte. | Media | Medio | Evoluir logs e runbooks de atendimento. | Operacao |
| R-12 | Ciclos futuros misturam documentacao, codigo e evidencia sem escopo claro. | Media | Medio | Aplicar guard de escopo e definition of done por ciclo. | Engenharia |

## Riscos que exigem decisao antes de implementacao

- Criar compartilhamento de templates entre contas.
- Alterar modelo de assinatura ou cobranca.
- Introduzir IA para prescricao ou avaliacao.
- Aplicar migrations em HML/producao.
- Regenerar evidencias historicas de auditoria.

## Regras de atualizacao

Este registro deve ser atualizado quando:

- um ciclo adiciona funcionalidade nova;
- um risco deixa de existir por validacao;
- um risco muda de probabilidade ou impacto;
- uma limitacao vira blocker;
- um bug de QA vira risco sistemico.

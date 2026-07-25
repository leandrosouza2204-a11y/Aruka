# Epic 2 - Mobile Experience

## Objetivo

Consolidar mobile como experiencia operacional de primeira classe para atendimentos, consultas rapidas e registros em campo.

## Contexto atual

O app ja possui `MobileBottomNavigation`, rotas protegidas compartilhadas e varias evidencias mobile em modulos como Treinos. Auditorias tambem indicam que Dashboard, Alunos e Avaliacoes sao utilizaveis em mobile, com limitacoes de densidade, long scroll e cobertura parcial de estados.

## Fluxos prioritarios

| Fluxo | Motivo | Estado alvo |
| --- | --- | --- |
| Abrir aluno e acionar proximo passo | E o centro de navegacao operacional. | Atalhos claros para treino, avaliacao, financeiro e contato. |
| Criar treino a partir de modelo | Alto valor durante atendimento. | Fluxo curto, validado, sem perda de contexto. |
| Registrar avaliacao/anamnese | Registro presencial frequente. | Formularios legiveis, validacao por campo e recuperacao de erro. |
| Ver pendencias financeiras | Ajuda cobranca e renovacao. | Indicadores claros e acoes sem ambiguidades. |
| Dashboard diario | Orienta rotina do consultor. | Cards acionaveis e resumo compacto. |

## Iniciativas

- Definir uma matriz oficial de viewports minimos.
- Criar checklist visual mobile por modulo.
- Padronizar barras de acao, filtros, modais e formulacoes longas.
- Reduzir long scroll em telas de alto uso com agrupamentos e colapso controlado.
- Garantir que estados vazio, loading, erro e retry tenham comportamento mobile validado.
- Preservar contexto entre rotas usando parametros seguros como `alunoId` e `returnTo`.

## Criterios de UX

- Nenhum texto ou botao deve quebrar layout em 375px.
- Acoes destrutivas devem exigir confirmacao clara.
- Filtros e busca devem ser acessiveis sem exigir precisao excessiva de toque.
- Modais longos devem permitir leitura, preenchimento e cancelamento sem perda acidental.
- Navegacao inferior nao deve cobrir CTA ou conteudo essencial.

## QA sugerido

Criar runner compartilhado para os fluxos:

- `/dashboard`
- `/alunos`
- `/treinos`
- `/avaliacoes`
- `/financeiro`
- `/planos`

Viewports minimos:

- 375 x 812
- 390 x 844
- 768 x 1024
- 1024 x 768

Gates:

- screenshot por rota;
- assert de ausencia de overflow horizontal;
- assert de CTA principal visivel;
- smoke de abertura/fechamento de modal;
- preservacao de contexto em rotas aluno -> modulo -> retorno.

## Riscos

- Mobile virar apenas ajuste visual sem melhorar fluxo.
- Duplicacao de CSS por modulo.
- QA visual instavel se dados locais nao forem deterministicos.
- Navegacao inferior interferir em modais e barras fixas.

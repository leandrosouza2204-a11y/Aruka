# Backlog Priorizado - Avaliacoes v1

## AVA-P1-001 - Pre-selecionar aluno no fluxo contextual

- Descricao: ao abrir nova avaliacao com `?alunoId=...`, o formulario nao recebe o aluno contextual automaticamente.
- Evidencia: `useAvaliacoesPage.abrirNovaAvaliacao` apenas abre modal; `AvaliacaoModal` inicializa `alunoId` vazio quando nao ha avaliacao editando.
- Impacto: friccao alta em atendimento presencial e risco de salvar no aluno errado.
- Severidade: high
- Prioridade: P1
- Esforco: S
- Risco: medio
- Dependencias: contrato de contexto vindo da ficha do aluno.
- Recomendacao: passar `alunoIdContexto` como valor inicial ao modal de criacao.
- Criterio de aceite: nova avaliacao aberta a partir da ficha/listagem contextual ja mostra o aluno selecionado.
- Ciclo sugerido: Cycle 1

## AVA-P1-002 - Proteger descarte de alteracoes

- Descricao: `Fechar` e `Cancelar` encerram o modal sem confirmar dados preenchidos.
- Evidencia: `AvaliacaoModal` chama `onClose` diretamente.
- Impacto: risco real de perda de dados durante atendimento.
- Severidade: high
- Prioridade: P1
- Esforco: M
- Risco: medio
- Dependencias: padrao de `useConfirm`.
- Recomendacao: detectar dirty state e confirmar descarte.
- Criterio de aceite: fechar modal alterado exige confirmacao; modal sem alteracoes fecha direto.
- Ciclo sugerido: Cycle 2

## AVA-P1-003 - Validar numeros e limites plausiveis

- Descricao: idade, altura, peso, medidas e dobras aceitam texto, negativos e valores extremos; valores invalidos viram `null` no mapper.
- Evidencia: inputs sao `type="text"` e `numeroOuNull` descarta valores nao numericos silenciosamente.
- Impacto: dados incompletos podem parecer salvos corretamente; calculos podem ficar sem base.
- Severidade: high
- Prioridade: P1
- Esforco: M
- Risco: alto
- Dependencias: definicao de limites de negocio.
- Recomendacao: validar tipo, faixa, decimal, unidade e erro por campo.
- Criterio de aceite: salvar dados invalidos bloqueia persistencia com mensagem associada ao campo.
- Ciclo sugerido: Cycle 2

## AVA-P1-004 - Validar formulas com especialista

- Descricao: formulas de IMC, RCQ, percentual por medidas e Jackson & Pollock estao no codigo, mas sem fonte/protocolo documentado.
- Evidencia: `src/data/calculosCorporais.js`.
- Impacto: risco de apresentar resultado fisico incorreto ao aluno.
- Severidade: high
- Prioridade: P1
- Esforco: M
- Risco: alto
- Dependencias: validacao de profissional de Educacao Fisica.
- Recomendacao: documentar protocolo, pre-condicoes, sexo/idade/faixas e arredondamento.
- Criterio de aceite: formulas possuem referencia, testes e casos `NEEDS_DOMAIN_VALIDATION` resolvidos.
- Ciclo sugerido: Cycle 3

## AVA-P2-001 - Associar erros aos campos

- Descricao: validacao obrigatoria usa toast global, sem `aria-invalid`, `aria-describedby` ou foco no primeiro erro.
- Evidencia: `AvaliacaoModal.salvar`.
- Impacto: reduz recuperabilidade, especialmente mobile e leitores de tela.
- Severidade: medium
- Prioridade: P2
- Esforco: M
- Risco: medio
- Dependencias: modelo de mensagens do formulario.
- Recomendacao: erros inline por campo e foco programatico.
- Criterio de aceite: tentativa de salvar vazio foca aluno/data e anuncia erro.
- Ciclo sugerido: Cycle 4

## AVA-P2-002 - Melhorar retorno contextual

- Descricao: `returnTo` nao aparece como acao evidente no modulo.
- Evidencia: filtro preserva query params, mas `fecharPerfilAluno` e fluxo de detalhe nao navegam de volta.
- Impacto: usuario vindo da ficha do aluno pode perder contexto.
- Severidade: medium
- Prioridade: P2
- Esforco: S
- Risco: baixo
- Dependencias: padrao consolidado em Alunos/Treinos.
- Recomendacao: CTA de retorno seguro para origem conhecida.
- Criterio de aceite: entrada pela ficha permite retornar sem perder filtros.
- Ciclo sugerido: Cycle 1

## AVA-P2-003 - Resiliencia de falhas

- Descricao: erro de carga/salvamento/exclusao nao oferece retry contextual.
- Evidencia: `useAvaliacoesPage` define `erro`, mas nao expoe acao de retry na UI.
- Impacto: falhas temporarias bloqueiam usuario sem caminho claro.
- Severidade: medium
- Prioridade: P2
- Esforco: M
- Risco: medio
- Dependencias: padrao de estados de erro.
- Recomendacao: retry para carregar e preservacao de formulario em erro de salvamento.
- Criterio de aceite: falha simulada mostra mensagem, retry e nao perde preenchimento.
- Ciclo sugerido: Cycle 4

## AVA-P3-001 - Corrigir textos com encoding inconsistente

- Descricao: alguns textos aparecem com mojibake nos arquivos inspecionados.
- Evidencia: labels como `AvaliaÃ§Ã£o`.
- Impacto: percepcao de qualidade e clareza.
- Severidade: low
- Prioridade: P3
- Esforco: S
- Risco: baixo
- Dependencias: padrao de encoding do repositorio.
- Recomendacao: normalizar arquivos para UTF-8 em ciclo proprio.
- Criterio de aceite: UI e codigo exibem acentos corretamente.
- Ciclo sugerido: Cycle 4

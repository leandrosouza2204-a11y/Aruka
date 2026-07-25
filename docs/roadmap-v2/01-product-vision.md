# Product Vision

## Norte

O Aruka deve ser o sistema operacional diario do profissional de consultoria fitness: um produto em que cadastro, plano, rotina de treino, avaliacao, anamnese, financeiro e acompanhamento formam um fluxo unico de trabalho.

A visao de v2 e reduzir atrito operacional. O produto deve ajudar o consultor a sair rapidamente de "preciso organizar meus alunos" para "sei o que fazer hoje, consigo entregar valor e tenho confianca no historico".

## Meta operacional v2

Meta a validar:

"Permitir que um consultor fitness cadastre um aluno, crie um treino completo a partir da biblioteca, registre uma avaliacao inicial e organize o acompanhamento financeiro em ate 10 minutos, com uma experiencia funcional tanto no desktop quanto no mobile."

Essa meta e direcao estrategica, nao resultado atualmente comprovado. Sua comprovacao futura depende de QA de jornada ponta a ponta e testes com usuarios. A medicao deve observar tempo ate o primeiro valor percebido pelo consultor, cobrindo cadastro, treino, avaliacao inicial e organizacao financeira.

## Usuario primario

O usuario principal e o consultor fitness que gerencia uma carteira de alunos, vende planos, acompanha pagamentos, monta treinos, registra avaliacoes e precisa manter recorrencia de atendimento sem depender de planilhas dispersas.

Necessidades dominantes:

- encontrar rapidamente o aluno certo;
- entender o estado atual do aluno;
- criar ou adaptar um treino sem retrabalho;
- registrar evolucao fisica com confianca;
- cobrar, renovar e acompanhar pendencias;
- operar bem pelo celular durante o atendimento;
- confiar que dados sensiveis estao isolados e protegidos.

## Promessa do produto

O Aruka deve entregar tres beneficios combinados:

- Controle: dados de alunos, planos, financeiro e historico em um unico lugar.
- Velocidade: modelos, atalhos contextuais, filtros persistentes e mobile fluido.
- Confianca: rotas protegidas, RLS, auditoria, QA reproduzivel e governanca de mudancas.

## Principios de evolucao

- Priorizar fluxos reais antes de funcionalidades cosmeticas.
- Reduzir tempo ate o primeiro valor entregue.
- Tratar mobile como canal operacional, nao apenas responsividade visual.
- Manter seguranca e isolamento multi-tenant como restricao de produto.
- Validar cada incremento com evidencia reprodutivel.
- Evitar crescimento de scripts e automacoes sem contrato compartilhado.
- Preservar o carater modular por dominio em `src/features`.

## Horizonte v2

O horizonte v2 deve levar o Aruka de "produto funcional e auditado" para "produto pronto para ciclos comerciais controlados".

Isso implica:

- onboarding claro para primeiro uso;
- biblioteca de treinos forte o bastante para reduzir tempo de montagem;
- experiencia mobile consistente nos modulos de alto uso;
- QA compartilhado para evitar regressao entre ciclos;
- dados, indices, politicas e CI preparados para escalar com seguranca;
- planos, financeiro, assinatura, termos e administracao alinhados ao modelo comercial.

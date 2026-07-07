# Auditoria de Produto v1 - Aruka

## Resumo executivo

A Aruka ja tem uma base forte para v1.0: identidade clara, navegacao principal consolidada, modulos essenciais para consultoria fitness e bons blocos de feedback visual. O produto transmite valor em gestao operacional para personal trainers, especialmente por juntar alunos, planos, financeiro, treinos, avaliacoes e acompanhamento via WhatsApp em um unico ambiente.

O principal risco para lancamento nao e falta de funcionalidades centrais, mas friccao de primeiro uso. Um usuario iniciante pode nao saber a ordem ideal para comecar: criar plano, cadastrar aluno, montar treino, registrar avaliacao e so entao usar financeiro/dashboard. O sistema possui empty states e botoes principais, mas ainda precisa de onboarding contextual e caminhos guiados para reduzir abandono no primeiro acesso.

Top 10 recomendacoes:

1. Criar um checklist de primeiro uso no Dashboard.
2. Deixar explicita a ordem recomendada: Plano -> Aluno -> Treino/Avaliacao -> Financeiro.
3. Melhorar empty states com a proxima acao mais provavel em todos os modulos.
4. Unificar nomenclatura de CTAs: "Novo aluno", "Novo plano", "Novo treino", "Registrar avaliacao", "Registrar pagamento".
5. Adicionar microcopy de consequencia em acoes sensiveis: excluir, bloquear, cancelar assinatura, desfazer pagamento.
6. Explicar no Financeiro como o valor pendente e o ciclo de pagamento sao calculados.
7. Separar melhor "Avaliacao" e "Anamnese" para usuarios iniciantes.
8. Tornar o Dashboard mais acionavel, com atalhos diretos para corrigir alertas.
9. Revisar as paginas legais antes do uso comercial, pois elas se declaram modelo inicial.
10. Criar dados demonstrativos ou um modo demo para avaliacao comercial e suporte.

## Metodologia

A auditoria foi conduzida em tres frentes:

- Execucao local do projeto com `npm run dev` e validacao de resposta das rotas publicas e protegidas.
- Leitura dos componentes, hooks e fluxos de cada modulo no codigo fonte.
- Avaliacao heuristica do produto pela perspectiva de um usuario novo preparando sua primeira consultoria na Aruka.

Foram avaliados objetivos das telas, clareza de acao principal, empty states, feedbacks, quantidade de cliques, risco de confusao, excesso de informacao e percepcao de valor SaaS.

## Limitações da auditoria

Nao foi encontrada credencial de teste, seed local ou sessao autenticada reaproveitavel no projeto. As rotas responderam localmente, mas a avaliacao visual completa das telas protegidas em runtime ficou limitada pela ausencia de login valido.

Assim, a auditoria dos modulos internos foi feita principalmente por leitura de codigo e inferencia dos fluxos. Problemas que dependem de dados reais, volume de registros, performance percebida em producao e permissoes Supabase devem ser revalidados manualmente com uma conta de teste.

Tambem nao foram executadas acoes reais de escrita como criar aluno, registrar pagamento, excluir registro, bloquear usuario ou aceitar documentos legais.

## Avaliação geral do produto

A proposta da Aruka e compreensivel: profissionalizar a operacao de consultorias fitness. A landing page comunica bem a promessa comercial. Dentro do sistema, a sidebar organiza modulos esperados por um personal trainer: Dashboard, Alunos, Financeiro, Planos, Avaliacoes, Treinos e Administracao.

O produto ja parece mais proximo de uma ferramenta operacional do que de um prototipo. Ha uso consistente de cards, tabelas, filtros, badges, modais, toasts e empty states. Isso melhora a confianca.

O ponto mais fragil e a curva de entrada. O produto presume que o usuario entende como os modulos dependem entre si. Por exemplo, cadastrar aluno depende de plano; financeiro depende de aluno com plano; treino e avaliacao dependem de aluno; dashboard so ganha valor depois de dados cadastrados. Sem orientacao, o primeiro acesso pode parecer "vazio" ou exigir tentativa e erro.

## Pontos fortes

- Escopo funcional coerente com a dor do publico: alunos, planos, vencimentos, pagamentos, treinos e avaliacoes.
- Sidebar aprovada e clara como centro de navegacao.
- Dashboard com metricas de valor direto: receita prevista, recebida, pendente, vencimentos e check-in.
- Financeiro com visao de recebidos, pendentes, renovacao, historico e relatorios.
- Treinos tem modelos rapidos, o que reduz friccao para primeira criacao.
- Avaliacoes unem historico, composicao corporal, alertas e relatorios.
- Paginas legais existem e estao integradas ao fluxo de aceite.
- Feedbacks por toast e mensagens globais ja aparecem em acoes importantes.
- Empty states existem em varios modulos.
- Lazy loading e organizacao recente melhoraram percepcao tecnica do SaaS.

## Riscos para lançamento

- Primeiro uso sem dados pode nao deixar claro o que fazer primeiro.
- O usuario pode tentar cadastrar aluno antes de criar plano e encontrar dependencia nao explicada.
- Financeiro pode parecer complexo se o usuario nao entender ciclo, parcela, recebido no ciclo e renovacao.
- Avaliacoes e anamneses podem parecer duas areas parecidas para usuario iniciante.
- Dashboard pode ser percebido como pouco util ate haver dados suficientes.
- Administracao contem acoes sensiveis com risco alto se usada por alguem sem treinamento.
- Documentos legais informam que sao modelo inicial e precisam revisao juridica antes do uso comercial amplo.
- Ausencia de modo demo dificulta venda, treinamento e auditoria de experiencia real.
- Alguns textos no codigo aparecem com caracteres quebrados em alguns arquivos, indicando risco de encoding visivel dependendo do ambiente.
- Nao ha evidencia de um fluxo guiado pos-cadastro para ativar valor rapidamente.

## Auditoria por módulo

### Login

Objetivo claro: entrar ou criar conta. A tela usa logo, subtitulo e dois modos: login/cadastro. O fluxo e simples, com validacao de Supabase configurado e mensagens de erro.

Pontos fortes:
- Baixa friccao visual.
- Alternancia direta entre "Entrar" e "Criar nova conta".
- Mensagens quando Supabase nao esta configurado.
- Links legais acessiveis pelo rodape.

Pontos de friccao:
- "Criar nova conta" nao explica o que acontece depois: acesso imediato, confirmacao por e-mail, aprovacao ou assinatura.
- Apos cadastro, o usuario pode cair em confirmacao de e-mail ou assinatura pendente, mas isso nao e antecipado.
- Primeiro login tem multiplas barreiras possiveis: auth, assinatura, aceite legal. O fluxo e correto, mas pode parecer burocratico sem explicacao previa.

Percepcao de valor:
- Boa para entrada, mas ainda poderia vender "o que acontece depois" no primeiro acesso.

### Dashboard

Objetivo claro: acompanhar metricas, vencimentos, receita e check-in. Ele agrega indicadores de valor operacional.

Pontos fortes:
- Metricas relevantes para dono da consultoria.
- Alertas orientam acoes: vencidos, vencendo, receita pendente, check-in.
- Check-in semanal reforca valor recorrente.

Pontos de friccao:
- Em uma conta nova, o Dashboard tende a ficar vazio ou com numeros zerados.
- Falta um checklist de configuracao inicial.
- Alertas poderiam ter acoes diretas: "ver financeiro", "ver alunos vencidos", "abrir check-in".
- "Receita prevista/recebida/pendente" depende de regra de ciclo que pode nao ser obvia.

Percepcao de valor:
- Alta quando ha dados. Baixa no primeiro acesso sem guia.

### Alunos

Objetivo claro: gerenciar cadastros, planos, status e acompanhamento. E provavelmente a tela central do produto.

Pontos fortes:
- CTA "Novo Aluno" visivel.
- Filtros por nome, plano e status.
- Detalhes completos do aluno.
- Check-in manual via WhatsApp.
- Empty state orienta cadastrar o primeiro aluno.

Pontos de friccao:
- Cadastro do aluno exige plano e inicio; se nenhum plano existir, o usuario pode travar.
- O fluxo nao parece encaminhar automaticamente para criar plano quando nao ha planos ativos.
- Campos como aviso 7 dias, aviso 1 dia, pagamento recebido e data de pagamento podem ser complexos para iniciantes.
- "Salvar" e generico; em modal de criacao, "Salvar aluno" deixaria a acao mais clara.

Percepcao de valor:
- Alta. O modulo mostra claramente organizacao e acompanhamento.

### Treinos

Objetivo claro: criar e organizar rotinas de treino. O modulo tem boa percepcao de valor por causa dos modelos rapidos.

Pontos fortes:
- CTA "Novo treino".
- Modelos rapidos reduzem atrito.
- Cards mostram rotina, aluno, objetivo, nivel, revisao e dias.
- Acoes importantes: visualizar, editar, duplicar, excluir.
- Empty state oferece "Novo treino" e "Usar modelo rapido".

Pontos de friccao:
- Criar treino depende de aluno cadastrado; isso deveria ser explicado no empty state se nao houver alunos.
- O modal de treino e grande: dados basicos, dias e exercicios no mesmo fluxo.
- Para usuario iniciante, "Gerar Full Body", "Upper/Lower" e "Push/Pull/Legs" sao uteis, mas poderiam indicar para qual perfil servem.
- Excluir dia/exercicio tem confirmacao, mas a montagem completa ainda exige muitas decisoes.

Percepcao de valor:
- Alta. A area de modelos passa sensacao de produto especializado.

### Avaliações

Objetivo: registrar avaliacoes fisicas, anamneses, historico e relatorios.

Pontos fortes:
- Separa avaliacoes e anamneses por abas.
- Tem relatorio de avaliacao e relatorio de anamnese.
- Gera resumo para WhatsApp.
- Mostra alertas, graficos e historico.
- Captura dados ricos de evolucao fisica.

Pontos de friccao:
- A diferenca entre avaliacao e anamnese pode nao ser obvia para usuario iniciante.
- O modal de avaliacao tem muitos campos; pode assustar no primeiro uso.
- Fotos sao campos de texto/link, o que pode frustrar expectativa de upload.
- "Gerar relatorio" pode ser percebido como arquivo exportavel, mas parece renderizar conteudo na tela.
- Relatorios e graficos dependem de historico; no primeiro registro o valor percebido e menor.

Percepcao de valor:
- Muito alta para consultoria profissional, mas exige orientacao para nao parecer complexo demais.

### Financeiro

Objetivo claro: controlar pagamentos, vencimentos, pendencias e receita prevista.

Pontos fortes:
- Cards de receita prevista, recebida, pendente, ativos e vencidos.
- Filtros por status e pagamento.
- Acoes completas: receber, desfazer, renovar plano, historico, relatorio, WhatsApp.
- Relatorio geral e relatorio por aluno reforcam valor comercial.

Pontos de friccao:
- Conceitos como "recebido no ciclo", "pagamento avulso", "parcela", "renovacao" e "valor pendente" precisam de microcopy.
- O fluxo de primeiro pagamento depende de aluno + plano + vencimento; sem guia, pode parecer que o financeiro esta vazio por erro.
- "Desfazer ultimo pagamento" e sensivel; precisa ser muito claro quanto ao impacto.
- Financeiro e uma area de alto risco de confianca: qualquer ambiguidade afeta credibilidade.

Percepcao de valor:
- Alta, possivelmente um dos maiores diferenciais do SaaS, desde que os calculos sejam compreendidos.

### Planos

Objetivo claro: cadastrar planos, valores, duracao e parcelamento.

Pontos fortes:
- CTA "Novo Plano".
- Empty state com acao.
- Campo de parcelamento tem explicacao de impacto no financeiro.
- Status ativo/inativo.
- Plano e uma boa base para padronizar cadastro de alunos.

Pontos de friccao:
- Como plano e pre-requisito para cadastrar aluno corretamente, deveria ser apresentado como primeiro passo de setup.
- "Valor total do plano" versus "valor por parcela" pode gerar duvida.
- "Intervalo entre parcelas" precisa talvez de exemplo.

Percepcao de valor:
- Boa, mas hoje parece modulo administrativo; na jornada de onboarding deveria ser tratado como configuracao inicial essencial.

### Administração

Inclui AdminUsuarios e AdminLogs.

Pontos fortes:
- AdminUsuarios cobre liberacao beta, assinante, bloqueio, admin, cancelamento de assinatura e transferencia de acesso.
- AdminLogs registra acoes sensiveis com filtros e detalhes.
- Ha confirmacoes em acoes destrutivas ou sensiveis.
- A existencia de logs aumenta confianca para operacao SaaS.

Pontos de friccao:
- Muitas acoes criticas aparecem no mesmo contexto; risco de erro operacional.
- "Beta", "Assinante", "Admin", "Bloquear", "Cancelar assinatura" exigem treinamento.
- Transferencia de acesso e bem protegida por confirmacao textual, mas deve ser usada somente por admins treinados.
- AdminLogs e util, mas pode ser tecnico demais para operador nao desenvolvedor.

Percepcao de valor:
- Alta para operacao interna da Aruka, nao para cliente final. Deve ficar claramente restrita.

### Páginas legais

Objetivo claro: politica de privacidade, termos de uso e aceite legal.

Pontos fortes:
- Politica e termos estao acessiveis publicamente.
- Aceite legal e obrigatorio no fluxo protegido.
- Documentos mencionam LGPD, dados de alunos, WhatsApp manual e limites do servico.

Pontos de friccao:
- Os documentos exibem aviso de modelo inicial e necessidade de revisao juridica.
- "Sair" volta historico ou vai para `/`, o que e ok, mas poderia ser "Voltar" para maior clareza.
- Para lancamento comercial, textos legais precisam revisao profissional.

Percepcao de valor:
- Boa como base, mas risco juridico se usados sem revisao.

## Fluxos críticos

### Primeiro acesso

Fluxo inferido: usuario chega em `/`, vai para `/login`, cria conta ou entra, passa por verificacao de autenticacao, assinatura e aceite legal.

Riscos:
- Nao esta claro antes do cadastro se o acesso exige aprovacao, assinatura ou confirmacao.
- O usuario pode se cadastrar e nao entender por que nao chegou imediatamente ao Dashboard.
- A primeira experiencia pos-login deve ser guiada, nao apenas uma tela vazia.

Recomendacao:
- Adicionar onboarding pos-login com checklist: criar plano, cadastrar aluno, registrar treino/avaliacao, registrar pagamento.

### Cadastro do primeiro aluno

Fluxo inferido: Alunos -> Novo Aluno -> preencher nome, WhatsApp, nascimento, inicio, plano, valor -> salvar.

Riscos:
- Se nao houver plano ativo, o usuario nao consegue completar o cadastro de forma intuitiva.
- A tela de Alunos nao parece oferecer desvio direto para "Criar primeiro plano" quando necessario.
- Campos calculados podem parecer bloqueados sem explicacao.

Recomendacao:
- Empty state ou aviso contextual: "Antes de cadastrar alunos, crie pelo menos um plano".

### Criação do primeiro treino

Fluxo inferido: Treinos -> Novo treino ou modelo rapido -> selecionar aluno -> rotina -> dias -> exercicios -> salvar.

Riscos:
- Muito conteudo no modal.
- Usuario sem aluno cadastrado pode nao saber por que nao consegue concluir.
- Modelos rapidos ajudam, mas poderiam explicar melhor seu uso.

Recomendacao:
- Orientar "Escolha um aluno e comece por um modelo rapido" e destacar modelos como caminho recomendado.

### Registro da primeira avaliação

Fluxo inferido: Avaliacoes -> Nova Avaliacao -> selecionar aluno e data -> preencher medidas/dobras/fotos/observacoes -> salvar.

Riscos:
- Grande quantidade de campos no primeiro uso.
- Fotos como link/texto podem contrariar expectativa.
- Anamnese e avaliacao podem competir como primeiro registro.

Recomendacao:
- Indicar "campos minimos" e separar visualmente "essencial" de "opcional".

### Registro do primeiro pagamento

Fluxo inferido: Financeiro -> localizar aluno -> Receber -> preencher pagamento -> salvar.

Riscos:
- Financeiro depende de aluno cadastrado com plano.
- Conceitos de ciclo, parcela e valor pendente podem nao ser entendidos.
- Usuario pode nao saber se deve registrar pagamento no cadastro do aluno, na renovacao ou no financeiro.

Recomendacao:
- Microcopy: "Registre aqui pagamentos ja recebidos do ciclo atual".

### Entendimento do dashboard

Fluxo inferido: Dashboard apresenta indicadores calculados a partir de alunos, planos e pagamentos.

Riscos:
- Sem dados, dashboard perde valor.
- Alertas existem, mas precisam virar acoes.
- Receita prevista/pendente pode parecer numero "misterioso" sem explicacao.

Recomendacao:
- Checklist + atalhos diretos para resolver alertas.

## Problemas priorizados

| ID | Problema | Módulo | Severidade | Impacto no usuário | Esforço estimado | Recomendação |
| --- | --- | --- | --- | --- | --- | --- |
| P01 | Primeiro acesso nao orienta a ordem ideal de setup | Geral/Dashboard | alta | Usuario novo pode abandonar por nao saber onde comecar | medio | Criar checklist de onboarding no Dashboard |
| P02 | Cadastro de aluno depende de plano, mas isso nao e antecipado | Alunos/Planos | alta | Usuario trava antes de cadastrar o primeiro aluno | baixo | Mostrar aviso/CTA para criar plano quando nao houver planos ativos |
| P03 | Financeiro usa conceitos complexos sem explicacao suficiente | Financeiro | alta | Perda de confianca em valores e status financeiros | medio | Adicionar microcopy e tooltips para ciclo, pendente, parcela e recebido |
| P04 | Primeiro cadastro/cadastro de conta nao explica aprovacao, assinatura e aceite | Login | media | Usuario pode interpretar bloqueio como erro | baixo | Explicar etapas apos criar conta |
| P05 | Avaliacao e anamnese podem confundir usuario iniciante | Avaliacoes | media | Usuario registra no lugar errado ou evita usar o modulo | medio | Incluir explicacao curta nas abas/cards |
| P06 | Modal de avaliacao e muito longo para primeiro uso | Avaliacoes | media | Aumento de abandono no registro inicial | medio | Destacar campos obrigatorios e agrupar opcionais |
| P07 | Treino depende de aluno, mas o empty state nao considera ausencia de alunos | Treinos | media | Usuario sem aluno nao entende pre-requisito | baixo | Empty state condicional para criar aluno primeiro |
| P08 | Alertas do Dashboard nao levam diretamente ao ponto de resolucao | Dashboard | media | Usuario sabe do problema, mas precisa procurar onde agir | medio | Adicionar CTAs nos alertas |
| P09 | Documentos legais ainda sao modelo inicial | Paginas legais | alta | Risco juridico antes de venda comercial | medio | Revisao juridica antes da v1.0 |
| P10 | Administracao concentra muitas acoes sensiveis juntas | Admin | alta | Risco operacional de bloquear/cancelar/promover por engano | medio | Reforcar confirmacoes e separar acoes destrutivas |
| P11 | Ausencia de modo demo/dados exemplo dificulta venda e treinamento | Geral | media | Avaliacao comercial fica dependente de cadastrar tudo manualmente | alto | Criar modo demo ou ambiente seedado |
| P12 | Alguns textos podem aparecer com encoding quebrado dependendo do ambiente | Geral | media | Percepcao de baixa qualidade se aparecer em producao | baixo | Auditar encoding dos arquivos e build final |

## Quick wins

- Adicionar checklist de primeiro uso no Dashboard.
- Melhorar empty state de Alunos quando nao houver planos.
- Melhorar empty state de Treinos quando nao houver alunos.
- Incluir explicacao curta em Financeiro sobre "recebidos no ciclo" e "pendentes no ciclo".
- Renomear CTAs genericos de modais para acoes especificas quando possivel: "Salvar aluno", "Salvar plano", "Salvar treino".
- Adicionar exemplos em Planos para parcelamento.
- Incluir descricao curta para Avaliacao versus Anamnese.
- Adicionar CTA nos alertas do Dashboard.
- Reforcar mensagem pos-cadastro no Login sobre confirmacao/aprovacao.
- Fazer varredura de encoding antes de empacotar v1.0.

## Melhorias para v1.0

- Onboarding guiado de setup inicial.
- Revisao juridica de Termos e Politica.
- Conta ou ambiente de demonstracao para vendas e suporte.
- Textos explicativos no Financeiro.
- Fluxo claro de primeiro plano e primeiro aluno.
- Estados vazios orientados por dependencias reais.
- CTAs acionaveis em alertas do Dashboard.
- Revisao de nomenclatura e consistencia dos botoes principais.
- Validacao manual completa com dados reais de teste.
- Guia interno para administradores sobre acoes sensiveis.

## Melhorias pós-v1.0

- Tour interativo por modulo.
- Templates mais ricos de treino por objetivo.
- Exportacao formal de relatorios em PDF.
- Upload real de fotos de avaliacao, se for prioridade do publico.
- Central de ajuda contextual.
- Analytics de ativacao: tempo ate primeiro aluno, primeiro plano e primeiro pagamento.
- Modo demo com dados ficticios navegaveis.
- Melhorias de permissoes granulares para equipe.

## Roadmap recomendado

### Sprint 1

- Criar checklist de primeiro uso no Dashboard.
- Ajustar empty states dependentes: Planos -> Alunos -> Treinos/Financeiro.
- Adicionar microcopy nos conceitos financeiros principais.
- Revisar textos de primeiro cadastro/login.
- Fazer varredura de encoding.

### Sprint 2

- Melhorar fluxo de Avaliacoes com separacao mais clara entre campos essenciais e opcionais.
- Adicionar CTAs em alertas do Dashboard.
- Revisar CTAs dos modais para nomes mais especificos.
- Reforcar confirmacoes de acoes administrativas sensiveis.
- Validar todos os fluxos com uma conta teste e dados completos.

### Sprint 3

- Criar ambiente demo ou script de dados ficticios.
- Revisar juridicamente Politica e Termos.
- Criar guia de uso inicial para personal trainer.
- Melhorar relatorios para percepção comercial.

### Backlog futuro

- Tour interativo.
- Exportacao PDF.
- Upload de fotos.
- Central de ajuda.
- Analytics de ativacao.
- Permissoes avancadas por equipe.

## Conclusão

A Aruka esta bem posicionada para v1.0 como SaaS operacional para personal trainers e consultorias online. O produto ja resolve dores reais e tem uma arquitetura de modulos coerente.

Para lancamento comercial, a prioridade deve ser ativacao do usuario iniciante. O sistema precisa explicar melhor a ordem de configuracao e transformar telas vazias em caminhos guiados. Sem isso, a percepcao de valor pode demorar a aparecer justamente no momento mais critico: os primeiros minutos de uso.

Com checklist inicial, empty states mais instrutivos, microcopy no financeiro e revisao legal, a Aruka tende a ficar pronta para uma v1.0 mais confiavel, clara e vendavel.

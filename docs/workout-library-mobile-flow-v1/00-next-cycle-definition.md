# Ciclo 1.6 - Fluxo mobile da Biblioteca de Treinos

## Objetivo canonico

Tornar funcional e consistente, em dispositivos moveis, a jornada central da Biblioteca de Treinos ja implementada nos ciclos anteriores.

A experiencia mobile deve abranger:

- descoberta de modelos;
- busca;
- filtros;
- visualizacao;
- escolha de modelo;
- aplicacao guiada ao aluno;
- criacao de modelo pessoal;
- salvar treino como modelo;
- edicao de modelo pessoal;
- duplicacao de modelo oficial;
- duplicacao de modelo pessoal;
- preview;
- confirmacao;
- sucesso;
- erro;
- retry;
- menus de acoes;
- modais;
- navegacao entre etapas.

## Dependencias

- Ciclo 1.2 - contrato e integridade.
- Ciclo 1.3 - busca e descoberta.
- Ciclo 1.4 - aplicacao guiada.
- Ciclo 1.5 - gerenciamento de modelos pessoais.

## Escopo positivo preliminar

O futuro Ciclo 1.6 devera auditar e corrigir:

- overflow horizontal;
- largura e altura de modais;
- footer fixo ou acessivel;
- teclado virtual;
- areas de toque;
- menus de acoes;
- rolagem interna;
- foco;
- titulos;
- densidade visual;
- cards de modelos;
- filtros;
- inputs;
- listas de dias;
- listas de exercicios;
- preview;
- confirmacao;
- mensagens de erro;
- loading;
- estado vazio;
- sucesso;
- retorno para a biblioteca;
- orientacao portrait;
- viewports moveis representativas.

## Escopo negativo preliminar

O Ciclo 1.6 nao deve:

- alterar contrato de dados;
- criar novo contrato;
- alterar persistencia;
- alterar RPC;
- alterar migrations;
- alterar RLS;
- alterar ownership;
- criar marketplace;
- implementar compartilhamento entre contas;
- criar funcionalidades de IA;
- trabalhar genericamente em todo o mobile do sistema;
- corrigir modulos externos a Biblioteca de Treinos;
- mascarar problemas com `overflow-x: hidden` global;
- redesenhar toda a identidade visual.

## Estrategia recomendada

Fase A - Auditoria mobile dirigida:

- inventariar telas e estados;
- identificar viewports criticas;
- reproduzir problemas;
- classificar severidade;
- registrar baseline;
- identificar seletores QA existentes;
- mapear limitacoes de ambiente.

Fase B - Implementacao e validacao:

- corrigir problemas estruturais;
- preservar desktop;
- adicionar QA estatico;
- adicionar QA runtime/CDP quando o ambiente permitir;
- gerar evidencias mobile;
- documentar bloqueios reais.

Este closeout nao inicia a Fase A.

## Viewports preliminares

- 320 x 568;
- 360 x 800;
- 375 x 667;
- 390 x 844;
- 412 x 915.

A implementacao futura deve confirmar quais viewports sao suportadas pelo runner existente.

## Criterios preliminares de aceite

O futuro Ciclo 1.6 devera comprovar:

- nenhuma rolagem horizontal estrutural;
- biblioteca utilizavel em portrait;
- filtros acessiveis;
- cards legiveis;
- menus acessiveis;
- aplicacao guiada concluivel;
- criacao concluivel;
- edicao concluivel;
- duplicacao concluivel;
- preview legivel;
- confirmacao acessivel;
- botoes nao encobertos;
- teclado nao inviabiliza os formularios;
- erros permanecem visiveis;
- loading impede duplicidade;
- retorno para a biblioteca funciona;
- comportamento desktop nao sofre regressao;
- lint e build passam;
- Supabase permanece inalterado.

## Branch recomendada

`feat/workout-library-mobile-flow-v1`

## Decisoes possiveis do futuro ciclo

- `READY`;
- `READY_WITH_LIMITATIONS`;
- `BLOCKED_INFRASTRUCTURE`;
- `BLOCKED_EXTERNAL_ACCESS`;
- `BLOCKED_PRODUCT_DEFECT`;
- `FAILED_REGRESSION`.

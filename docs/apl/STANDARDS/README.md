# Padrões Oficiais da Aruka Performance Library

Os arquivos em `docs/apl/STANDARDS/` são a fonte oficial da estrutura documental da Aruka Performance Library.

## Objetivo da pasta

Esta pasta centraliza o padrão Premium usado para criar, revisar e homologar modelos de treino da APL. O objetivo é eliminar variações estruturais entre divisões, níveis e estratégias, mantendo todos os documentos compatíveis com as regras vigentes do AQA.

## Relação com a APL

A Aruka Performance Library utiliza estes padrões como referência única para modelos de hipertrofia em divisões ABC, ABCD, ABCDE, Full Body e Upper/Lower. Todo novo modelo deve nascer a partir do template oficial e todo modelo existente deve ser revisado contra estes documentos antes de homologação.

## Relação com o AQA

O AQA valida estrutura, metadados, seções e tabelas de prescrição. Estes padrões documentam os títulos, campos e formatos que devem ser usados literalmente para reduzir ruído de auditoria. Se as regras oficiais do AQA forem atualizadas, estes padrões também devem ser revisados.

## Ordem de utilização dos documentos

1. `APL_PREMIUM_TEMPLATE.md`: copiar como base do novo modelo.
2. `APL_METADATA_STANDARD.md`: preencher código, versão, status e metadados.
3. `APL_SECTION_STANDARD.md`: validar títulos e ordem das seções.
4. `APL_PREMIUM_PRESCRIPTION.md`: montar as tabelas de exercícios.
5. `README.md`: consultar o processo operacional.

## Responsabilidade de cada arquivo

- `README.md`: descreve o uso da pasta, fluxo de criação e fluxo de revisão.
- `APL_PREMIUM_TEMPLATE.md`: fornece o modelo copiável com todas as seções obrigatórias.
- `APL_PREMIUM_PRESCRIPTION.md`: define a tabela oficial de exercícios e suas regras.
- `APL_METADATA_STANDARD.md`: define campos, formatos, códigos, versões e status.
- `APL_SECTION_STANDARD.md`: registra títulos oficiais reconhecidos pelo AQA.

## Regra de versionamento

Os padrões devem evoluir com versionamento documental. Alterações compatíveis podem manter a família `1.x.x`; mudanças estruturais relevantes no template, nos metadados ou nas seções devem abrir uma versão `2.0.0` dos padrões e ser comunicadas antes de revisar modelos existentes.

## Processo para criar um novo modelo

1. Copiar `APL_PREMIUM_TEMPLATE.md`.
2. Renomear conforme o código oficial.
3. Preencher metadados.
4. Preencher todas as seções obrigatórias.
5. Criar tabelas conforme `APL_PREMIUM_PRESCRIPTION.md`.
6. Validar títulos conforme `APL_SECTION_STANDARD.md`.
7. Executar o AQA.
8. Corrigir Blockers e Errors.
9. Revisar Warnings.
10. Somente depois enviar para homologação.

## Processo para revisar um modelo existente

1. Conferir se o nome do arquivo corresponde ao código interno.
2. Validar cabeçalho e metadados contra `APL_METADATA_STANDARD.md`.
3. Comparar a ordem de seções com `APL_SECTION_STANDARD.md`.
4. Conferir se cada sessão possui objetivo, prescrição e justificativa.
5. Validar todas as tabelas de exercícios contra `APL_PREMIUM_PRESCRIPTION.md`.
6. Remover seções vazias, variações de títulos e textos provisórios.
7. Executar o AQA.
8. Corrigir Blockers e Errors.
9. Revisar Warnings e registrar ressalvas quando necessário.
10. Encaminhar para homologação somente após consistência documental.

## Compatibilidade

Seções adicionais são permitidas quando ajudam a prescrição, mas não substituem seções obrigatórias. Títulos oficiais devem ser usados literalmente, tabelas de prescrição devem possuir as colunas oficiais e o código do documento deve coincidir com o nome do arquivo.

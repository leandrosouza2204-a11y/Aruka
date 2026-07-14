# AQA v1.2 — Parser Contextual

O AQA v1.2 adiciona uma camada contextual para documentos Premium da Aruka Performance Library. O objetivo é entender a hierarquia Markdown antes de aplicar regras, evitando que tabelas auxiliares e subseções repetidas por sessão sejam tratadas como inconsistências globais.

## Árvore de documento

Cada arquivo analisado recebe uma árvore de headings:

```text
Document
├── H1
├── H2 — Treinos
│   ├── H3 — Treino A
│   │   ├── H4 — Objetivo da sessão
│   │   ├── H4 — Prescrição
│   │   └── H4 — Justificativa
│   └── H3 — Treino B
└── H2 — Volume semanal
```

Cada nó registra nível, título, título normalizado, linha inicial, linha final, pai, filhos, conteúdo e tabelas associadas.

## Escopos

O escopo global usa apenas seções H2. Seções Premium obrigatórias devem existir uma vez nesse nível.

O escopo de sessão usa H3 reconhecidos como `Treino A`, `Upper A`, `Lower A` ou `Full Body A`, aceitando travessão ou hífen simples. Cada sessão possui seu próprio conjunto de H4, então `Objetivo da sessão`, `Prescrição` e `Justificativa` podem aparecer uma vez por sessão.

## Classificação de tabelas

As tabelas recebem `contextType`:

| Tipo | Uso |
|---|---|
| prescription | Tabela dentro de H4 `Prescrição` em sessão reconhecida |
| metadata | Tabela em `Metadados` |
| weekly-structure | Tabela em `Estrutura semanal` |
| volume | Tabela em `Volume semanal` |
| score | Tabela em `Aruka Score` |
| comparison | Tabela comparativa |
| progression | Tabela de progressão ou periodização |
| movement-patterns | Tabela de padrões de movimento |
| generic | Tabela auxiliar sem tipo específico |

AQA-004 audita somente `contextType === "prescription"`.

## Aliases

Aliases oficiais ficam centralizados no parser contextual. `Aruka Coaching Notes` é o título oficial; `Coaching Notes` é aceito como alias legado para evitar falso erro de ausência e pode gerar warning de nomenclatura.

## AQA-003

AQA-003 valida seções H2 obrigatórias, duplicidade global de H2, ordem global e integridade das sessões. Duplicidade de H4 só é finding quando ocorre dentro da mesma sessão.

## AQA-004

AQA-004 valida apenas tabelas de prescrição e exige as colunas oficiais:

`Ordem`, `Exercício`, `Séries`, `Repetições`, `RIR`, `Descanso`, `Método`, `Observações`.

A normalização remove acentos, diferenças de caixa e espaços extras apenas para comparação. Sinônimos como `Reps`, `Sets`, `Intervalo` e `Técnica` não são aceitos automaticamente.

## Exemplos válidos

```markdown
### Treino A — Peitoral

#### Objetivo da sessão

#### Prescrição

| Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações |
|---:|---|:---:|:---:|:---:|:---:|---|---|
| 1 | Supino | 3 | 8–10 | 2 | 90 s | Tradicional | Controle |

#### Justificativa
```

## Exemplos inválidos

- Duas subseções `#### Prescrição` dentro do mesmo `Treino A`.
- Tabela de prescrição sem `Método`.
- Sessão reconhecida sem tabela dentro de `#### Prescrição`.

## Limitações conhecidas

O parser é deliberadamente simples e depende de Markdown consistente. Tabelas quebradas por linhas não tabulares, headings omitidos ou sessões sem H3 reconhecido podem impedir classificação contextual correta.

# 01 - Canonical Contract

## Localizacao

Contrato executavel:

`src/features/treinos/utils/workoutDataContract.js`

O contrato ficou em `utils` para evitar nova camada ampla antes de haver outros dominios consumidores. Ele e especifico da Biblioteca Inteligente de Treinos.

## Template canonico

```text
{
  schemaVersion: 1,
  source: "workout-editor",
  days: [
    {
      name: string,
      notes: string,
      order: integer,
      exercises: [
        {
          name: string,
          sets: string,
          repetitions: string,
          rest: string,
          technique: string,
          notes: string,
          video: string,
          order: integer
        }
      ]
    }
  ]
}
```

## Regras

- `schemaVersion` inicial: `1`.
- Templates legados sem `schemaVersion` sao aceitos e normalizados para `1`.
- Dias vazios sem nome e sem exercicios sao descartados na normalizacao.
- Exercicios sem nome sao descartados na normalizacao.
- `validateCanonicalTemplateData` exige pelo menos um dia e pelo menos um exercicio nomeado por dia.
- Campos de aluno, ownership, datas, status, IDs e carga nao entram em template.
- `carga` permanece fora do template por decisao de produto: carga e dado individual do treino aplicado.
- `technique`, `notes` e `video` sao preservados.

## Status canonico

Fonte unica:

- `Ativo`
- `Em revisao`
- `Finalizado`

Compatibilidade:

- `Em revisão` e normalizado para `Em revisao`.
- Valores desconhecidos caem para `Ativo` por padrao.
- Persistencia via contrato envia somente valor canonico.

# Padrão Oficial de Metadados

Este documento define campos obrigatórios, campos opcionais, formatos, valores permitidos, convenção de códigos, regras de versão e regras de status para modelos da Aruka Performance Library.

## Campos obrigatórios no cabeçalho

Todo modelo real deve possuir:

- título H1;
- código igual ao nome do arquivo sem `.md`;
- versão;
- status;
- biblioteca;
- metodologia;
- público;
- divisão;
- estratégia.

## Campos obrigatórios em Metadados

| Campo | Valor |
|---|---|
| Código | Código oficial do modelo |
| Versão | Versão semântica do documento |
| Status | Um dos status permitidos |
| Sexo | Masculino ou Feminino |
| Nível | Iniciante, Intermediário ou Avançado |
| Objetivo | Hipertrofia |
| Divisão | ABC, ABCD, ABCDE, Full Body ou Upper-Lower |
| Estratégia | Base, Performance, Eficiência ou Especialização |
| Frequência | Número de sessões semanais |
| Duração média | Faixa em minutos |
| Ciclo sugerido | Faixa em semanas |
| RIR predominante | Faixa principal de repetições em reserva |
| Método principal | Método central do modelo |
| Métodos complementares | Métodos adicionais ou Nenhum |
| Complexidade | Baixa, Moderada ou Alta |
| Equipamentos | Perfil de equipamento necessário |

## Campos opcionais

Campos opcionais podem ser adicionados quando úteis:

- agenda sugerida;
- restrições operacionais;
- nível de supervisão;
- prioridade muscular;
- densidade semanal;
- observações de aplicação.

Campos opcionais não substituem campos obrigatórios.

## Convenção dos códigos

Formato oficial:

`APL-[SEXO]-[OBJETIVO]-[NÍVEL]-[DIVISÃO]-[ESTRATÉGIA]-[VERSÃO]`

Exemplos:

- `APL-M-HIP-I-ABC-BASE-01`
- `APL-M-HIP-M-ABCD-PERF-01`
- `APL-F-HIP-I-FB-EFI-01`
- `APL-F-HIP-A-UL-ESP-GLUTEOS-01`

## Valores permitidos nos códigos

- `M`: Masculino
- `F`: Feminino
- `HIP`: Hipertrofia
- `I`: Iniciante
- `M`: Intermediário
- `A`: Avançado
- `FB`: Full Body
- `UL`: Upper/Lower
- `BASE`: Base
- `PERF`: Performance
- `EFI`: Eficiência
- `ESP`: Especialização

## Especializações

Para especializações, exigir o grupamento após `ESP`:

- `ESP-PEITO`
- `ESP-COSTAS`
- `ESP-DELTS`
- `ESP-GLUTEOS`
- `ESP-QUADRICEPS`
- `ESP-POSTERIORES`

## Relação entre código e arquivo

O nome do arquivo deve ser:

`[CODIGO].md`

O código dentro do documento deve ser idêntico ao nome do arquivo sem `.md`. Divergência entre arquivo e código interno deve ser tratada como erro de documentação.

## Regras de versão

- `0.x.x`: rascunho.
- `1.0.0`: primeira versão homologável.
- `1.x.x`: ajustes compatíveis.
- `2.0.0`: mudança estrutural ou metodológica relevante.

## Status permitidos

- Rascunho
- Em desenvolvimento
- Concluído — aguardando homologação
- Homologado
- Homologado com ressalvas
- Descontinuado
- Congelado

Não utilizar variações livres de status.

## Formatos recomendados

- Duração média: `45–60 minutos`.
- Frequência: `3 sessões semanais`.
- Ciclo sugerido: `8–12 semanas`.
- RIR predominante: `2–3`.
- Métodos complementares: listar métodos separados por vírgula ou usar `Nenhum`.

## Compatibilidade com o AQA

O AQA deve conseguir validar código, versão, status e metadados sem inferência manual. Usar os campos oficiais reduz inconsistências entre modelos e facilita homologação.

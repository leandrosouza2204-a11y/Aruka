# Stage 11.7 - Apresentação Comercial

Status: `IMPLEMENTED`

## Objetivo

A Stage 11.7 adiciona uma área interna de `Apresentação Comercial` em `/gestao-inteligente` para transformar os serviços ativos da Stage 11.3 em uma mensagem comercial curta, profissional e pronta para copiar.

## Mini-Discovery

- `COMMERCIAL_PRESENTATION_SOURCE`: `SERVICES_11_3`.
- `STORAGE_DECISION`: `CALCULATED_ONLY / EPHEMERAL`.
- `SUPABASE CHANGE`: `NO`.
- `FINANCE INTEGRATION`: `NO`.
- `WHATSAPP_DIRECT_SEND`: `NO`.
- `CLIPBOARD_COPY`: `YES`.

Os serviços vêm de `listSmartManagementServices("active")`, já normalizados pelo service da Gestão Inteligente. Serviços arquivados ficam fora da seleção normal. A interface reutiliza `AccessibleModal` para backdrop, foco preso, Escape, scroll interno e restauração de foco. Feedback usa `useToast`.

## Experiência

A nova aba `Apresentação` abre um painel com a ação `Montar apresentação`. A ação abre um modal sobre a página atual, sem rota nova e sem navegação externa.

No modal, o profissional escolhe quais serviços ativos entram na mensagem, edita a prévia em um `textarea` e clica em `Copiar mensagem`. Se a seleção mudar, a prévia fica marcada como desatualizada e a cópia só volta a ficar disponível após `Atualizar mensagem`, evitando sobrescrever ou enviar texto antigo sem aviso.

## Mensagem

O gerador puro `buildCommercialPresentation` recebe serviços normalizados e retorna plain text. Ele não acessa Supabase, DOM, React nem Clipboard API.

A mensagem usa:

- introdução profissional;
- blocos por serviço com `*negrito*` compatível com WhatsApp;
- bullets simples;
- preço em pt-BR pelo formatter canônico;
- frequência, duração, capacidade e descrição somente quando existem;
- fechamento simples.

Modelos suportados:

- `PER_SESSION`: preço por sessão.
- `PER_STUDENT_SESSION`: preço por aluno/sessão.
- `MONTHLY_PACKAGE`: preço por mês.
- `FIXED_PACKAGE`: pacote com quantidade de sessões quando informada.

## Privacidade

A apresentação não inclui dados internos de rentabilidade, repasse, local, receita líquida, valor por hora, IDs, `owner_id` ou `professional_id`. O Financeiro permanece separado.

## Clipboard

`copyTextToClipboard` fica separado do gerador. Ele usa `navigator.clipboard.writeText` quando disponível e fallback programático com `textarea` temporário + `document.execCommand("copy")` quando necessário. O usuário não precisa selecionar texto manualmente.

## Limitações

Esta Stage não implementa envio automático para WhatsApp, `wa.me`, WhatsApp Business API, CRM, contatos, PDF, imagem, export, checkout, PIX, contrato, proposta persistida, histórico de mensagens ou texto gerado por IA.

## Validação

- `npm.cmd run qa:smart-management-commercial-presentation`: PASS.
- `npm.cmd run qa:smart-management-commercial-message`: PASS.
- `npm.cmd run qa:smart-management-commercial-copy`: PASS.
- `npm.cmd run qa:smart-management-commercial-presentation-responsive`: PASS.
- `npm.cmd run qa:smart-management-commercial-presentation-accessibility`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS.

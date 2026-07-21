# Workflow de QA Autenticado - LOCAL_QA

## Fluxo principal

1. Iniciar Docker.
2. Executar:

```bash
npx supabase status
```

3. Preparar usuario e dados locais:

```bash
npm run qa:local:setup
```

4. Validar login e Dashboard:

```bash
npm run qa:dashboard-authenticated
```

5. Consultar evidencias em:

```text
reports/product-audit/dashboard-v1/evidence/
```

6. Implementar melhorias em ciclo proprio.

## Credenciais locais

As credenciais completas ficam somente em arquivos ignorados:

- `.env.qa.local`
- `.qa-local-credentials.txt`

## Protecao

`LOCAL_QA` aceita somente `localhost` ou `127.0.0.1`. Supabase Cloud, producao, dominios publicos e project ref remoto sao bloqueados pelo guard antes de login ou navegacao.

## Recriar apenas dados QA

```bash
npm run qa:local:user
npm run qa:local:data
```

Nao criar staging remoto e nao usar producao para auditorias desta fase.

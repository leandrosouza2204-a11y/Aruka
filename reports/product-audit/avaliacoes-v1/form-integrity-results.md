# Form Integrity Results

- Campos obrigatorios efetivos: aluno e data.
- Campos numericos auditados: idade, altura, peso, medidas corporais e dobras.
- Problema: inputs numericos sao texto livre, sem `min`, `max`, step ou validacao por campo.
- Problema: valores negativos, zero e extremos nao sao bloqueados no componente.
- Problema: valores nao numericos viram `null` em `avaliacoesMapper.js`, podendo gerar persistencia parcial silenciosa.
- Fotos: opcionais, com preview local e envio ao salvar.
- Acessibilidade de erro: toast global, sem associacao ao campo.

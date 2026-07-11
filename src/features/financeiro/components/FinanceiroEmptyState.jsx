import EmptyState from "../../../components/EmptyState";

function FinanceiroEmptyState({ visaoAcompanhamento }) {
  if (visaoAcompanhamento === "encerrados") {
    return (
      <EmptyState
        titulo="Nenhum acompanhamento encerrado"
        descricao="Alunos não renovados ou vencidos há mais de 90 dias aparecerão aqui."
      />
    );
  }

  return (
    <EmptyState
      titulo="Nenhum pagamento encontrado."
      descricao="Ajuste os filtros ou cadastre alunos com plano ativo para acompanhar cobranças."
    />
  );
}

export default FinanceiroEmptyState;

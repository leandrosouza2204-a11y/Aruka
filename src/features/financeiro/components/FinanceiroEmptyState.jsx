import EmptyState from "../../../components/EmptyState";

function FinanceiroEmptyState() {
  return (
    <EmptyState
      titulo="Nenhum pagamento encontrado."
      descricao="Ajuste os filtros ou cadastre alunos com plano ativo para acompanhar cobranças."
    />
  );
}

export default FinanceiroEmptyState;

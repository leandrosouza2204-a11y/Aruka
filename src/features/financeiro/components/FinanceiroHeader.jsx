import PageHero from "../../../components/PageHero";

function FinanceiroHeader({ onRelatorios }) {
  return (
    <PageHero
      eyebrow="FINANCEIRO"
      title="Controle financeiro"
      description="Acompanhe pagamentos, vencimentos, pendências e receita prevista."
      actions={
        <button type="button" className="table-button table-button-primary" onClick={onRelatorios}>
          Relatórios
        </button>
      }
    />
  );
}

export default FinanceiroHeader;

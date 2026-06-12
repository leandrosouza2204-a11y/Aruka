import PageHero from "../../../components/PageHero";

function FinanceiroHeader({ onRelatorios }) {
  return (
    <PageHero
      eyebrow="FINANCEIRO"
      title="Controle financeiro"
      description="Acompanhe pagamentos, vencimentos, pendencias e receita prevista."
      actions={
        <button type="button" className="table-button table-button-primary" onClick={onRelatorios}>
          Relatorios
        </button>
      }
    />
  );
}

export default FinanceiroHeader;

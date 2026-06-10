import { formatarData, formatarMoeda } from "../../../data/alunosUtils";

function FinanceiroMobileCards({
  atualizandoId,
  onDesfazer,
  onReceber,
  onWhatsApp,
  registros,
}) {
  return (
    <div className="mobile-card-list financeiro-mobile-cards">
      {registros.map((registro) => (
        <article key={registro.aluno.id} className="mobile-card">
          <strong>{registro.aluno.nome}</strong>
          <span>{registro.nomePlano}</span>
          <span>Contrato: {formatarMoeda(registro.valorContrato)}</span>
          <span>Parcela: {registro.parcelaAtual}/{registro.totalParcelas}</span>
          <span>Vencimento: {formatarData(registro.aluno.vencimento)}</span>
          <span>{registro.recebidoNoCiclo ? `Recebido em ${formatarData(registro.pagamentoCiclo?.dataPagamento)}` : "Pendente"}</span>
          <div className="table-actions-inline">
            {!registro.recebidoNoCiclo ? (
              <button
                onClick={() => onReceber(registro)}
                className="table-button table-button-success"
                disabled={atualizandoId === registro.aluno.id}
              >
                Receber
              </button>
            ) : (
              <button
                onClick={() => onDesfazer(registro)}
                className="table-button table-button-secondary"
                disabled={atualizandoId === registro.aluno.id}
              >
                {atualizandoId === registro.aluno.id ? "Salvando..." : "Desfazer"}
              </button>
            )}
            <button
              onClick={() => onWhatsApp(registro)}
              className="table-button table-button-success"
            >
              WhatsApp
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default FinanceiroMobileCards;

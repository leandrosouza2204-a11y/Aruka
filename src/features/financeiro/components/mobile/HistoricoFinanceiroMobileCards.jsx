import { useState } from "react";
import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";

function HistoricoFinanceiroMobileCards({ pagamentos, nomePlanoFallback, formatarTipoMovimento }) {
  if (pagamentos.length === 0) {
    return (
      <div className="financeiro-report-empty">
        Nenhum pagamento registrado.
      </div>
    );
  }

  return (
    <div className="mobile-card-list financeiro-history-mobile">
      {pagamentos.map((pagamento) => (
        <PagamentoCard
          key={pagamento.id}
          formatarTipoMovimento={formatarTipoMovimento}
          nomePlanoFallback={nomePlanoFallback}
          pagamento={pagamento}
        />
      ))}
    </div>
  );
}

function PagamentoCard({ pagamento, nomePlanoFallback, formatarTipoMovimento }) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const observacao = pagamento.observacao || pagamento.observacoes;
  const detalhesId = `pagamento-detalhes-${pagamento.id}`;

  return (
    <article className="mobile-list-card financeiro-report-card">
      <header className="financeiro-report-card-header">
        <div>
          <span className="card-label">Data do pagamento</span>
          <strong className="financeiro-report-card-title">
            {formatarData(pagamento.dataPagamento)}
          </strong>
        </div>
        <strong className="financeiro-report-card-money">
          {formatarMoeda(pagamento.valor)}
        </strong>
      </header>

      <div className="financeiro-report-card-main">
        <Info label="Plano" valor={pagamento.plano || nomePlanoFallback || "-"} />
        <Info label="Parcela" valor={pagamento.parcela || "-"} />
        <Info label="Forma" valor={pagamento.formaPagamento || "-"} />
        <Info label="Tipo" valor={formatarTipoMovimento(pagamento.tipoMovimento)} />
      </div>

      <button
        aria-controls={detalhesId}
        aria-expanded={detalhesAbertos}
        className="table-button table-button-secondary financeiro-report-details-toggle"
        onClick={() => setDetalhesAbertos((aberto) => !aberto)}
        type="button"
      >
        {detalhesAbertos ? "Ocultar detalhes" : "Ver detalhes"}
      </button>

      {detalhesAbertos && (
        <div className="financeiro-report-card-details" id={detalhesId}>
          <Info label="Vencimento da parcela" valor={formatarData(pagamento.vencimentoParcela)} />
          <Info label="Vencimento do plano antes" valor={formatarData(pagamento.vencimentoAnterior)} />
          <Info label="Vencimento do plano depois" valor={formatarData(pagamento.vencimentoNovo)} />
          <Info label="Observação" valor={observacao || "-"} block />
        </div>
      )}
    </article>
  );
}

function Info({ block = false, label, valor }) {
  return (
    <div className={`financeiro-report-info${block ? " financeiro-report-info-block" : ""}`}>
      <span className="card-label">{label}</span>
      <strong className="card-value">{valor || "-"}</strong>
    </div>
  );
}

export default HistoricoFinanceiroMobileCards;

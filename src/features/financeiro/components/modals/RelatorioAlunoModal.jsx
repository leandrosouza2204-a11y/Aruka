import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";
import { obterLabelMotivoEncerramento } from "../../constants/motivosEncerramento";
import { obterLabelTipoEventoAcompanhamento } from "../../constants/tiposEventosAcompanhamento";
import { useHistoricoAcompanhamento } from "../../hooks/useHistoricoAcompanhamento";
import ModalBase from "./ModalBase";
import ResumoItem from "./ResumoItem";

function RelatorioAlunoModal({ registro, onClose, styles }) {
  const resumo = registro.resumoAluno;
  const alunoId = registro.aluno?.id || "";
  const userId = registro.aluno?.userId || "";
  const historicoAcompanhamento = useHistoricoAcompanhamento({ userId, alunoId });

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(720px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Relatório financeiro do aluno</h2>
          <p style={styles.secaoLegenda}>{resumo.nomeAluno}</p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div className="financeiro-student-report-grid" style={styles.resumoGrid}>
        <ResumoItem label="Data de início" valor={formatarData(resumo.dataInicio)} styles={styles} />
        <ResumoItem
          label="Contrato atual"
          valor={formatarData(resumo.dataInicioContratoAtual)}
          styles={styles}
        />
        <ResumoItem label="Tempo na consultoria" valor={`${resumo.tempoConsultoriaMeses} meses`} styles={styles} />
        <ResumoItem label="Total pago" valor={formatarMoeda(resumo.totalPago)} styles={styles} />
        <ResumoItem label="Pagamentos" valor={resumo.quantidadePagamentos} styles={styles} />
        <ResumoItem label="Ticket médio" valor={formatarMoeda(resumo.ticketMedio)} styles={styles} />
        <ResumoItem label="Plano atual" valor={resumo.planoAtual} styles={styles} />
        <ResumoItem label="Último pagamento" valor={formatarData(resumo.ultimoPagamento?.dataPagamento)} styles={styles} />
        <ResumoItem label="Próximo vencimento" valor={formatarData(resumo.proximoVencimento)} styles={styles} />
      </div>

      <section className="financeiro-report-section" style={styles.relatorioBox}>
        <h3 style={styles.subtituloModal}>Resumo para promoções</h3>
        <p style={styles.secaoLegenda}>
          {resumo.recorrenteEmDia
            ? "Aluno com pagamentos recorrentes em dia, bom candidato para bônus, renovação antecipada ou campanha de fidelidade."
            : "Use o histórico para avaliar campanhas de reativação, renovação ou acompanhamento individual."}
        </p>
      </section>

      <section className="financeiro-report-section" style={styles.relatorioBox}>
        <h3 style={styles.subtituloModal}>Histórico do acompanhamento</h3>
        <HistoricoAcompanhamentoContent
          carregando={historicoAcompanhamento.carregando}
          erro={historicoAcompanhamento.erro}
          eventos={historicoAcompanhamento.eventos}
        />
      </section>

      {registro.grupoAcompanhamento === "encerrados" && (
        <section className="financeiro-report-section" style={styles.relatorioBox}>
          <h3 style={styles.subtituloModal}>Encerramento do acompanhamento</h3>
          <div className="financeiro-student-report-grid" style={styles.resumoGrid}>
            <ResumoItem label="Status" valor={registro.statusAcompanhamento} styles={styles} />
            <ResumoItem label="Motivo" valor={registro.motivoEncerramento.label} styles={styles} />
            <ResumoItem
              label="Data de encerramento"
              valor={formatarData(registro.acompanhamento.encerradoEm)}
              styles={styles}
            />
            {registro.motivoEncerramento.detalhe && (
              <ResumoItem
                label="Observação"
                valor={registro.motivoEncerramento.detalhe}
                styles={styles}
              />
            )}
          </div>
        </section>
      )}
    </ModalBase>
  );
}

function HistoricoAcompanhamentoContent({ carregando, erro, eventos }) {
  if (carregando) {
    return (
      <p className="app-loading" style={historicoStyles.estado}>
        Carregando histórico do acompanhamento...
      </p>
    );
  }

  if (erro) {
    return (
      <p className="app-error" style={historicoStyles.estado}>
        {erro}
      </p>
    );
  }

  if (!eventos.length) {
    return (
      <p className="app-empty-state" style={historicoStyles.estado}>
        Nenhum evento de acompanhamento registrado.
      </p>
    );
  }

  return (
    <div style={historicoStyles.lista}>
      {eventos.map((evento) => (
        <EventoAcompanhamentoItem key={evento.id || evento.eventKey} evento={evento} />
      ))}
    </div>
  );
}

function EventoAcompanhamentoItem({ evento }) {
  const detalhes = montarDetalhesEvento(evento);

  return (
    <article style={historicoStyles.evento}>
      <div style={historicoStyles.eventoTopo}>
        <strong style={historicoStyles.eventoTitulo}>
          {obterLabelTipoEventoAcompanhamento(evento.tipo)}
        </strong>
        <span className="app-muted" style={historicoStyles.eventoData}>
          {formatarDataHora(evento.ocorridoEm)}
        </span>
      </div>

      {detalhes.length > 0 && (
        <dl style={historicoStyles.detalhes}>
          {detalhes.map((detalhe) => (
            <div key={detalhe.label} style={historicoStyles.detalheLinha}>
              <dt style={historicoStyles.detalheLabel}>{detalhe.label}</dt>
              <dd style={historicoStyles.detalheValor}>{detalhe.valor}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function montarDetalhesEvento(evento) {
  const detalhes = [];

  if (evento.motivo) {
    detalhes.push({
      label: evento.tipo === "acompanhamento_reativado" ? "Motivo anterior" : "Motivo",
      valor: obterLabelMotivoEncerramento(evento.motivo),
    });
  }

  if (evento.motivoDetalhe) {
    detalhes.push({
      label: evento.tipo === "acompanhamento_reativado" ? "Detalhe anterior" : "Detalhe",
      valor: evento.motivoDetalhe,
    });
  }

  if (evento.planoNome) {
    detalhes.push({
      label: "Plano",
      valor: evento.planoNome,
    });
  }

  const vencimento = formatarVencimentoEvento(evento);
  if (vencimento) {
    detalhes.push({
      label: "Vencimento",
      valor: vencimento,
    });
  }

  return detalhes;
}

function formatarVencimentoEvento(evento) {
  if (evento.vencimentoAnterior && evento.vencimentoNovo) {
    return `${formatarData(evento.vencimentoAnterior)} -> ${formatarData(evento.vencimentoNovo)}`;
  }

  if (evento.vencimentoAnterior) {
    return formatarData(evento.vencimentoAnterior);
  }

  if (evento.vencimentoNovo) {
    return formatarData(evento.vencimentoNovo);
  }

  return "";
}

function formatarDataHora(data) {
  if (!data) return "-";

  const date = new Date(data);
  if (Number.isNaN(date.getTime())) return formatarData(data);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const historicoStyles = {
  estado: {
    margin: "12px 0 0",
  },
  lista: {
    display: "grid",
    gap: "10px",
    marginTop: "14px",
  },
  evento: {
    borderTop: "1px solid #e5e7eb",
    display: "grid",
    gap: "10px",
    paddingTop: "12px",
  },
  eventoTopo: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px 12px",
    justifyContent: "space-between",
  },
  eventoTitulo: {
    color: "#111827",
    fontSize: "14px",
    lineHeight: 1.35,
  },
  eventoData: {
    fontSize: "13px",
    lineHeight: 1.35,
  },
  detalhes: {
    display: "grid",
    gap: "6px",
    margin: 0,
  },
  detalheLinha: {
    display: "grid",
    gap: "2px",
  },
  detalheLabel: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
  },
  detalheValor: {
    color: "#374151",
    fontSize: "13px",
    lineHeight: 1.4,
    margin: 0,
    overflowWrap: "anywhere",
  },
};

export default RelatorioAlunoModal;

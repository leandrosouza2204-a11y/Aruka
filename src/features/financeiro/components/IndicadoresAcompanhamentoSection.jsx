import { formatarData } from "../../../data/alunosUtils";
import { obterLabelMotivoEncerramento } from "../constants/motivosEncerramento";
import { DATA_CORTE_EVENTOS_ACOMPANHAMENTO } from "../constants/retencaoConfig";
import { useIndicadoresAcompanhamento } from "../hooks/useIndicadoresAcompanhamento";

function IndicadoresAcompanhamentoSection({ styles }) {
  const {
    carregando,
    erro,
    indicadores,
    opcoesPeriodo,
    periodoSelecionado,
    setPeriodoSelecionado,
  } = useIndicadoresAcompanhamento();
  const avisoDataCorte = indicadores.periodo.limitadoPorDataCorte
    ? `Parte do período selecionado é anterior ao início do histórico. Os dados exibidos começam em ${formatarData(DATA_CORTE_EVENTOS_ACOMPANHAMENTO)}.`
    : `Os indicadores de acompanhamento consideram eventos registrados a partir de ${formatarData(DATA_CORTE_EVENTOS_ACOMPANHAMENTO)}.`;
  const semEventos = !carregando && !erro && indicadores.totalEventos === 0;

  return (
    <section style={styles.relatorioBox}>
      <div style={sectionStyles.topo}>
        <div>
          <h3 style={styles.subtituloModal}>Movimentações de acompanhamento</h3>
          <p className="app-muted" style={sectionStyles.legenda}>
            Contagens descritivas de eventos registrados no período.
          </p>
        </div>

        <label style={sectionStyles.filtroPeriodo}>
          <span style={styles.labelCampo}>Período</span>
          <select
            value={periodoSelecionado}
            onChange={(event) => setPeriodoSelecionado(event.target.value)}
            style={styles.campo}
          >
            {opcoesPeriodo.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="app-alert" style={sectionStyles.aviso}>
        {avisoDataCorte}
      </p>

      {carregando && (
        <p className="app-loading" style={sectionStyles.estado}>
          Carregando indicadores de acompanhamento...
        </p>
      )}

      {erro && (
        <p className="app-error" style={sectionStyles.estado}>
          {erro}
        </p>
      )}

      {!carregando && !erro && (
        <>
          <div style={sectionStyles.cardsGrid}>
            <IndicadorCard
              titulo="Renovações"
              valor={indicadores.renovacoes}
              descricao="eventos no período"
            />
            <IndicadorCard
              titulo="Encerramentos manuais"
              valor={indicadores.encerramentosManuais}
              descricao="eventos no período"
            />
            <IndicadorCard
              titulo="Reativações"
              valor={indicadores.reativacoes}
              descricao="eventos no período"
            />
          </div>

          {semEventos && (
            <p className="app-empty-state" style={sectionStyles.estado}>
              Nenhuma movimentação de acompanhamento foi registrada neste período.
            </p>
          )}

          <section style={sectionStyles.motivosBox}>
            <h4 style={sectionStyles.motivosTitulo}>Motivos dos encerramentos manuais</h4>
            {indicadores.motivosEncerramento.length === 0 ? (
              <p className="app-empty-state" style={sectionStyles.estado}>
                Nenhum encerramento manual com motivo foi registrado neste período.
              </p>
            ) : (
              <div style={sectionStyles.motivosLista}>
                {indicadores.motivosEncerramento.map((item) => (
                  <MotivoLinha key={item.motivo || "motivo-nao-informado"} item={item} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

function IndicadorCard({ titulo, valor, descricao }) {
  return (
    <article style={sectionStyles.card}>
      <span style={sectionStyles.cardTitulo}>{titulo}</span>
      <strong style={sectionStyles.cardValor}>{valor}</strong>
      <span className="app-muted" style={sectionStyles.cardDescricao}>
        {descricao}
      </span>
    </article>
  );
}

function MotivoLinha({ item }) {
  return (
    <span style={sectionStyles.motivoLinha}>
      <strong>{obterLabelMotivoEncerramento(item.motivo)}</strong>
      <span>{item.quantidade}</span>
    </span>
  );
}

const sectionStyles = {
  topo: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "space-between",
  },
  legenda: {
    fontSize: "13px",
    lineHeight: 1.45,
    margin: "6px 0 0",
  },
  filtroPeriodo: {
    display: "grid",
    gap: "6px",
    minWidth: "190px",
  },
  aviso: {
    fontSize: "13px",
    lineHeight: 1.45,
    margin: "14px 0 0",
    padding: "10px 12px",
  },
  estado: {
    margin: "14px 0 0",
  },
  cardsGrid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    marginTop: "16px",
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    display: "grid",
    gap: "6px",
    padding: "14px",
  },
  cardTitulo: {
    color: "#374151",
    fontSize: "13px",
    fontWeight: 800,
  },
  cardValor: {
    color: "#111827",
    fontSize: "26px",
    lineHeight: 1,
  },
  cardDescricao: {
    fontSize: "12px",
  },
  motivosBox: {
    borderTop: "1px solid #e5e7eb",
    marginTop: "18px",
    paddingTop: "14px",
  },
  motivosTitulo: {
    fontSize: "14px",
    margin: 0,
  },
  motivosLista: {
    display: "grid",
    gap: "8px",
    marginTop: "12px",
  },
  motivoLinha: {
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    paddingBottom: "8px",
  },
};

export default IndicadoresAcompanhamentoSection;

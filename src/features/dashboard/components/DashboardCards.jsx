import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import {
  calcularStatus,
  formatarMoeda,
  normalizarAluno,
} from "../../../data/alunosUtils";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import { buscarPagamentosSupabase } from "../../../services/pagamentosService";
import {
  abrirWhatsApp,
  gerarMensagemCheckinSemanal,
  normalizarTelefoneWhatsApp,
} from "../../../services/whatsappService";

function Dashboard() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [modalCheckinAberto, setModalCheckinAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, pagamentosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarPagamentosSupabase(),
        ]);

        setAlunos(alunosSupabase.map(normalizarAluno));
        setPagamentos(pagamentosSupabase);
      } catch (error) {
        setErro(`Erro ao carregar dashboard: ${error.message}`);
        setAlunos([]);
        setPagamentos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const totalAlunos = alunos.length;

  const receitaPrevista = alunos.reduce(
    (total, aluno) => total + Number(aluno.valor || 0),
    0
  );

  const receitaRecebida = pagamentos.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );

  const receitaPendente = Math.max(receitaPrevista - receitaRecebida, 0);

  const alunosVencendo = alunos.filter((aluno) =>
    ["Vencendo", "Vencendo parcela"].includes(
      calcularStatus(aluno.vencimento, aluno.plano)
    )
  ).length;

  const alunosAtrasados = alunos.filter((aluno) =>
    ["Atrasado", "Parcela atrasada"].includes(
      calcularStatus(aluno.vencimento, aluno.plano)
    )
  ).length;

  const alunosAtivosCheckin = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .filter(
          (aluno) =>
            !["Atrasado", "Parcela atrasada"].includes(
              calcularStatus(aluno.vencimento, aluno.plano)
            )
        ),
    [alunos]
  );

  const receitaMensal = useMemo(() => gerarReceitaMensal(pagamentos), [pagamentos]);
  const maiorReceitaMensal = Math.max(
    ...receitaMensal.map((mes) => mes.total),
    0
  );
  const alertasConsultoria = useMemo(
    () =>
      montarAlertasConsultoria({
        alunosAtrasados,
        alunosVencendo,
        alunosAtivosCheckin,
        receitaPendente,
      }),
    [alunosAtrasados, alunosAtivosCheckin, alunosVencendo, receitaPendente]
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="dashboard-page" style={conteudo}>
        <header style={dashboardHeader}>
          <div>
            <h1 style={dashboardTitulo}>Dashboard da Consultoria</h1>
            <p style={dashboardSubtitulo}>
              Visão geral da sua operação, alunos e receitas.
            </p>
          </div>
        </header>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={cardsGrid}>
          <MetricCard
            titulo="Total de Alunos"
            valor={carregando ? "..." : totalAlunos}
            legenda="Alunos cadastrados"
            icon={<Users size={18} />}
          />
          <MetricCard
            titulo="Receita Prevista"
            valor={carregando ? "..." : formatarMoeda(receitaPrevista)}
            legenda="Total previsto no período"
            icon={<TrendingUp size={18} />}
          />
          <MetricCard
            titulo="Receita Recebida"
            valor={carregando ? "..." : formatarMoeda(receitaRecebida)}
            legenda="Pagamentos já confirmados"
            icon={<WalletCards size={18} />}
            destaque="#16a34a"
          />
          <MetricCard
            titulo="Receita Pendente"
            valor={carregando ? "..." : formatarMoeda(receitaPendente)}
            legenda="Valores ainda pendentes"
            icon={<DollarSign size={18} />}
            destaque="#dc2626"
          />
          <MetricCard
            titulo="Alunos Vencendo"
            valor={carregando ? "..." : alunosVencendo}
            legenda="Próximos do vencimento"
            icon={<CalendarClock size={18} />}
            destaque="#f59e0b"
          />
          <MetricCard
            titulo="Alunos Atrasados"
            valor={carregando ? "..." : alunosAtrasados}
            legenda="Necessitam atenção"
            icon={<AlertTriangle size={18} />}
            destaque="#dc2626"
          />

          <div className="dashboard-metric-card" style={{ ...card, ...checkinCard }}>
            <div style={metricHeader}>
              <span style={metricIcon}>
                <ClipboardCheck size={18} />
              </span>
              <span style={metricLabel}>Check-in semanal</span>
            </div>
            <p style={numero}>{carregando ? "..." : alunosAtivosCheckin.length}</p>
            <span style={metricHint}>Alunos aptos para contato semanal</span>
            <button
              type="button"
              onClick={() => setModalCheckinAberto(true)}
              style={botaoPrimario}
              disabled={carregando || alunosAtivosCheckin.length === 0}
            >
              Enviar check-ins
            </button>
          </div>
        </div>

        <section className="dashboard-panel" style={graficoCard}>
          <div style={secaoTopo}>
            <div>
              <h2 style={secaoTitulo}>Receita Mensal</h2>
              <p style={secaoLegenda}>Evolução dos pagamentos confirmados nos últimos 6 meses.</p>
            </div>
            <span style={historicoTag}>Histórico de pagamentos</span>
          </div>

          {receitaMensal.some((mes) => mes.total > 0) ? (
            <>
              <div className="dashboard-chart-desktop" style={grafico}>
                {receitaMensal.map((mes) => {
                  const altura =
                    maiorReceitaMensal > 0
                      ? Math.max((mes.total / maiorReceitaMensal) * 100, 8)
                      : 0;

                  return (
                    <div key={mes.chave} style={barraItem}>
                      <div style={barraValor}>{formatarMoeda(mes.total)}</div>
                      <div style={barraTrilho}>
                        <div style={{ ...barra, height: `${altura}%` }} />
                      </div>
                      <div style={barraLabel}>{mes.rotulo}</div>
                    </div>
                  );
                })}
              </div>

              <div className="dashboard-chart-mobile" style={graficoMobile}>
                {receitaMensal.map((mes) => {
                  const largura =
                    maiorReceitaMensal > 0
                      ? Math.max((mes.total / maiorReceitaMensal) * 100, 4)
                      : 4;

                  return (
                    <div key={mes.chave} style={linhaMobile}>
                      <div style={linhaMobileTopo}>
                        <span style={barraLabel}>{mes.rotulo}</span>
                        <strong style={barraValor}>{formatarMoeda(mes.total)}</strong>
                      </div>
                      <div style={trilhoMobile}>
                        <div style={{ ...barraMobile, width: `${largura}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={estadoVazio}>
              {carregando
                ? "Carregando pagamentos..."
                : "Nenhum pagamento registrado para gerar o gráfico."}
            </p>
          )}
        </section>

        <section className="dashboard-panel" style={resumoCard}>
          <div style={secaoTopo}>
            <div>
              <h2 style={secaoTitulo}>Alertas da consultoria</h2>
              <p style={secaoLegenda}>
                Pontos que merecem uma revisão rápida hoje.
              </p>
            </div>
          </div>

          {carregando ? (
            <p style={estadoVazio}>Carregando alertas...</p>
          ) : alertasConsultoria.length > 0 ? (
            <div style={alertasGrid}>
              {alertasConsultoria.map((alerta) => (
                <div key={alerta.titulo} className="dashboard-alert-item" style={alertaItem}>
                  <span className={`status-badge status-badge-${alerta.tom}`}>
                    {alerta.rotulo}
                  </span>
                  <div>
                    <strong style={alertaTitulo}>{alerta.titulo}</strong>
                    <p style={alertaTexto}>{alerta.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-premium" style={estadoVazioPremium}>
              <CheckCircle2 size={20} />
              <span>Tudo certo por enquanto. Nenhuma ação crítica encontrada.</span>
            </div>
          )}
        </section>
      </div>

      {modalCheckinAberto && (
        <CheckinModal
          alunos={alunosAtivosCheckin}
          onClose={() => setModalCheckinAberto(false)}
        />
      )}
    </div>
  );
}

function MetricCard({ titulo, valor, legenda, icon, destaque = "#111827" }) {
  return (
    <div className="dashboard-metric-card" style={card}>
      <div style={metricHeader}>
        <span style={metricIcon}>{icon}</span>
        <span style={metricLabel}>{titulo}</span>
      </div>
      <p style={{ ...numero, color: destaque }}>{valor}</p>
      <span style={metricHint}>{legenda}</span>
    </div>
  );
}

function montarAlertasConsultoria({
  alunosAtrasados,
  alunosVencendo,
  alunosAtivosCheckin,
  receitaPendente,
}) {
  const alertas = [];

  if (alunosAtrasados > 0) {
    alertas.push({
      titulo: "Regularizar alunos atrasados",
      texto: "Priorize contato e renegociação para evitar perda de acompanhamento.",
      rotulo: "Atenção",
      tom: "danger",
    });
  }

  if (alunosVencendo > 0) {
    alertas.push({
      titulo: "Enviar lembretes de vencimento",
      texto: "Há contratos próximos da renovação que podem ser tratados com antecedência.",
      rotulo: "Agenda",
      tom: "warning",
    });
  }

  if (receitaPendente > 0) {
    alertas.push({
      titulo: "Revisar pagamentos pendentes",
      texto: "Confira o financeiro e registre recebimentos já confirmados.",
      rotulo: "Financeiro",
      tom: "info",
    });
  }

  if (alunosAtivosCheckin.length > 0) {
    alertas.push({
      titulo: "Rodar check-in semanal",
      texto: "Use a rotina de contato para manter proximidade com alunos ativos.",
      rotulo: "Check-in",
      tom: "success",
    });
  }

  return alertas;
}

function CheckinModal({ alunos, onClose }) {
  function enviar(aluno) {
    abrirWhatsApp(aluno.whatsapp, gerarMensagemCheckinSemanal(aluno));
  }

  return (
    <div style={modalOverlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={modalTitulo}>Check-in semanal</h2>
            <p style={modalLegenda}>
              Abra o WhatsApp aluno por aluno para manter o envio manual.
            </p>
          </div>

          <button type="button" onClick={onClose} style={botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={listaCheckin}>
          {alunos.map((aluno) => {
            const possuiWhatsapp = Boolean(
              normalizarTelefoneWhatsApp(aluno.whatsapp)
            );

            return (
              <div key={aluno.id} style={itemCheckin}>
                <div>
                  <strong style={nomeCheckin}>{aluno.nome}</strong>
                  <span style={whatsappCheckin}>
                    {aluno.whatsapp || "WhatsApp não cadastrado"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => enviar(aluno)}
                  style={possuiWhatsapp ? botaoWhatsApp : botaoDesabilitado}
                  disabled={!possuiWhatsapp}
                  title={
                    possuiWhatsapp
                      ? "Enviar check-in semanal"
                      : "WhatsApp não cadastrado"
                  }
                >
                  Enviar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function gerarReceitaMensal(pagamentos) {
  const hoje = new Date();

  const meses = Array.from({ length: 6 }, (_, index) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - index), 1);
    const chave = data.toISOString().slice(0, 7);
    const rotulo = data.toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });

    return {
      chave,
      rotulo: rotulo.replace(".", ""),
      total: 0,
    };
  });

  const indicePorMes = new Map(meses.map((mes, index) => [mes.chave, index]));

  pagamentos.forEach((pagamento) => {
    if (!pagamento.dataPagamento) return;

    const chave = pagamento.dataPagamento.slice(0, 7);
    const indice = indicePorMes.get(chave);

    if (indice === undefined) return;

    meses[indice].total += Number(pagamento.valor || 0);
  });

  return meses;
}

const conteudo = {
  padding: "32px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const dashboardHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "flex-start",
};

const dashboardTitulo = {
  color: "#111827",
  fontSize: "32px",
  lineHeight: 1.15,
  margin: 0,
};

const dashboardSubtitulo = {
  color: "#6b7280",
  fontSize: "15px",
  marginTop: "8px",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
  minHeight: "154px",
  padding: "18px",
};

const checkinCard = {
  display: "flex",
  flexDirection: "column",
  gridColumn: "span 2",
  justifyContent: "space-between",
  minHeight: "154px",
};

const metricHeader = {
  alignItems: "center",
  display: "flex",
  gap: "10px",
};

const metricIcon = {
  alignItems: "center",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  height: "34px",
  justifyContent: "center",
  width: "34px",
};

const metricLabel = {
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "800",
};

const metricHint = {
  color: "#6b7280",
  display: "block",
  fontSize: "13px",
  marginTop: "6px",
};

const botaoPrimario = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  marginTop: "14px",
  minHeight: "40px",
  padding: "9px 12px",
};

const numero = {
  fontSize: "30px",
  fontWeight: "850",
  letterSpacing: "-0.01em",
  marginTop: "14px",
};

const graficoCard = {
  ...card,
  marginTop: "22px",
  minHeight: "auto",
};

const resumoCard = {
  ...card,
  marginTop: "22px",
  minHeight: "auto",
};

const secaoTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const secaoLegenda = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

const secaoTitulo = {
  margin: 0,
  fontSize: "22px",
};

const historicoTag = {
  background: "#eef2ff",
  border: "1px solid #dbeafe",
  borderRadius: "999px",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "800",
  padding: "7px 10px",
};

const grafico = {
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(80px, 1fr))",
  gap: "14px",
  alignItems: "end",
  minHeight: "230px",
  marginTop: "20px",
  overflowX: "auto",
};

const barraItem = {
  display: "grid",
  gridTemplateRows: "auto 180px auto",
  gap: "8px",
  minWidth: "80px",
  textAlign: "center",
};

const barraValor = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "bold",
};

const barraTrilho = {
  display: "flex",
  alignItems: "end",
  background: "#eef2ff",
  borderRadius: "8px",
  overflow: "hidden",
};

const barra = {
  width: "100%",
  background: "linear-gradient(180deg, #60a5fa, #2563eb)",
  borderRadius: "8px 8px 0 0",
};

const barraLabel = {
  color: "#4b5563",
  fontSize: "13px",
  textTransform: "capitalize",
};

const graficoMobile = {
  display: "none",
  gap: "12px",
  marginTop: "18px",
};

const linhaMobile = {
  display: "grid",
  gap: "8px",
};

const linhaMobileTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const trilhoMobile = {
  background: "#eef2ff",
  borderRadius: "999px",
  height: "12px",
  overflow: "hidden",
};

const barraMobile = {
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  borderRadius: "999px",
  height: "100%",
};

const estadoVazio = {
  color: "#6b7280",
  marginTop: "18px",
};

const alertasGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const alertaItem = {
  alignItems: "flex-start",
  background: "#f9fafb",
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  display: "grid",
  gap: "12px",
  padding: "14px",
};

const alertaTitulo = {
  color: "#111827",
  display: "block",
  fontSize: "14px",
};

const alertaTexto = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.45,
  marginTop: "5px",
};

const estadoVazioPremium = {
  alignItems: "center",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  display: "flex",
  gap: "10px",
  fontSize: "14px",
  fontWeight: "800",
  marginTop: "18px",
  padding: "14px",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.58)",
};

const modal = {
  width: "min(640px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
};

const modalTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
};

const modalTitulo = {
  color: "#111827",
  fontSize: "22px",
  margin: 0,
};

const modalLegenda = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const listaCheckin = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
};

const itemCheckin = {
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "space-between",
  padding: "12px",
};

const nomeCheckin = {
  color: "#111827",
  display: "block",
};

const whatsappCheckin = {
  color: "#6b7280",
  display: "block",
  fontSize: "13px",
  marginTop: "4px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  padding: "10px 14px",
};

const botaoWhatsApp = {
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "38px",
  padding: "8px 12px",
};

const botaoDesabilitado = {
  background: "#e5e7eb",
  color: "#9ca3af",
  border: "none",
  borderRadius: "8px",
  cursor: "not-allowed",
  fontWeight: "800",
  minHeight: "38px",
  padding: "8px 12px",
};

export default Dashboard;



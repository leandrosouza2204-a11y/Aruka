import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  calcularStatus,
  formatarMoeda,
  normalizarAluno,
} from "../data/alunosUtils";
import { buscarAlunosSupabase } from "../services/alunosService";
import { buscarPagamentosSupabase } from "../services/pagamentosService";
import {
  abrirWhatsApp,
  gerarMensagemCheckinSemanal,
  normalizarTelefoneWhatsApp,
} from "../services/whatsappService";

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

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <h1>Dashboard da Consultoria</h1>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={cardsGrid}>
          <div style={card}>
            <h3>Total de Alunos</h3>
            <p style={numero}>{carregando ? "..." : totalAlunos}</p>
          </div>

          <div style={card}>
            <h3>Receita Prevista</h3>
            <p style={numero}>
              {carregando ? "..." : formatarMoeda(receitaPrevista)}
            </p>
          </div>

          <div style={card}>
            <h3>Receita Recebida</h3>
            <p style={numero}>
              {carregando ? "..." : formatarMoeda(receitaRecebida)}
            </p>
          </div>

          <div style={card}>
            <h3>Receita Pendente</h3>
            <p style={numero}>
              {carregando ? "..." : formatarMoeda(receitaPendente)}
            </p>
          </div>

          <div style={card}>
            <h3>Alunos Vencendo</h3>
            <p style={{ ...numero, color: "#f59e0b" }}>
              {carregando ? "..." : alunosVencendo}
            </p>
          </div>

          <div style={card}>
            <h3>Alunos Atrasados</h3>
            <p style={{ ...numero, color: "#dc2626" }}>
              {carregando ? "..." : alunosAtrasados}
            </p>
          </div>

          <div style={card}>
            <h3>Check-in semanal</h3>
            <p style={numero}>
              {carregando ? "..." : alunosAtivosCheckin.length}
            </p>
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

        <section style={graficoCard}>
          <div style={secaoTopo}>
            <h2>Receita Mensal</h2>
            <span style={secaoLegenda}>Historico de pagamentos</span>
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
                : "Nenhum pagamento registrado para gerar o grafico."}
            </p>
          )}
        </section>

        <section style={resumoCard}>
          <div style={secaoTopo}>
            <h2>Resumo da Consultoria</h2>
            <span style={secaoLegenda}>Visao geral da carteira</span>
          </div>

          <div style={resumoGrid}>
            <div style={resumoItem}>
              <span style={resumoLabel}>Alunos cadastrados</span>
              <strong style={resumoValor}>{carregando ? "..." : totalAlunos}</strong>
            </div>

            <div style={resumoItem}>
              <span style={resumoLabel}>Cobrancas pendentes</span>
              <strong style={{ ...resumoValor, color: "#dc2626" }}>
                {carregando ? "..." : alunosAtrasados}
              </strong>
            </div>

            <div style={resumoItem}>
              <span style={resumoLabel}>Proximos do vencimento</span>
              <strong style={{ ...resumoValor, color: "#f59e0b" }}>
                {carregando ? "..." : alunosVencendo}
              </strong>
            </div>
          </div>
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
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  background: "#f3f4f6",
  minHeight: "100vh",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "30px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const botaoPrimario = {
  background: "#111827",
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
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px",
};

const graficoCard = {
  ...card,
  marginTop: "30px",
};

const resumoCard = {
  ...card,
  marginTop: "30px",
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
};

const grafico = {
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(80px, 1fr))",
  gap: "14px",
  alignItems: "end",
  minHeight: "260px",
  marginTop: "24px",
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
  background: "#eef2f7",
  borderRadius: "8px",
  overflow: "hidden",
};

const barra = {
  width: "100%",
  background: "#2563eb",
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
  background: "#eef2f7",
  borderRadius: "999px",
  height: "12px",
  overflow: "hidden",
};

const barraMobile = {
  background: "#2563eb",
  borderRadius: "999px",
  height: "100%",
};

const estadoVazio = {
  color: "#6b7280",
  marginTop: "18px",
};

const resumoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const resumoItem = {
  background: "#f9fafb",
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "14px",
};

const resumoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "700",
  marginBottom: "8px",
};

const resumoValor = {
  color: "#111827",
  fontSize: "24px",
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

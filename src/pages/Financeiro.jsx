import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { planos } from "../data/planos";
import {
  calcularDatas,
  calcularStatus,
  corStatus,
  dataHojeISO,
  formatarData,
  formatarMoeda,
} from "../data/alunosUtils";
import {
  atualizarAlunoSupabase,
  buscarAlunosSupabase,
} from "../services/alunosService";
import {
  adicionarPagamentoSupabase,
  buscarPagamentosSupabase,
  excluirPagamentoSupabase,
} from "../services/pagamentosService";

const pagamentoInicial = {
  dataPagamento: dataHojeISO(),
  valor: "",
  formaPagamento: "Pix",
  parcela: 1,
  totalParcelas: 1,
  observacoes: "",
};

function Financeiro() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizandoId, setAtualizandoId] = useState("");
  const [modalPagamento, setModalPagamento] = useState(null);
  const [formPagamento, setFormPagamento] = useState(pagamentoInicial);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, pagamentosSupabase] = await Promise.all([
        buscarAlunosSupabase(),
        buscarPagamentosSupabase(),
      ]);

      setAlunos(alunosSupabase);
      setPagamentos(pagamentosSupabase);
    } catch (error) {
      setErro(`Erro ao carregar dados financeiros: ${error.message}`);
      setAlunos([]);
      setPagamentos([]);
    } finally {
      setCarregando(false);
    }
  }

  const registrosFinanceiros = useMemo(
    () =>
      alunos.map((aluno) =>
        montarRegistroFinanceiro(
          aluno,
          pagamentos.filter((pagamento) => pagamento.alunoId === aluno.id)
        )
      ),
    [alunos, pagamentos]
  );

  const registrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return registrosFinanceiros
      .filter((registro) => {
        const combinaBusca = registro.aluno.nome.toLowerCase().includes(termo);
        const combinaStatus =
          filtroStatus === "todos" || registro.aluno.status === filtroStatus;
        const combinaPagamento =
          filtroPagamento === "todos" ||
          (filtroPagamento === "recebidos" && registro.recebidoNoCiclo) ||
          (filtroPagamento === "pendentes" && !registro.recebidoNoCiclo);

        return combinaBusca && combinaStatus && combinaPagamento;
      })
      .sort((a, b) =>
        String(a.aluno.vencimento).localeCompare(String(b.aluno.vencimento))
      );
  }, [busca, filtroPagamento, filtroStatus, registrosFinanceiros]);

  const receitaPrevista = registrosFinanceiros.reduce(
    (total, registro) => total + registro.valorContrato,
    0
  );

  const receitaRecebida = registrosFinanceiros.reduce(
    (total, registro) => total + registro.totalRecebido,
    0
  );

  const receitaPendente = registrosFinanceiros.reduce(
    (total, registro) => total + registro.valorPendente,
    0
  );

  const alunosAtivos = alunos.filter((aluno) => aluno.status === "Ativo").length;
  const alunosVencidos = alunos.filter(
    (aluno) => aluno.status === "Atrasado"
  ).length;

  function abrirRegistroPagamento(registro) {
    setModalPagamento(registro);
    setFormPagamento({
      dataPagamento: dataHojeISO(),
      valor: registro.valorParcela.toFixed(2),
      formaPagamento: "Pix",
      parcela: registro.parcelaAtual,
      totalParcelas: registro.totalParcelas,
      observacoes: "",
    });
  }

  async function registrarPagamento() {
    if (!modalPagamento) return;

    const valor = Number(formPagamento.valor || 0);

    if (!formPagamento.dataPagamento || valor <= 0) {
      alert("Informe a data e um valor valido para o pagamento.");
      return;
    }

    const aluno = modalPagamento.aluno;
    setAtualizandoId(aluno.id);
    setErro("");

    try {
      const novoPagamento = await adicionarPagamentoSupabase({
        alunoId: aluno.id,
        dataPagamento: formPagamento.dataPagamento,
        valor,
        formaPagamento: formPagamento.formaPagamento,
        parcela: formPagamento.parcela,
        totalParcelas: formPagamento.totalParcelas,
        observacoes: formPagamento.observacoes,
      });

      await sincronizarStatusPagamento(aluno, [
        ...modalPagamento.pagamentos,
        novoPagamento,
      ]);
      await carregarDados();
      fecharModalPagamento();
    } catch (error) {
      setErro(`Erro ao registrar pagamento: ${error.message}`);
    } finally {
      setAtualizandoId("");
    }
  }

  async function desfazerPagamento(registro) {
    const pagamento = registro.pagamentoCiclo || registro.ultimoPagamento;

    if (!pagamento) return;
    if (!window.confirm("Deseja desfazer este pagamento?")) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await excluirPagamentoSupabase(pagamento.id);
      await sincronizarStatusPagamento(
        registro.aluno,
        registro.pagamentos.filter((item) => item.id !== pagamento.id)
      );
      await carregarDados();
    } catch (error) {
      setErro(`Erro ao desfazer pagamento: ${error.message}`);
    } finally {
      setAtualizandoId("");
    }
  }

  async function sincronizarStatusPagamento(aluno, pagamentosAluno) {
    const valorContrato = Number(aluno.valor || 0);
    const totalParcelas = aluno.plano === "trimestralParcelado" ? 3 : 1;
    const totalRecebido = pagamentosAluno.reduce(
      (total, pagamento) => total + Number(pagamento.valor || 0),
      0
    );
    const ultimoPagamento = [...pagamentosAluno].sort((a, b) =>
      String(b.dataPagamento).localeCompare(String(a.dataPagamento))
    )[0];
    const pagamentoRecebido = valorContrato > 0 && totalRecebido >= valorContrato - 0.01;
    const maiorParcelaPaga = pagamentosAluno.reduce(
      (maior, pagamento) => Math.max(maior, Number(pagamento.parcela || 1)),
      0
    );
    const proximaParcela = Math.min(maiorParcelaPaga + 1, totalParcelas);
    const datasProximaParcela =
      aluno.plano === "trimestralParcelado" && !pagamentoRecebido
        ? calcularDatas(aluno.inicio, planos[aluno.plano]?.meses || 1, aluno.plano, proximaParcela)
        : {};
    const vencimentoAtualizado =
      datasProximaParcela.vencimento || aluno.vencimento;

    await atualizarAlunoSupabase(aluno.id, {
      ...aluno,
      ...datasProximaParcela,
      pagamentoRecebido,
      dataPagamento: ultimoPagamento?.dataPagamento || "",
      status: ultimoPagamento
        ? calcularStatus(vencimentoAtualizado, aluno.plano)
        : aluno.status,
    });
  }

  function fecharModalPagamento() {
    setModalPagamento(null);
    setFormPagamento(pagamentoInicial);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroPagamento("todos");
  }

  function enviarAvisoWhatsApp(registro) {
    const telefone = normalizarTelefoneWhatsApp(registro.aluno.whatsapp);
    const mensagem = montarMensagemVencimento(registro);

    if (!telefone) {
      window.prompt(
        "Este aluno nao tem WhatsApp cadastrado. Copie a mensagem abaixo:",
        mensagem
      );
      return;
    }

    window.location.href = `whatsapp://send?phone=${telefone}&text=${encodeURIComponent(
      mensagem
    )}`;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <h1>Financeiro</h1>

        <div style={cardsGrid}>
          <Card titulo="Receita Prevista" valor={formatarMoeda(receitaPrevista)} />
          <Card titulo="Receita Recebida" valor={formatarMoeda(receitaRecebida)} />
          <Card titulo="Receita Pendente" valor={formatarMoeda(receitaPendente)} />
          <Card titulo="Alunos Ativos" valor={alunosAtivos} />
          <Card titulo="Alunos Vencidos" valor={alunosVencidos} destaque="#dc2626" />
        </div>

        <section style={filtrosCard}>
          <div>
            <h2 style={secaoTitulo}>Controle de Pagamentos</h2>
            <p style={secaoLegenda}>
              Registre pagamentos com data, valor, forma e parcela.
            </p>
          </div>

          <div style={filtros}>
            <input
              placeholder="Buscar por aluno"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={campo}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Vencendo">Vencendo</option>
              <option value="Vencendo parcela">Vencendo parcela</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Parcela atrasada">Parcela atrasada</option>
            </select>

            <select
              value={filtroPagamento}
              onChange={(e) => setFiltroPagamento(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os pagamentos</option>
              <option value="recebidos">Recebidos no ciclo</option>
              <option value="pendentes">Pendentes no ciclo</option>
            </select>

            <button onClick={limparFiltros} style={botaoNeutro}>
              Limpar
            </button>
          </div>
        </section>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={header}>Aluno</th>
                <th style={header}>Plano</th>
                <th style={header}>Contrato</th>
                <th style={header}>Parcela atual</th>
                <th style={header}>Valor parcela</th>
                <th style={header}>Recebido</th>
                <th style={header}>Vencimento</th>
                <th style={header}>Status</th>
                <th style={header}>Pagamento</th>
                <th style={header}>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="10">
                    Carregando financeiro...
                  </td>
                </tr>
              )}

              {!carregando &&
                registrosFiltrados.map((registro) => (
                  <tr key={registro.aluno.id}>
                    <td style={celula}>{registro.aluno.nome}</td>
                    <td style={celula}>
                      {planos[registro.aluno.plano]?.nome || "-"}
                    </td>
                    <td style={celula}>{formatarMoeda(registro.valorContrato)}</td>
                    <td style={celula}>
                      {registro.parcelaAtual}/{registro.totalParcelas}
                    </td>
                    <td style={celula}>{formatarMoeda(registro.valorParcela)}</td>
                    <td style={celula}>{formatarMoeda(registro.totalRecebido)}</td>
                    <td style={celula}>{formatarData(registro.aluno.vencimento)}</td>
                    <td style={celula}>
                      <span
                        style={{
                          color: corStatus(registro.aluno.status),
                          fontWeight: "bold",
                        }}
                      >
                        {registro.aluno.status}
                      </span>
                    </td>
                    <td style={celula}>
                      {registro.recebidoNoCiclo
                        ? `Recebido em ${formatarData(
                            registro.pagamentoCiclo?.dataPagamento
                          )}`
                        : "Pendente"}
                    </td>
                    <td style={celula}>
                      <div style={acoes}>
                        {!registro.recebidoNoCiclo ? (
                          <button
                            onClick={() => abrirRegistroPagamento(registro)}
                            style={botaoReceber}
                            disabled={atualizandoId === registro.aluno.id}
                          >
                            Receber
                          </button>
                        ) : (
                          <button
                            onClick={() => desfazerPagamento(registro)}
                            style={botaoNeutro}
                            disabled={atualizandoId === registro.aluno.id}
                          >
                            {atualizandoId === registro.aluno.id
                              ? "Salvando..."
                              : "Desfazer"}
                          </button>
                        )}
                        <button
                          onClick={() => enviarAvisoWhatsApp(registro)}
                          style={botaoWhatsApp}
                        >
                          WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!carregando && registrosFiltrados.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="10">
                    Nenhum aluno encontrado para controle financeiro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalPagamento && (
          <PagamentoModal
            registro={modalPagamento}
            form={formPagamento}
            atualizando={atualizandoId === modalPagamento.aluno.id}
            onChange={setFormPagamento}
            onClose={fecharModalPagamento}
            onSave={registrarPagamento}
          />
        )}
      </div>
    </div>
  );
}

function montarRegistroFinanceiro(aluno, pagamentosAluno) {
  const valorContrato = Number(aluno.valor || 0);
  const totalParcelas = aluno.plano === "trimestralParcelado" ? 3 : 1;
  const parcelaAtual = calcularParcelaAtual(aluno.inicio, totalParcelas);
  const valorParcela = totalParcelas > 1 ? valorContrato / totalParcelas : valorContrato;
  const pagamentosOrdenados = [...pagamentosAluno].sort((a, b) =>
    String(b.dataPagamento).localeCompare(String(a.dataPagamento))
  );
  const pagamentoCiclo = pagamentosOrdenados.find(
    (pagamento) => Number(pagamento.parcela) === parcelaAtual
  );
  const totalRecebido = pagamentosAluno.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );

  return {
    aluno,
    pagamentos: pagamentosAluno,
    valorContrato,
    totalParcelas,
    parcelaAtual,
    valorParcela,
    pagamentoCiclo,
    ultimoPagamento: pagamentosOrdenados[0] || null,
    recebidoNoCiclo: Boolean(pagamentoCiclo),
    totalRecebido,
    valorPendente: Math.max(valorContrato - totalRecebido, 0),
  };
}

function calcularParcelaAtual(inicio, totalParcelas) {
  if (totalParcelas <= 1 || !inicio) return 1;

  const dataInicio = new Date(`${inicio}T00:00:00`);
  const hoje = new Date();
  const diferencaMeses =
    (hoje.getFullYear() - dataInicio.getFullYear()) * 12 +
    hoje.getMonth() -
    dataInicio.getMonth();

  return Math.min(Math.max(diferencaMeses + 1, 1), totalParcelas);
}

function montarMensagemVencimentoWhatsApp(registro) {
  const dataVencimento = formatarData(registro.aluno.vencimento);
  const dias = calcularDiasAte(registro.aluno.vencimento);
  const nomeAluno = registro.aluno.nome || "aluno";

  if (dias < 0) {
    return [
      "Oi, tudo bem? 😊",
      "",
      "Passando para informar que o seu plano de acompanhamento já está vencido.",
      "",
      "Caso tenha interesse em continuar com a assessoria, suporte e atualizações dos treinos, me avise para que possamos dar continuidade ao seu acompanhamento e manter sua evolução da melhor forma possível 💪🏼",
      "",
      "Qualquer dúvida ou necessidade de ajuste, estou à disposição!",
      "",
      "Leandro Souza - Personal Online",
    ].join("\n");
  }

  if (dias === 0) {
    return [
      "🚨 *Vencimento da consultoria hoje*",
      "",
      `Olá, *${nomeAluno}*! Tudo bem? 😊`,
      "",
      `Hoje é a data de vencimento do seu plano de consultoria (*${dataVencimento}*).`,
      "",
      "Para manter seu acompanhamento ativo, atualizações de treino e suporte normalmente, peço que realize o pagamento referente à renovação do plano.",
      "",
      "Qualquer dúvida pode me chamar por aqui. 👊",
      "Obrigado pela confiança no meu trabalho!",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "⏰ *Seu plano vence amanhã*",
      "",
      `Olá, *${nomeAluno}*! Tudo certo? 😊`,
      "",
      `Passando para lembrar que o vencimento do seu plano de consultoria será *amanhã*, dia *${dataVencimento}*.`,
      "",
      "Caso já tenha realizado o pagamento, pode desconsiderar esta mensagem. 🙏",
      "",
      "Se precisar de qualquer suporte ou tiver alguma dúvida, estou à disposição! 👊",
    ].join("\n");
  }

  return [
    "📅 *Lembrete de vencimento da sua consultoria*",
    "",
    `Olá, *${nomeAluno}*! Tudo bem? 😊`,
    "",
    `Passando para lembrar que o vencimento do seu plano de consultoria acontece daqui a *7 dias*, no dia *${dataVencimento}*.`,
    "",
    "Seu acompanhamento continua normalmente com:",
    "✅ Treino personalizado no aplicativo",
    "✅ Ajustes sempre que necessário",
    "✅ Suporte direto comigo",
    "✅ Acompanhamento da sua evolução",
    "",
    "Qualquer dúvida estou à disposição! 👊",
  ].join("\n");
}

function montarMensagemVencimento(registro) {
  if (registro) return montarMensagemVencimentoWhatsApp(registro);

  const dataVencimento = formatarData(registro.aluno.vencimento);
  const dias = calcularDiasAte(registro.aluno.vencimento);
  const tipoCobranca =
    registro.totalParcelas > 1 ? "próxima parcela da sua assessoria" : "seu plano";

  if (dias === 0) {
    return [
      "Olá, tudo bem?",
      "",
      `Passando para lembrar que ${tipoCobranca} vence hoje, dia ${dataVencimento}.`,
      "",
      "Qualquer dúvida estou à disposição. 💪🏽",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "Olá, tudo bem?",
      "",
      `Passando para lembrar que ${tipoCobranca} vence amanhã, dia ${dataVencimento}.`,
      "",
      "Qualquer dúvida estou à disposição. 💪🏽",
    ].join("\n");
  }

  return [
    "Olá, tudo bem?",
    "",
    `Passando para lembrar que ${tipoCobranca} vence no dia ${dataVencimento}.`,
    "",
    "Qualquer dúvida estou à disposição. 💪🏽",
  ].join("\n");
}

function calcularDiasAte(data) {
  if (!data) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const alvo = new Date(`${data}T00:00:00`);

  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
}

function normalizarTelefoneWhatsApp(telefone) {
  const digitos = String(telefone || "").replace(/\D/g, "");
  const semZeroInicial = digitos.replace(/^0+/, "");

  if (!semZeroInicial) return "";
  if (semZeroInicial.startsWith("55")) return semZeroInicial;

  return `55${semZeroInicial}`;
}

function Card({ titulo, valor, destaque }) {
  return (
    <div style={card}>
      <h3>{titulo}</h3>
      <p style={{ ...numeroCard, color: destaque || "#111827" }}>{valor}</p>
    </div>
  );
}

function PagamentoModal({ registro, form, atualizando, onChange, onClose, onSave }) {
  function atualizar(campo, valor) {
    onChange({ ...form, [campo]: valor });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={modalTitulo}>Registrar pagamento</h2>
            <p style={secaoLegenda}>
              {registro.aluno.nome} - parcela {form.parcela}/{form.totalParcelas}
            </p>
          </div>
          <button onClick={onClose} style={botaoNeutro}>
            Fechar
          </button>
        </div>

        <div style={modalGrid}>
          <label style={campoGrupo}>
            <span style={labelCampo}>Data do pagamento</span>
            <input
              type="date"
              value={form.dataPagamento}
              onChange={(e) => atualizar("dataPagamento", e.target.value)}
              style={campo}
            />
          </label>

          <label style={campoGrupo}>
            <span style={labelCampo}>Valor recebido</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => atualizar("valor", e.target.value)}
              style={campo}
            />
          </label>

          <label style={campoGrupo}>
            <span style={labelCampo}>Forma de pagamento</span>
            <select
              value={form.formaPagamento}
              onChange={(e) => atualizar("formaPagamento", e.target.value)}
              style={campo}
            >
              <option value="Pix">Pix</option>
              <option value="Cartao">Cartao</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Boleto">Boleto</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label style={campoGrupo}>
            <span style={labelCampo}>Parcela</span>
            <input
              type="number"
              min="1"
              max={form.totalParcelas}
              value={form.parcela}
              onChange={(e) => atualizar("parcela", e.target.value)}
              style={campo}
            />
          </label>

          <label style={{ ...campoGrupo, gridColumn: "1 / -1" }}>
            <span style={labelCampo}>Observacoes</span>
            <textarea
              rows="3"
              value={form.observacoes}
              onChange={(e) => atualizar("observacoes", e.target.value)}
              style={{ ...campo, minHeight: "80px", resize: "vertical" }}
            />
          </label>
        </div>

        <div style={rodapeModal}>
          <button onClick={onClose} style={botaoNeutro}>
            Cancelar
          </button>
          <button onClick={onSave} style={botaoReceber} disabled={atualizando}>
            {atualizando ? "Salvando..." : "Salvar pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "20px",
  marginTop: "25px",
};

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const numeroCard = {
  fontSize: "24px",
  fontWeight: "700",
  marginTop: "10px",
};

const filtrosCard = {
  ...card,
  marginTop: "30px",
};

const secaoTitulo = {
  margin: 0,
  fontSize: "22px",
};

const secaoLegenda = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const filtros = {
  display: "grid",
  gridTemplateColumns:
    "minmax(220px, 1fr) minmax(170px, 220px) minmax(180px, 220px) auto",
  gap: "10px",
  marginTop: "18px",
};

const campoGrupo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelCampo = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
};

const campo = {
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
};

const linhaCabecalho = {
  background: "#111827",
  color: "#fff",
};

const header = {
  padding: "12px",
  textAlign: "left",
};

const celula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const estadoVazio = {
  ...celula,
  color: "#6b7280",
  textAlign: "center",
};

const acoes = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const botaoReceber = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const botaoWhatsApp = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const botaoNeutro = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
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

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(17, 24, 39, 0.55)",
};

const modal = {
  width: "min(620px, 100%)",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

const modalTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
};

const modalTitulo = {
  margin: 0,
  fontSize: "22px",
};

const modalGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
  marginTop: "20px",
};

const rodapeModal = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "22px",
};

export default Financeiro;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import {
  adicionarAlunoSupabase,
  atualizarAlunoSupabase,
  buscarAlunosSupabase,
  excluirAlunoSupabase,
} from "../../../services/alunosService";
import { buscarPlanosSupabase } from "../../../services/planosService";
import {
  abrirWhatsApp,
  gerarMensagemCheckinSemanal,
} from "../../../services/whatsappService";
import { buscarTreinosPorAlunoSupabase } from "../../../services/treinosService";
import { buscarHistoricoExecucaoAluno } from "../../../services/workoutExecutionService";
import { buscarAvaliacoesPorAlunoSupabase } from "../../../services/avaliacoesService";
import {
  buscarPagamentosPorAluno,
  buscarPagamentosSupabase,
  montarResumoFinanceiroAluno,
} from "../../../services/pagamentosService";
import {
  buscarContratosAlunosSupabase,
  buscarContratosAlunoSupabase,
} from "../../../services/alunoContratosService";
import {
  activateStudentAccess,
  inviteStudentAccess,
  reactivateStudentAccess,
  revokeStudentAccess,
  suspendStudentAccess,
} from "../../../services/studentAccessService";
import {
  calcularDatas,
  calcularStatus,
  formatarNomePlano,
  normalizarAluno,
  ordenarPorVencimento,
} from "../../../data/alunosUtils";
import {
  limparQueryFiltrosAlunos,
  montarQueryAlunos,
  normalizarFiltrosAlunosDaUrl,
} from "../utils/alunosQueryParams";
import { validarCadastroAluno } from "../utils/alunosCadastroValidacoes";
import {
  montarUrlContextualAluno,
} from "../utils/alunosContextNavigation";
import {
  filtrarPagamentosContratoAtual,
  montarAtencaoCobranca,
  statusCombinaAtencaoCobranca,
} from "../../financeiro/utils/billingAttention";

export const formInicial = {
  id: "",
  nome: "",
  whatsapp: "",
  nascimento: "",
  inicio: "",
  vencimento: "",
  aviso7: "",
  aviso1: "",
  plano: "",
  valor: "",
  status: "Ativo",
  pagamentoRecebido: false,
  dataPagamento: "",
  observacoes: "",
};

export function useAlunosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [alunos, setAlunos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState("");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [resumoOperacional, setResumoOperacional] = useState(criarResumoInicial());
  const [salvando, setSalvando] = useState(false);
  const toast = useToast();
  const { confirmar } = useConfirm();

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, planosSupabase, pagamentosSupabase, contratosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarPlanosSupabase(),
          buscarPagamentosSupabase(),
          buscarContratosAlunosSupabase(),
        ]);
        setAlunos(alunosSupabase.map(normalizarAluno));
        setPlanos(planosSupabase);
        setPagamentos(pagamentosSupabase);
        setContratos(contratosSupabase);
      } catch (error) {
        setErro(`Erro ao buscar dados: ${error.message}`);
        setAlunos([]);
        setPlanos([]);
        setPagamentos([]);
        setContratos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const planosAtivos = useMemo(
    () => planos.filter((plano) => plano.ativo),
    [planos]
  );

  const filtrosUrl = useMemo(
    () => normalizarFiltrosAlunosDaUrl(searchParams, planos),
    [planos, searchParams]
  );

  const busca = filtrosUrl.busca;
  const filtroStatus = filtrosUrl.status;
  const filtroPlano = filtrosUrl.plano;

  const planosPorId = useMemo(
    () => new Map(planos.map((plano) => [plano.id, plano])),
    [planos]
  );

  const pagamentosPorAluno = useMemo(() => {
    const mapa = new Map();

    pagamentos.forEach((pagamento) => {
      const pagamentosAluno = mapa.get(pagamento.alunoId) || [];
      pagamentosAluno.push(pagamento);
      mapa.set(pagamento.alunoId, pagamentosAluno);
    });

    return mapa;
  }, [pagamentos]);

  const alunosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return ordenarPorVencimento(
      alunos
        .map(normalizarAluno)
        .map((aluno) => ({
          ...aluno,
          atencaoCobranca: montarAtencaoCobranca({
            aluno,
            plano: planosPorId.get(aluno.plano),
            pagamentos: filtrarPagamentosContratoAtual(
              aluno,
              pagamentosPorAluno.get(aluno.id) || []
            ),
          }),
        }))
        .filter((aluno) => {
          const combinaNome = aluno.nome.toLowerCase().includes(termoBusca);
          const combinaStatus = statusCombinaAtencaoCobranca(filtroStatus, aluno.atencaoCobranca);
          const combinaPlano =
            filtroPlano === "todos" || aluno.plano === filtroPlano;

          return combinaNome && combinaStatus && combinaPlano;
        })
    );
  }, [alunos, busca, filtroPlano, filtroStatus, pagamentosPorAluno, planosPorId]);

  const alunoSelecionado = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .find((aluno) => aluno.id === alunoSelecionadoId),
    [alunos, alunoSelecionadoId]
  );

  const alunoContextUrls = useMemo(() => {
    if (!alunoSelecionado?.id) return { treinos: "", avaliacoes: "", financeiro: "" };
    return {
      treinos: montarUrlContextualAluno("treinos", alunoSelecionado.id, searchParams),
      avaliacoes: montarUrlContextualAluno("avaliacoes", alunoSelecionado.id, searchParams),
      financeiro: montarUrlContextualAluno("financeiro", alunoSelecionado.id, searchParams),
    };
  }, [alunoSelecionado, searchParams]);

  const carregarResumoOperacional = useCallback(async function carregarResumoOperacional() {
    if (!alunoSelecionado?.id) {
      setResumoOperacional(criarResumoInicial());
      return;
    }

    setResumoOperacional(criarResumoCarregando());
    const plano = planos.find((item) => item.id === alunoSelecionado.plano) || null;

    const [treinos, avaliacoes, pagamentos, contratos, execucoes] = await Promise.allSettled([
      executarResumoComFalhaControlada("treinos", () =>
        buscarTreinosPorAlunoSupabase(alunoSelecionado.id)
      ),
      executarResumoComFalhaControlada("avaliacoes", () =>
        buscarAvaliacoesPorAlunoSupabase(alunoSelecionado.id)
      ),
      executarResumoComFalhaControlada("financeiro", () =>
        buscarPagamentosPorAluno(alunoSelecionado.id)
      ),
      executarResumoComFalhaControlada("financeiro", () =>
        buscarContratosAlunoSupabase(alunoSelecionado.id)
      ),
      executarResumoComFalhaControlada("treinos", () =>
        buscarHistoricoExecucaoAluno(alunoSelecionado.id, 5)
      ),
    ]);

    setResumoOperacional({
      treinos: normalizarResultadoResumo(treinos),
      avaliacoes: normalizarResultadoResumo(avaliacoes),
      execucoes: normalizarResultadoResumo(execucoes),
      financeiro:
        pagamentos.status === "fulfilled"
          ? {
              status: "success",
              data: montarResumoFinanceiroAluno(
                alunoSelecionado,
                pagamentos.value,
                plano,
                contratos.status === "fulfilled" ? contratos.value : []
              ),
            }
          : { status: "error", error: pagamentos.reason?.message || "Erro ao carregar financeiro." },
    });
  }, [alunoSelecionado, planos]);

  useEffect(() => {
    const carregamentoResumo = window.setTimeout(() => {
      carregarResumoOperacional();
    }, 0);

    return () => window.clearTimeout(carregamentoResumo);
  }, [carregarResumoOperacional]);

  function atualizarForm(campo, valor) {
    if (formErrors[campo]) {
      setFormErrors((errosAtuais) => ({ ...errosAtuais, [campo]: "" }));
    }
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function handlePlano(e) {
    const planoSelecionado = e.target.value;
    const plano = planos.find((item) => item.id === planoSelecionado);
    if (formErrors.plano) {
      setFormErrors((errosAtuais) => ({ ...errosAtuais, plano: "" }));
    }

    if (!plano) {
      setForm({
        ...form,
        plano: "",
        valor: "",
        vencimento: "",
        aviso7: "",
        aviso1: "",
      });
      return;
    }

    const datas = calcularDatas(
      form.inicio,
      plano.duracaoMeses,
      planoSelecionado
    );

    setForm({
      ...form,
      plano: planoSelecionado,
      valor: plano.valor,
      ...datas,
    });
  }

  function handleInicio(e) {
    const inicio = e.target.value;
    if (formErrors.inicio) {
      setFormErrors((errosAtuais) => ({ ...errosAtuais, inicio: "" }));
    }

    if (!form.plano) {
      setForm({
        ...form,
        inicio,
      });
      return;
    }

    const plano = planos.find((item) => item.id === form.plano);
    const datas = calcularDatas(inicio, plano?.duracaoMeses || 1, form.plano);

    setForm({
      ...form,
      inicio,
      ...datas,
    });
  }

  function handleWhatsApp(e) {
    if (formErrors.whatsapp) {
      setFormErrors((errosAtuais) => ({ ...errosAtuais, whatsapp: "" }));
    }
    setForm({ ...form, whatsapp: formatarWhatsApp(e.target.value) });
  }

  function abrirCadastro() {
    setForm(formInicial);
    setFormErrors({});
    setAlunoEditandoId("");
    setModalCadastroAberto(true);
  }

  function abrirEdicao(aluno) {
    setForm({
      ...formInicial,
      ...normalizarAluno(aluno),
    });
    setFormErrors({});
    setAlunoEditandoId(aluno.id);
    setModalCadastroAberto(true);
  }

  function fecharModal() {
    setModalCadastroAberto(false);
    setForm(formInicial);
    setFormErrors({});
    setAlunoEditandoId("");
  }

  async function salvarAluno() {
    const erros = validarCadastroAluno(form, alunos, alunoEditandoId);
    if (Object.values(erros).some(Boolean)) {
      setFormErrors(erros);
      setValidationAttempt((valor) => valor + 1);
      toast.aviso("Revise os campos", "Corrija os dados destacados antes de salvar.");
      return;
    }

    if (!form.nome.trim()) {
      toast.aviso("Nome obrigatório", "Informe o nome do aluno.");
      return;
    }

    if (!form.whatsapp.trim()) {
      toast.aviso("WhatsApp obrigatório", "Informe o WhatsApp do aluno.");
      return;
    }

    if (!form.plano || !form.inicio) {
      toast.aviso("Plano incompleto", "Informe o início e o plano do aluno.");
      return;
    }

    setSalvando(true);
    setErro("");

    const alunoNormalizado = normalizarAluno({
      ...form,
      nome: form.nome.trim(),
      whatsapp: formatarWhatsApp(form.whatsapp),
      status: calcularStatus(form.vencimento, form.plano),
    });

    try {
      const alunoSalvo = alunoEditandoId
        ? await atualizarAlunoSupabase(alunoEditandoId, alunoNormalizado)
        : await adicionarAlunoSupabase(alunoNormalizado);
      const alunoSalvoNormalizado = normalizarAluno(alunoSalvo);

      setAlunos((alunosAtuais) => {
        if (alunoEditandoId) {
          return alunosAtuais.map((aluno) =>
            aluno.id === alunoEditandoId ? alunoSalvoNormalizado : aluno
          );
        }

        return [...alunosAtuais, alunoSalvoNormalizado];
      });

      toast.sucesso(
        alunoEditandoId ? "Aluno atualizado" : "Aluno cadastrado",
        alunoEditandoId
          ? "Os dados do aluno foram atualizados com sucesso."
          : "O novo aluno foi cadastrado com sucesso."
      );
      setAlunoSelecionadoId(alunoSalvoNormalizado.id);
      fecharModal();
    } catch (error) {
      console.error(error);
      setErro(`Erro ao salvar aluno: ${error.message}`);
      toast.erro("Não foi possível salvar o aluno", "Tente novamente em alguns instantes.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAluno(id) {
    const confirmado = await confirmar({
      titulo: "Excluir aluno?",
      descricao: "Esta ação remove o cadastro do aluno. Deseja continuar?",
      textoConfirmar: "Excluir",
    });

    if (!confirmado) return;

    setErro("");

    try {
      await excluirAlunoSupabase(id);

      if (alunoSelecionadoId === id) {
        setAlunoSelecionadoId("");
      }

      setAlunos((alunosAtuais) =>
        alunosAtuais.filter((aluno) => aluno.id !== id)
      );
      toast.sucesso("Aluno excluído", "O cadastro foi removido com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao excluir aluno: ${error.message}`);
      toast.erro("Não foi possível excluir o aluno", "Tente novamente em alguns instantes.");
    }
  }

  function limparFiltros() {
    setSearchParams(limparQueryFiltrosAlunos(searchParams), { replace: true });
  }

  function atualizarFiltrosUrl(proximosFiltros, options = {}) {
    setSearchParams(
      montarQueryAlunos(searchParams, {
        busca,
        status: filtroStatus,
        plano: filtroPlano,
        ...proximosFiltros,
      }),
      { replace: Boolean(options.replace) }
    );
  }

  function setBusca(valor) {
    atualizarFiltrosUrl({ busca: valor }, { replace: true });
  }

  function setFiltroStatus(valor) {
    atualizarFiltrosUrl({ status: valor });
  }

  function setFiltroPlano(valor) {
    atualizarFiltrosUrl({ plano: valor });
  }

  function nomePlano(plano) {
    return planos.find((item) => item.id === plano)?.nome || formatarNomePlano(plano);
  }

  function enviarCheckinSemanal(aluno) {
    abrirWhatsApp(aluno.whatsapp, gerarMensagemCheckinSemanal(aluno));
  }

  function atualizarAcessoAluno(alunoId, acesso) {
    setAlunos((alunosAtuais) =>
      alunosAtuais.map((aluno) =>
        aluno.id === alunoId
          ? {
              ...aluno,
              studentAccessStatus: acesso.status,
              studentAccessEmail: acesso.email,
              studentAccessInvitedAt: acesso.invitedAt,
              studentAccessActivatedAt: acesso.activatedAt,
              studentAccessSuspendedAt: acesso.suspendedAt,
              studentAccessRevokedAt: acesso.revokedAt,
              studentAccessReason: acesso.reason,
            }
          : aluno
      )
    );
  }

  async function liberarAcessoAluno(aluno, email) {
    try {
      const acesso = aluno.studentAccessStatus === "invited"
        ? await activateStudentAccess(aluno.id, email)
        : await inviteStudentAccess(aluno.id, email);
      atualizarAcessoAluno(aluno.id, acesso);
      toast.sucesso("Acesso liberado.", "O aluno pode acessar a area do aluno.");
    } catch (error) {
      toast.erro("Não foi possível atualizar o acesso agora.", error.message);
    }
  }

  async function suspenderAcessoAluno(aluno) {
    const confirmado = await confirmar({
      titulo: "Suspender acesso deste aluno?",
      descricao: "O aluno deixara de ver a area do aluno ate uma nova reativacao.",
      textoConfirmar: "Suspender acesso",
    });
    if (!confirmado) return;

    try {
      const acesso = await suspendStudentAccess(aluno.id);
      atualizarAcessoAluno(aluno.id, acesso);
      toast.sucesso("Acesso suspenso.", "O acesso do aluno foi suspenso.");
    } catch (error) {
      toast.erro("Não foi possível atualizar o acesso agora.", error.message);
    }
  }

  async function reativarAcessoAluno(aluno) {
    try {
      const acesso = await reactivateStudentAccess(aluno.id);
      atualizarAcessoAluno(aluno.id, acesso);
      toast.sucesso("Acesso reativado.", "O aluno pode acessar a area do aluno novamente.");
    } catch (error) {
      toast.erro("Não foi possível atualizar o acesso agora.", error.message);
    }
  }

  async function revogarAcessoAluno(aluno) {
    const confirmado = await confirmar({
      titulo: "Revogar acesso deste aluno?",
      descricao: "O historico sera preservado, mas o aluno nao podera acessar a area do aluno.",
      textoConfirmar: "Revogar acesso",
    });
    if (!confirmado) return;

    try {
      const acesso = await revokeStudentAccess(aluno.id);
      atualizarAcessoAluno(aluno.id, acesso);
      toast.sucesso("Acesso revogado.", "O acesso do aluno foi revogado.");
    } catch (error) {
      toast.erro("Não foi possível atualizar o acesso agora.", error.message);
    }
  }

  return {
    alunos,
    alunoEditandoId,
    alunoContextUrls,
    alunoSelecionado,
    alunoSelecionadoId,
    alunosFiltrados,
    abrirCadastro,
    abrirEdicao,
    busca,
    carregando,
    erro,
    excluirAluno,
    fecharModal,
    filtroPlano,
    filtroStatus,
    form,
    formErrors,
    handleInicio,
    handlePlano,
    handleWhatsApp,
    limparFiltros,
    modalCadastroAberto,
    nomePlano,
    planos,
    planosAtivos,
    recarregarResumoOperacional: carregarResumoOperacional,
    resumoOperacional,
    contratos,
    salvarAluno,
    salvando,
    enviarCheckinSemanal,
    liberarAcessoAluno,
    reativarAcessoAluno,
    revogarAcessoAluno,
    suspenderAcessoAluno,
    setAlunoSelecionadoId,
    setBusca,
    setFiltroPlano,
    setFiltroStatus,
    setModalCadastroAberto,
    atualizarForm,
    validationAttempt,
  };
}

function formatarWhatsApp(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;

  const ddd = numeros.slice(0, 2);
  const numero = numeros.slice(2);

  if (numero.length <= 5) {
    return `(${ddd}) ${numero}`;
  }

  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
}

function criarResumoInicial() {
  return {
    treinos: { status: "idle", data: [] },
    execucoes: { status: "idle", data: [] },
    avaliacoes: { status: "idle", data: [] },
    financeiro: { status: "idle", data: null },
  };
}

function criarResumoCarregando() {
  return {
    treinos: { status: "loading", data: [] },
    execucoes: { status: "loading", data: [] },
    avaliacoes: { status: "loading", data: [] },
    financeiro: { status: "loading", data: null },
  };
}

function normalizarResultadoResumo(resultado) {
  if (resultado.status === "fulfilled") {
    return { status: "success", data: resultado.value };
  }

  return {
    status: "error",
    error: resultado.reason?.message || "Erro ao carregar resumo.",
  };
}

function executarResumoComFalhaControlada(tipo, executar) {
  if (typeof window !== "undefined") {
    const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const falha = window.localStorage?.getItem("ARUKA_QA_ALUNOS_SUMMARY_FAIL");
    if (local && (falha === tipo || falha === "all")) {
      return Promise.reject(new Error("Falha controlada LOCAL_QA no resumo da ficha."));
    }
  }

  return executar();
}

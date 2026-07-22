import { useEffect, useMemo, useState } from "react";
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
  const [form, setForm] = useState(formInicial);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState("");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const toast = useToast();
  const { confirmar } = useConfirm();

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, planosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarPlanosSupabase(),
        ]);
        setAlunos(alunosSupabase.map(normalizarAluno));
        setPlanos(planosSupabase);
      } catch (error) {
        setErro(`Erro ao buscar dados: ${error.message}`);
        setAlunos([]);
        setPlanos([]);
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

  const alunosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return ordenarPorVencimento(
      alunos
        .map(normalizarAluno)
        .filter((aluno) => {
          const combinaNome = aluno.nome.toLowerCase().includes(termoBusca);
          const combinaStatus =
            filtroStatus === "todos" || aluno.status === filtroStatus;
          const combinaPlano =
            filtroPlano === "todos" || aluno.plano === filtroPlano;

          return combinaNome && combinaStatus && combinaPlano;
        })
    );
  }, [alunos, busca, filtroPlano, filtroStatus]);

  const alunoSelecionado = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .find((aluno) => aluno.id === alunoSelecionadoId),
    [alunos, alunoSelecionadoId]
  );

  function atualizarForm(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function handlePlano(e) {
    const planoSelecionado = e.target.value;
    const plano = planos.find((item) => item.id === planoSelecionado);

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
    setForm({ ...form, whatsapp: formatarWhatsApp(e.target.value) });
  }

  function abrirCadastro() {
    setForm(formInicial);
    setAlunoEditandoId("");
    setModalCadastroAberto(true);
  }

  function abrirEdicao(aluno) {
    setForm({
      ...formInicial,
      ...normalizarAluno(aluno),
    });
    setAlunoEditandoId(aluno.id);
    setModalCadastroAberto(true);
  }

  function fecharModal() {
    setModalCadastroAberto(false);
    setForm(formInicial);
    setAlunoEditandoId("");
  }

  async function salvarAluno() {
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

  return {
    alunos,
    alunoEditandoId,
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
    handleInicio,
    handlePlano,
    handleWhatsApp,
    limparFiltros,
    modalCadastroAberto,
    nomePlano,
    planos,
    planosAtivos,
    salvarAluno,
    salvando,
    enviarCheckinSemanal,
    setAlunoSelecionadoId,
    setBusca,
    setFiltroPlano,
    setFiltroStatus,
    setModalCadastroAberto,
    atualizarForm,
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

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  arquivarExercicioPessoalSupabase,
  atualizarExercicioPessoalSupabase,
  buscarBibliotecaExerciciosSupabase,
  criarExercicioPessoalSupabase,
  criarFormularioExercicioBiblioteca,
  criarOpcoesBibliotecaExercicios,
  filtrarExerciciosBiblioteca,
  validarFormularioExercicioBiblioteca,
} from "../../../services/exerciseLibraryService";
import { parseYouTubeMediaInput } from "../utils/youtubeMedia";

const FILTROS_INICIAIS = {
  busca: "",
  origem: "todos",
  grupoMuscular: "todos",
  midia: "todos",
};

export function useExerciseLibraryPage() {
  const [exercicios, setExercicios] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [retryEmAndamento, setRetryEmAndamento] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [exercicioEditando, setExercicioEditando] = useState(null);
  const [formulario, setFormulario] = useState(() => criarFormularioExercicioBiblioteca());
  const [errosFormulario, setErrosFormulario] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [arquivandoId, setArquivandoId] = useState("");
  const [mensagem, setMensagem] = useState(null);

  const carregarExercicios = useCallback(async function carregarExercicios(options = {}) {
    if (!options.silencioso) setCarregando(true);
    setErro(null);

    try {
      const proximos = await buscarBibliotecaExerciciosSupabase();
      setExercicios(proximos);
      return proximos;
    } catch (error) {
      console.error(error);
      setErro({
        title: "Não foi possível carregar a biblioteca",
        description: "Tente novamente em instantes.",
        retryable: true,
      });
      return [];
    } finally {
      if (!options.silencioso) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      carregarExercicios();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [carregarExercicios]);

  const exerciciosFiltrados = useMemo(
    () => filtrarExerciciosBiblioteca(exercicios, filtros),
    [exercicios, filtros]
  );

  const opcoesFiltro = useMemo(
    () => criarOpcoesBibliotecaExercicios(exercicios),
    [exercicios]
  );
  const youtubePreview = useMemo(
    () => parseYouTubeMediaInput(formulario.youtubeInput),
    [formulario.youtubeInput]
  );

  function atualizarFiltro(nome, valor) {
    setFiltros((atuais) => ({ ...atuais, [nome]: valor }));
  }

  function limparFiltros() {
    setFiltros(FILTROS_INICIAIS);
  }

  function abrirCriacao() {
    setExercicioEditando(null);
    setFormulario(criarFormularioExercicioBiblioteca());
    setErrosFormulario({});
    setMensagem(null);
    setModalAberto(true);
  }

  function abrirEdicao(exercicio) {
    if (exercicio?.origem !== "personal") return;

    setExercicioEditando(exercicio);
    setFormulario(criarFormularioExercicioBiblioteca(exercicio));
    setErrosFormulario({});
    setMensagem(null);
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    resetarModal();
  }

  function resetarModal() {
    setModalAberto(false);
    setExercicioEditando(null);
    setFormulario(criarFormularioExercicioBiblioteca());
    setErrosFormulario({});
  }

  function atualizarFormulario(nome, valor) {
    setFormulario((atual) => ({ ...atual, [nome]: valor }));
    setErrosFormulario((atuais) => {
      if (!atuais[nome]) return atuais;
      const restante = { ...atuais };
      delete restante[nome];
      return restante;
    });
  }

  async function salvarExercicio(event) {
    event?.preventDefault();
    if (salvando) return false;

    const validacao = validarFormularioExercicioBiblioteca(formulario);
    if (!validacao.valido) {
      setErrosFormulario(validacao.erros);
      return false;
    }

    setSalvando(true);
    setMensagem(null);

    try {
      const salvo = exercicioEditando
        ? await atualizarExercicioPessoalSupabase(exercicioEditando.id, formulario)
        : await criarExercicioPessoalSupabase(formulario);

      setExercicios((atuais) => {
        if (exercicioEditando) {
          return atuais.map((item) => (item.id === salvo.id ? salvo : item));
        }
        return [salvo, ...atuais];
      });
      setMensagem({
        type: "success",
        text: exercicioEditando ? "Exercício atualizado." : "Exercício criado.",
      });
      resetarModal();
      return true;
    } catch (error) {
      console.error(error);
      if (error.validationErrors) setErrosFormulario(error.validationErrors);
      setMensagem({
        type: "error",
        text: error?.message || "Não foi possível salvar o exercício pessoal.",
      });
      return false;
    } finally {
      setSalvando(false);
    }
  }

  async function arquivarExercicio(exercicio) {
    if (!exercicio?.id || exercicio.origem !== "personal" || arquivandoId) return false;

    setArquivandoId(exercicio.id);
    setMensagem(null);

    try {
      await arquivarExercicioPessoalSupabase(exercicio.id);
      setExercicios((atuais) => atuais.filter((item) => item.id !== exercicio.id));
      setMensagem({ type: "success", text: "Exercício arquivado." });
      return true;
    } catch (error) {
      console.error(error);
      setMensagem({
        type: "error",
        text: error?.message || "Não foi possível arquivar o exercício.",
      });
      return false;
    } finally {
      setArquivandoId("");
    }
  }

  async function tentarNovamente() {
    if (retryEmAndamento || carregando) return;

    setRetryEmAndamento(true);
    try {
      await carregarExercicios({ silencioso: exercicios.length > 0 });
    } finally {
      setRetryEmAndamento(false);
    }
  }

  return {
    carregando,
    erro,
    exercicios,
    exerciciosFiltrados,
    filtros,
    formulario,
    errosFormulario,
    modalAberto,
    exercicioEditando,
    mensagem,
    opcoesFiltro,
    youtubePreview,
    arquivandoId,
    retryEmAndamento,
    salvando,
    abrirCriacao,
    abrirEdicao,
    fecharModal,
    atualizarFormulario,
    atualizarFiltro,
    arquivarExercicio,
    limparFiltros,
    salvarExercicio,
    tentarNovamente,
  };
}

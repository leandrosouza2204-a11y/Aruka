import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buscarBibliotecaExerciciosSupabase,
  criarOpcoesBibliotecaExercicios,
  filtrarExerciciosBiblioteca,
} from "../../../services/exerciseLibraryService";

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
        title: "Nao foi possivel carregar a biblioteca",
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

  function atualizarFiltro(nome, valor) {
    setFiltros((atuais) => ({ ...atuais, [nome]: valor }));
  }

  function limparFiltros() {
    setFiltros(FILTROS_INICIAIS);
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
    opcoesFiltro,
    retryEmAndamento,
    atualizarFiltro,
    limparFiltros,
    tentarNovamente,
  };
}

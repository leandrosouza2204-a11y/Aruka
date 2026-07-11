import { useEffect, useState } from "react";

import { listarEventosAcompanhamento } from "../../../services/acompanhamentoEventosService";

export function useHistoricoAcompanhamento({ userId, alunoId } = {}) {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarHistorico() {
      if (!userId || !alunoId) {
        setEventos([]);
        setErro("");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro("");

      try {
        const dados = await listarEventosAcompanhamento({ userId, alunoId });

        if (!ativo) return;

        setEventos(dados);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao carregar histórico de acompanhamento do aluno:", {
          userId,
          alunoId,
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
        });
        setEventos([]);
        setErro("Não foi possível carregar o histórico do acompanhamento.");
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarHistorico();

    return () => {
      ativo = false;
    };
  }, [userId, alunoId]);

  return {
    eventos,
    carregando,
    erro,
  };
}

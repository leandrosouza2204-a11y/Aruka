import { dataOuNull } from "../data/formatters";
import { workoutToPersistencePayload } from "../features/treinos/utils/workoutDataContract.js";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarTreinosSupabase() {
  falharTreinosLocalQa("load");
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("treinos")
    .select(
      `
        *,
        aluno:alunos(id, nome, whatsapp),
        dias:treino_dias(
          *,
          exercicios:treino_exercicios(*)
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaTreino);
}

export async function buscarTreinosPorAlunoSupabase(alunoId) {
  falharTreinosLocalQa("load");
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("treinos")
    .select(
      `
        *,
        aluno:alunos(id, nome, whatsapp),
        dias:treino_dias(
          *,
          exercicios:treino_exercicios(*)
        )
      `
    )
    .eq("user_id", user.id)
    .eq("aluno_id", alunoId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaTreino);
}

export async function buscarTreinoPorIdSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("treinos")
    .select(
      `
        *,
        aluno:alunos(id, nome, whatsapp),
        dias:treino_dias(
          *,
          exercicios:treino_exercicios(*)
        )
      `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  return rowParaTreino(data);
}

export async function adicionarTreinoSupabase(treino) {
  falharTreinosLocalQa("duplicate");
  await buscarUsuarioLogado();

  const { data, error } = await supabase.rpc("salvar_treino_composto", {
    p_treino: workoutToPersistencePayload(treino),
  });
  if (error) throw error;

  return buscarTreinoPorIdSupabase(data.id);
}

export async function atualizarTreinoSupabase(id, treino) {
  await buscarUsuarioLogado();

  const { data, error } = await supabase.rpc("salvar_treino_composto", {
    p_treino: workoutToPersistencePayload({ ...treino, id }),
  });
  if (error) throw error;

  return buscarTreinoPorIdSupabase(data.id);
}

export async function excluirTreinoSupabase(id) {
  falharTreinosLocalQa("delete");
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("treinos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return id;
}

function rowParaTreino(row) {
  const dias = ordenarPorOrdem(row.dias || row.treino_dias || []).map((dia) => ({
    id: dia.id,
    nome: dia.nome || "",
    descricao: dia.grupo_muscular || "",
    exercicios: ordenarPorOrdem(dia.exercicios || dia.treino_exercicios || []).map(
      (exercicio) => ({
        id: exercicio.id,
        nome: exercicio.nome || "",
        series: exercicio.series || "",
        repeticoes: exercicio.repeticoes || "",
        carga: exercicio.carga || "",
        descanso: exercicio.descanso || "",
        observacoes: exercicio.observacoes || "",
        video: exercicio.video_url || "",
      })
    ),
  }));

  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    aluno: row.aluno?.nome || "",
    alunoWhatsapp: row.aluno?.whatsapp || "",
    rotina: row.nome_rotina || "",
    objetivo: row.objetivo || "",
    nivel: row.nivel || "",
    diasPorSemana: row.dias_semana || "",
    observacoes: row.observacoes || "",
    status: row.status || "Ativo",
    dataInicio: row.data_inicio || "",
    dataRevisao: row.data_revisao || "",
    createdAt: row.created_at || "",
    dias,
  };
}

export function treinoParaPayload(treino, userId) {
  return {
    user_id: userId,
    aluno_id: treino.alunoId,
    nome_rotina: treino.rotina || "",
    objetivo: treino.objetivo || "",
    nivel: treino.nivel || "",
    dias_semana: Number(treino.diasPorSemana || treino.dias?.length || 0),
    observacoes: treino.observacoes || "",
    status: treino.status || "Ativo",
    data_inicio: dataOuNull(treino.dataInicio),
    data_revisao: dataOuNull(treino.dataRevisao),
  };
}

function ordenarPorOrdem(lista) {
  return [...lista].sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
}

function falharTreinosLocalQa(tipo) {
  if (typeof window === "undefined") return;
  if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
  if (window.localStorage?.getItem("ARUKA_QA_TREINOS_FAIL") !== tipo) return;
  throw new Error("Falha controlada LOCAL_QA no modulo Treinos.");
}

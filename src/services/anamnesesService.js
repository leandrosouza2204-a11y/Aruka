import { supabase } from "./supabase";

export async function buscarAnamnesesSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("anamneses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaAnamnese);
}

export async function adicionarAnamneseSupabase(anamnese) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("anamneses")
    .insert(anamneseParaPayload(anamnese, user.id))
    .select()
    .single();

  if (error) throw error;

  return rowParaAnamnese(data);
}

export async function atualizarAnamneseSupabase(id, anamnese) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("anamneses")
    .update(anamneseParaPayload(anamnese, user.id))
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return rowParaAnamnese(data);
}

export async function excluirAnamneseSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("anamneses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return id;
}

async function buscarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user;
}

function anamneseParaPayload(anamnese, userId) {
  return {
    user_id: userId,
    aluno_id: anamnese.alunoId,
    profissao: anamnese.profissao || "",
    rotina_trabalho: anamnese.rotinaTrabalho || "",
    objetivo_principal: anamnese.objetivoPrincipal || "",
    objetivo_secundario: anamnese.objetivoSecundario || "",
    doenca_diagnosticada: anamnese.doencaDiagnosticada || "",
    usa_medicamento: anamnese.medicamento || "",
    dores_lesoes: anamnese.doresLesoes || "",
    cirurgia: anamnese.cirurgia || "",
    restricao_medica: anamnese.restricaoMedica || "",
    liberado_exercicio: anamnese.liberadoExercicios || "",
    experiencia_musculacao: anamnese.tempoExperiencia || anamnese.jaTreinou || "",
    frequencia_semanal: anamnese.frequenciaSemanal || "",
    dias_disponiveis: anamnese.diasDisponiveis || "",
    tempo_treino: anamnese.tempoPorTreino || "",
    local_treino: anamnese.localTreino || "",
    equipamentos: anamnese.equipamentos || "",
    sono: anamnese.escalaSono || anamnese.qualidadeSono || "",
    horas_sono: anamnese.horasSono || "",
    estresse: anamnese.escalaEstresse || anamnese.nivelEstresse || "",
    agua: anamnese.ingestaoAgua || "",
    alcool: anamnese.consumoAlcool || "",
    tabagismo: anamnese.tabagismo || "",
    dieta: anamnese.segueDieta || "",
    nutricionista: anamnese.nutricionista || "",
    refeicoes_dia: anamnese.refeicoesDia || "",
    dificuldade_alimentacao: anamnese.dificuldadeAlimentacao || "",
    fome_noite: anamnese.fomeNoite || anamnese.escalaFome || "",
    compulsao: anamnese.compulsaoAlimentar || "",
    exercicios_gosta: anamnese.exerciciosGosta || "",
    exercicios_nao_gosta: anamnese.exerciciosNaoGosta || "",
    grupos_prioritarios: anamnese.gruposPrioritarios || "",
    limitacoes_horario: anamnese.limitacoesHorario || "",
    observacoes: anamnese.observacoesImportantes || "",
  };
}

function rowParaAnamnese(row) {
  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    aluno: "",
    profissao: row.profissao || "",
    rotinaTrabalho: row.rotina_trabalho || "",
    objetivoPrincipal: row.objetivo_principal || "",
    objetivoSecundario: row.objetivo_secundario || "",
    doencaDiagnosticada: row.doenca_diagnosticada || "",
    medicamento: row.usa_medicamento || "",
    doresLesoes: row.dores_lesoes || "",
    cirurgia: row.cirurgia || "",
    restricaoMedica: row.restricao_medica || "",
    liberadoExercicios: row.liberado_exercicio || "",
    jaTreinou: row.experiencia_musculacao || "",
    tempoExperiencia: row.experiencia_musculacao || "",
    frequenciaSemanal: row.frequencia_semanal || "",
    diasDisponiveis: row.dias_disponiveis || "",
    tempoPorTreino: row.tempo_treino || "",
    localTreino: row.local_treino || "",
    equipamentos: row.equipamentos || "",
    qualidadeSono: row.sono || "",
    horasSono: row.horas_sono || "",
    nivelEstresse: row.estresse || "",
    ingestaoAgua: row.agua || "",
    consumoAlcool: row.alcool || "",
    tabagismo: row.tabagismo || "",
    segueDieta: row.dieta || "",
    nutricionista: row.nutricionista || "",
    refeicoesDia: row.refeicoes_dia || "",
    dificuldadeAlimentacao: row.dificuldade_alimentacao || "",
    fomeNoite: row.fome_noite || "",
    compulsaoAlimentar: row.compulsao || "",
    exerciciosGosta: row.exercicios_gosta || "",
    exerciciosNaoGosta: row.exercicios_nao_gosta || "",
    gruposPrioritarios: row.grupos_prioritarios || "",
    limitacoesHorario: row.limitacoes_horario || "",
    observacoesImportantes: row.observacoes || "",
    escalaSono: row.sono || "",
    escalaEstresse: row.estresse || "",
    escalaEnergia: "",
    escalaFome: row.fome_noite || "",
    escalaMotivacao: "",
    escalaAdesaoRotina: "",
    createdAt: row.created_at || "",
  };
}

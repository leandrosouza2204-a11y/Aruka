import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

loadQaEnvFile();
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const supabase = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const mode = process.argv.includes("--empty-alunos") ? "empty-alunos" : "default";

const email = process.env.QA_USER_EMAIL;
const user = await findUserByEmail(email);
if (!user) throw new Error("Usuario QA local nao encontrado. Execute npm run qa:local:user.");

await cleanupQaData(user.id);

const plans = await insertPlans(user.id);
const students = mode === "empty-alunos" ? [] : await insertStudents(user.id, plans);
const payments = students.length ? await insertPayments(user.id, students) : [];
const workout = students[0] ? await insertWorkout(user.id, students[0].id) : null;
const assessment = students[1] ? await insertAssessment(user.id, students[1].id) : null;
mkdirSync("reports/product-audit/dashboard-v1/evidence/local-qa", { recursive: true });
writeFileSync(join("reports/product-audit/dashboard-v1/evidence/local-qa", "local-qa-data-summary.md"), [
  "# LOCAL_QA Data Summary",
  "",
  `- QA user: ${email}`,
  `- Alunos ficticios: ${students.length}`,
  `- Planos ficticios: ${plans.length}`,
  `- Pagamentos ficticios: ${payments.length}`,
  `- Treinos ficticios: ${workout ? 1 : 0}`,
  `- Avaliacoes ficticias: ${assessment ? 1 : 0}`,
  "- Fonte: dados locais `.test`, sem copia de producao",
  `- Modo: ${mode}`,
  "",
].join("\n"));

console.log(JSON.stringify({
  status: "LOCAL_QA_DATA_READY",
  mode,
  alunos: students.length,
  planos: plans.length,
  pagamentos: payments.length,
  treinos: workout ? 1 : 0,
  avaliacoes: assessment ? 1 : 0,
}, null, 2));

async function findUserByEmail(targetEmail) {
  let page = 1;
  while (page < 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((item) => item.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function cleanupQaData(userId) {
  await supabase.from("pagamentos").delete().eq("user_id", userId);
  await supabase.from("avaliacoes").delete().eq("user_id", userId);
  await supabase.from("anamneses").delete().eq("user_id", userId);
  const { data: treinos } = await supabase.from("treinos").select("id").eq("user_id", userId);
  if (treinos?.length) {
    const ids = treinos.map((item) => item.id);
    const { data: dias } = await supabase.from("treino_dias").select("id").in("treino_id", ids);
    if (dias?.length) await supabase.from("treino_exercicios").delete().in("treino_dia_id", dias.map((item) => item.id));
    await supabase.from("treino_dias").delete().in("treino_id", ids);
  }
  await supabase.from("treinos").delete().eq("user_id", userId);
  await supabase.from("alunos").delete().eq("user_id", userId);
  await supabase.from("planos").delete().eq("user_id", userId);
}

async function insertPlans(userId) {
  const rows = [
    { user_id: userId, nome: "Plano Local Mensal", descricao: "Fixture LOCAL_QA", duracao_meses: 1, valor: 199.9, permite_parcelamento: false, quantidade_parcelas: 1, valor_parcela: 0, intervalo_parcelas_meses: 1, ativo: true },
    { user_id: userId, nome: "Plano Local Trimestral", descricao: "Fixture LOCAL_QA", duracao_meses: 3, valor: 540, permite_parcelamento: true, quantidade_parcelas: 3, valor_parcela: 180, intervalo_parcelas_meses: 1, ativo: true },
  ];
  const { data, error } = await supabase.from("planos").insert(rows).select("id,nome");
  if (error) throw error;
  return data;
}

async function insertStudents(userId, plans) {
  const base = [
    ["Ana Teste", -40, 15, "Ativo", true],
    ["Bruno Demo", -80, 4, "Ativo", false],
    ["Carla QA", -120, -2, "Ativo", false],
    ["Daniel Exemplo", -160, -12, "Inativo", true],
    ["Elisa Local", -20, 28, "Ativo", true],
    ["Felipe Mock", -70, 45, "Ativo", true],
    ["Gabriela Teste", -100, 60, "Ativo", false],
    ["Hugo QA", -130, 7, "Ativo", true],
    ["Isabela Demo", -150, 90, "Ativo", false],
    ["Joao Exemplo", -180, 120, "Ativo", true],
    ["LOCAL_QA Nome muito longo para validar quebra visual em cards e tabela", -12, 18, "Ativo", false],
    ["LOCAL_QA Dados minimos", 0, 30, "Ativo", false],
    ["LOCAL_QA Sem plano", -5, 0, "Ativo", false],
    ["LOCAL_QA Observacoes longas", -30, 30, "Ativo", true],
  ];
  const rows = base.map(([nome, startOffset, dueOffset, status, pago], index) => ({
    user_id: userId,
    nome,
    whatsapp: nome === "LOCAL_QA Dados minimos" ? "" : `119900000${String(index).padStart(2, "0")}`,
    nascimento: nome === "LOCAL_QA Dados minimos" ? null : "1995-01-01",
    inicio: dateOffset(startOffset),
    vencimento: dateOffset(dueOffset),
    aviso7: dateOffset(dueOffset - 7),
    aviso1: dateOffset(dueOffset - 1),
    plano: nome === "LOCAL_QA Sem plano" ? "" : plans[index % 2]?.id,
    valor: nome === "LOCAL_QA Sem plano" ? 0 : index % 2 === 0 ? 199.9 : 540,
    status,
    pagamento_recebido: pago,
    data_pagamento: pago ? dateOffset(startOffset + 1) : null,
    observacoes:
      nome === "LOCAL_QA Observacoes longas"
        ? "Fixture ficticio LOCAL_QA com observacoes longas para validar legibilidade, quebra de linha e preservacao de conteudo em detalhe e edicao do aluno."
        : "Fixture ficticio LOCAL_QA",
  }));
  const { data, error } = await supabase.from("alunos").insert(rows).select("id,nome");
  if (error) throw error;
  return data;
}

async function insertPayments(userId, students) {
  const rows = students.map((student, index) => ({
    user_id: userId,
    aluno_id: student.id,
    plano: index % 2 === 0 ? "Plano Local Mensal" : "Plano Local Trimestral",
    valor: index % 3 === 0 ? 0 : index % 2 === 0 ? 199.9 : 180,
    data_pagamento: dateOffset(-index * 18),
    forma_pagamento: index % 3 === 0 ? "pendente" : "pix",
    parcela: String((index % 3) + 1),
    total_parcelas: index % 2 === 0 ? 1 : 3,
    tipo_movimento: index % 3 === 0 ? "pagamento_pendente" : "pagamento_parcela",
    vencimento_parcela: dateOffset(index % 3 === 0 ? -3 : 10),
    observacao: "Pagamento ficticio LOCAL_QA",
    observacoes: "Pagamento ficticio LOCAL_QA",
  }));
  const { data, error } = await supabase.from("pagamentos").insert(rows).select("id");
  if (error) throw error;
  return data;
}

async function insertWorkout(userId, alunoId) {
  const { data: treino, error } = await supabase.from("treinos").insert({
    user_id: userId,
    aluno_id: alunoId,
    nome_rotina: "Rotina LOCAL_QA",
    objetivo: "Hipertrofia",
    nivel: "Intermediario",
    dias_semana: 3,
    status: "Ativo",
    data_inicio: dateOffset(-20),
    data_revisao: dateOffset(25),
  }).select("id").single();
  if (error) throw error;
  const { data: dia, error: diaError } = await supabase.from("treino_dias").insert({
    treino_id: treino.id,
    nome: "Treino A",
    grupo_muscular: "Superior",
    ordem: 1,
  }).select("id").single();
  if (diaError) throw diaError;
  const { error: exercicioError } = await supabase.from("treino_exercicios").insert({
    treino_dia_id: dia.id,
    nome: "Supino reto local",
    series: "3",
    repeticoes: "10",
    carga: "moderada",
    descanso: "60s",
    ordem: 1,
  });
  if (exercicioError) throw exercicioError;
  return treino;
}

async function insertAssessment(userId, alunoId) {
  const { data, error } = await supabase.from("avaliacoes").insert({
    user_id: userId,
    aluno_id: alunoId,
    data_avaliacao: dateOffset(-10),
    idade: 31,
    sexo: "F",
    altura: 1.68,
    peso: 68.4,
    percentual_gordura: 22.5,
    massa_magra: 53,
    imc: 24.2,
    status: "inicial",
    objetivo_atual: "Condicionamento",
    observacoes: "Avaliacao ficticia LOCAL_QA",
  }).select("id").single();
  if (error) throw error;
  return data;
}

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

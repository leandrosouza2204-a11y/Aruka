import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STATUS_MANUAIS_ENCERRADOS = new Set(["nao_renovado", "cancelado", "encerrado"]);
const DETALHES_CANDIDATOS_LIMITE = 100;
const PAGE_SIZE = 1000;

type Payload = {
  dryRun?: boolean;
  dataReferencia?: string | null;
  userId?: string | null;
};

type AlunoRow = {
  id: string;
  user_id: string;
  nome: string | null;
  vencimento: string | null;
  plano: string | null;
  acompanhamento_status: string | null;
  acompanhamento_encerrado_em?: string | null;
  acompanhamento_motivo?: string | null;
};

type PlanoRow = {
  id: string;
  user_id: string;
  nome: string | null;
};

type EventoRow = {
  aluno_id: string;
  user_id: string;
  tipo: string;
  motivo: string | null;
  vencimento_anterior: string | null;
  vencimento_novo?: string | null;
  event_key: string | null;
  metadata: Record<string, unknown> | null;
};

type Candidato = {
  alunoId: string;
  userId: string;
  nome: string;
  vencimento: string;
  ocorridoEm: string;
  diasAposVencimento: number;
  eventKey: string;
  planoId: string | null;
  planoNome: string;
  statusAtual: string;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Método não permitido." }, 405);
  }

  const inicio = Date.now();

  try {
    const authError = validarSecret(req);
    if (authError) return authError;

    const env = carregarEnv();
    if (!env.ok) {
      return jsonResponse({ ok: false, error: env.error }, 500);
    }

    const payloadResult = await lerPayload(req);
    if (!payloadResult.ok) {
      return jsonResponse({ ok: false, error: payloadResult.error }, 400);
    }

    const { dryRun, dataReferencia, userId } = payloadResult.payload;
    const supabase = createClient(env.supabaseUrl, env.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.info("processar-encerramentos-automaticos inicio", {
      dryRun,
      dataReferencia,
      userId: userId || null,
    });

    const [alunos, planos, eventos] = await Promise.all([
      buscarTodos<AlunoRow>(
        supabase
          .from("alunos")
          .select(
            "id,user_id,nome,vencimento,plano,acompanhamento_status,acompanhamento_encerrado_em,acompanhamento_motivo"
          )
          .order("user_id", { ascending: true })
          .order("vencimento", { ascending: true }),
        userId,
      ),
      buscarTodos<PlanoRow>(
        supabase
          .from("planos")
          .select("id,user_id,nome")
          .order("user_id", { ascending: true }),
        userId,
      ),
      buscarTodos<EventoRow>(
        supabase
          .from("acompanhamento_eventos")
          .select("aluno_id,user_id,tipo,motivo,vencimento_anterior,vencimento_novo,event_key,metadata")
          .in("tipo", ["acompanhamento_encerrado", "plano_renovado"])
          .order("user_id", { ascending: true }),
        userId,
      ),
    ]);

    const candidatos = montarCandidatos({
      alunos,
      planos,
      eventos,
      dataReferencia,
    });
    const candidatosDetalhados = candidatos.slice(0, DETALHES_CANDIDATOS_LIMITE);
    const detalhesTruncados = candidatos.length > candidatosDetalhados.length;

    if (dryRun) {
      const resposta = {
        ok: true,
        dryRun: true,
        dataReferencia,
        totalAnalisados: alunos.length,
        totalCandidatos: candidatos.length,
        candidatos: candidatosDetalhados.map(candidatoParaResposta),
        detalhesTruncados,
        duracaoMs: Date.now() - inicio,
      };

      console.info("processar-encerramentos-automaticos fim", {
        dryRun,
        totalAnalisados: resposta.totalAnalisados,
        totalCandidatos: resposta.totalCandidatos,
        duracaoMs: resposta.duracaoMs,
      });

      return jsonResponse(resposta);
    }

    const resultado = await processarCandidatos(supabase, candidatos);
    const resposta = {
      ok: true,
      dryRun: false,
      dataReferencia,
      totalAnalisados: alunos.length,
      totalCandidatos: candidatos.length,
      candidatos: candidatosDetalhados.map(candidatoParaResposta),
      detalhesTruncados,
      encerrados: resultado.encerrados,
      duplicados: resultado.duplicados,
      ignorados: resultado.ignorados,
      erros: resultado.erros,
      duracaoMs: Date.now() - inicio,
    };

    console.info("processar-encerramentos-automaticos fim", {
      dryRun,
      totalAnalisados: resposta.totalAnalisados,
      totalCandidatos: resposta.totalCandidatos,
      encerrados: resposta.encerrados,
      duplicados: resposta.duplicados,
      ignorados: resposta.ignorados,
      erros: resposta.erros.length,
      duracaoMs: resposta.duracaoMs,
    });

    return jsonResponse(resposta);
  } catch (error) {
    console.error("processar-encerramentos-automaticos erro global", {
      message: error instanceof Error ? error.message : "Erro desconhecido.",
    });
    return jsonResponse({ ok: false, error: "Falha global inesperada." }, 500);
  }
});

async function processarCandidatos(
  supabase: ReturnType<typeof createClient>,
  candidatos: Candidato[],
) {
  const erros: Array<Record<string, string>> = [];
  let encerrados = 0;
  let duplicados = 0;
  let ignorados = 0;

  for (const candidato of candidatos) {
    const { data, error } = await supabase.rpc("processar_encerramento_automatico_aluno", {
      p_user_id: candidato.userId,
      p_aluno_id: candidato.alunoId,
      p_vencimento: candidato.vencimento,
      p_ocorrido_em: candidato.ocorridoEm,
      p_event_key: candidato.eventKey,
      p_plano_id: candidato.planoId,
      p_plano_nome: candidato.planoNome,
      p_dias_apos_vencimento: candidato.diasAposVencimento,
      p_status_anterior: candidato.statusAtual,
    });

    if (error) {
      console.error("erro ao processar candidato", {
        alunoId: candidato.alunoId,
        userId: candidato.userId,
        code: error.code,
        message: error.message,
      });
      erros.push({
        alunoId: candidato.alunoId,
        userId: candidato.userId,
        code: error.code || "",
        message: error.message || "Erro ao processar candidato.",
      });
      continue;
    }

    const status = String((data as { status?: string } | null)?.status || "");
    const duplicate = Boolean((data as { duplicate?: boolean } | null)?.duplicate);

    if (status === "processado") encerrados += 1;
    else if (duplicate || status === "duplicado") duplicados += 1;
    else ignorados += 1;
  }

  return {
    encerrados,
    duplicados,
    ignorados,
    erros,
  };
}

function montarCandidatos({
  alunos,
  planos,
  eventos,
  dataReferencia,
}: {
  alunos: AlunoRow[];
  planos: PlanoRow[];
  eventos: EventoRow[];
  dataReferencia: string;
}) {
  const planosPorChave = new Map(planos.map((plano) => [`${plano.user_id}:${plano.id}`, plano]));

  return alunos
    .map((aluno) => {
      const plano = aluno.plano ? planosPorChave.get(`${aluno.user_id}:${aluno.plano}`) : null;
      return montarCandidato(aluno, plano || null, eventos, dataReferencia);
    })
    .filter((item): item is Candidato => Boolean(item));
}

function montarCandidato(
  aluno: AlunoRow,
  plano: PlanoRow | null,
  eventos: EventoRow[],
  dataReferencia: string,
): Candidato | null {
  if (!aluno.id || !aluno.user_id || !aluno.vencimento) return null;
  if (STATUS_MANUAIS_ENCERRADOS.has(String(aluno.acompanhamento_status || "ativo"))) return null;

  const diasAposVencimento = calcularDiasAposVencimento(aluno.vencimento, dataReferencia);
  if (diasAposVencimento === null || diasAposVencimento <= 90) return null;

  const eventKey = montarEventKey(aluno.id, aluno.vencimento);
  const eventosAluno = eventos.filter(
    (evento) => evento.user_id === aluno.user_id && evento.aluno_id === aluno.id,
  );

  if (eventosAluno.some((evento) => evento.event_key === eventKey)) return null;

  const renovadoDepois = eventosAluno.some(
    (evento) =>
      evento.tipo === "plano_renovado" &&
      evento.vencimento_anterior === aluno.vencimento &&
      String(evento.vencimento_novo || "") > aluno.vencimento!,
  );
  if (renovadoDepois) return null;

  return {
    alunoId: aluno.id,
    userId: aluno.user_id,
    nome: aluno.nome || "",
    vencimento: aluno.vencimento,
    ocorridoEm: adicionarDiasISO(aluno.vencimento, 91),
    diasAposVencimento,
    eventKey,
    planoId: plano?.id || null,
    planoNome: plano?.nome || aluno.plano || "",
    statusAtual: aluno.acompanhamento_status || "ativo",
  };
}

async function buscarTodos<T>(
  query: QueryLike<T>,
  userId: string | null,
) {
  let consulta = query;
  if (userId) {
    consulta = consulta.eq("user_id", userId);
  }

  const resultados: T[] = [];
  let inicio = 0;

  while (true) {
    const { data, error } = await consulta.range(inicio, inicio + PAGE_SIZE - 1);
    if (error) throw error;

    const pagina = data || [];
    resultados.push(...pagina);

    if (pagina.length < PAGE_SIZE) break;
    inicio += PAGE_SIZE;
  }

  return resultados;
}

async function lerPayload(req: Request) {
  let body: Payload = {};

  try {
    body = (await req.json()) as Payload;
  } catch {
    body = {};
  }

  const chavesPermitidas = new Set(["dryRun", "dataReferencia", "userId"]);
  const chavesInvalidas = Object.keys(body || {}).filter((chave) => !chavesPermitidas.has(chave));
  if (chavesInvalidas.length > 0) {
    return { ok: false as const, error: "Payload contém parâmetros não permitidos." };
  }

  const dryRun = body.dryRun === false ? false : true;
  const dataReferencia = normalizarDataReferencia(body.dataReferencia);
  if (!dataReferencia) {
    return { ok: false as const, error: "dataReferencia deve estar no formato YYYY-MM-DD." };
  }

  const userId = body.userId === null || body.userId === undefined ? null : String(body.userId).trim();
  if (userId && !uuidValido(userId)) {
    return { ok: false as const, error: "userId deve ser um UUID válido." };
  }

  return {
    ok: true as const,
    payload: {
      dryRun,
      dataReferencia,
      userId,
    },
  };
}

function validarSecret(req: Request) {
  const esperado = Deno.env.get("ENCERRAMENTOS_AUTOMATICOS_SECRET") || "";
  const recebido = req.headers.get("x-job-secret") || "";

  if (!esperado || !compararTempoConstante(recebido, esperado)) {
    return jsonResponse({ ok: false, error: "Não autorizado." }, 401);
  }

  return null;
}

function carregarEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false as const,
      error: "Configuração da função incompleta.",
    };
  }

  return {
    ok: true as const,
    supabaseUrl,
    serviceRoleKey,
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function candidatoParaResposta(candidato: Candidato) {
  return {
    alunoId: candidato.alunoId,
    userId: candidato.userId,
    nome: candidato.nome,
    vencimento: candidato.vencimento,
    diasAposVencimento: candidato.diasAposVencimento,
    eventKey: candidato.eventKey,
  };
}

function calcularDiasAposVencimento(vencimento: string, dataReferencia: string) {
  const alvo = extrairPartesData(vencimento);
  const atual = extrairPartesData(dataReferencia);
  if (!alvo || !atual) return null;

  const alvoUtc = Date.UTC(alvo.ano, alvo.mes - 1, alvo.dia);
  const atualUtc = Date.UTC(atual.ano, atual.mes - 1, atual.dia);

  return Math.floor((atualUtc - alvoUtc) / (1000 * 60 * 60 * 24));
}

function adicionarDiasISO(dataISO: string, dias: number) {
  const partes = extrairPartesData(dataISO);
  if (!partes) return dataISO;

  const data = new Date(partes.ano, partes.mes - 1, partes.dia);
  data.setDate(data.getDate() + dias);

  return dataLocalISO(data);
}

function normalizarDataReferencia(valor?: string | null) {
  if (!valor) return dataLocalISO();

  const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function extrairPartesData(valor: string) {
  const match = String(valor || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  return {
    ano: Number(match[1]),
    mes: Number(match[2]),
    dia: Number(match[3]),
  };
}

function montarEventKey(alunoId: string, vencimento: string) {
  return `encerramento_automatico:${alunoId}:${vencimento}`;
}

function uuidValido(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function compararTempoConstante(a: string, b: string) {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const tamanho = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;

  for (let index = 0; index < tamanho; index += 1) {
    diff |= (aBytes[index] || 0) ^ (bBytes[index] || 0);
  }

  return diff === 0;
}

type ErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

type QueryLike<T> = {
  eq: (column: string, value: string) => QueryLike<T>;
  range: (from: number, to: number) => Promise<{ data: T[] | null; error: ErrorLike | null }>;
};

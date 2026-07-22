import { buscarUsuarioLogado } from "./authSessionService";
import { avaliacaoParaPayload, rowParaAvaliacao } from "./avaliacoesMapper";
import {
  isAvaliacaoFotoPath,
  removeAvaliacaoFoto,
  resolverFotosPreview,
  uploadAvaliacaoFoto,
} from "./avaliacoesFotosService";
import { supabase } from "./supabase";

const POSICOES_FOTOS = ["frente", "lateral", "costas"];

export async function buscarAvaliacoesSupabase() {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from("avaliacoes").select("*")
    .eq("user_id", user.id).order("data_avaliacao", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return Promise.all((data || []).map(rowParaAvaliacaoComPreview));
}

export async function buscarAvaliacoesPorAlunoSupabase(alunoId) {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from("avaliacoes").select("*")
    .eq("user_id", user.id)
    .eq("aluno_id", alunoId)
    .order("data_avaliacao", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return Promise.all((data || []).map(rowParaAvaliacaoComPreview));
}

export async function adicionarAvaliacaoSupabase(avaliacao) {
  const user = await buscarUsuarioLogado();
  const payload = avaliacaoParaPayload(avaliacao, user.id);
  const { data, error } = await supabase.from("avaliacoes").insert(payload).select().single();
  if (error) tratarErroPersistencia("insert", error, payload);

  if (!temMudancaFotos(avaliacao.fotosPendentes)) return rowParaAvaliacaoComPreview(data);

  try {
    const { fotos, uploadsNovos } = await prepararFotosParaPersistencia({
      userId: user.id,
      alunoId: data.aluno_id,
      avaliacaoId: data.id,
      fotosAtuais: rowParaAvaliacao(data).fotos,
      fotosPendentes: avaliacao.fotosPendentes,
    });
    try {
      const atualizado = await atualizarFotosDaAvaliacao(data.id, user.id, fotos);
      return rowParaAvaliacaoComPreview(atualizado);
    } catch (erroAtualizacao) {
      await removerUploadsNovos(uploadsNovos);
      throw erroAtualizacao;
    }
  } catch (erro) {
    throw criarErroFotosParcial("A avaliação foi salva, mas uma ou mais fotos falharam.", erro, data);
  }
}

export async function atualizarAvaliacaoSupabase(id, avaliacao) {
  const user = await buscarUsuarioLogado();
  const fotosAtuais = { ...(avaliacao.fotos || {}) };
  const fotosPendentes = avaliacao.fotosPendentes || {};
  const uploadsNovos = [];
  let fotos = fotosAtuais;

  if (temMudancaFotos(fotosPendentes)) {
    try {
      const resultado = await prepararFotosParaPersistencia({
        userId: user.id,
        alunoId: avaliacao.alunoId,
        avaliacaoId: id,
        fotosAtuais,
        fotosPendentes,
      });
      fotos = resultado.fotos;
      uploadsNovos.push(...resultado.uploadsNovos);
    } catch (erro) {
      throw criarErroFotosParcial("Não foi possível enviar uma ou mais fotos. A avaliação não foi alterada.", erro);
    }
  }

  const payload = avaliacaoParaPayload({ ...avaliacao, fotos }, user.id);
  const { data, error } = await supabase.from("avaliacoes").update(payload)
    .eq("id", id).eq("user_id", user.id).select().single();

  if (error) {
    await removerUploadsNovos(uploadsNovos);
    tratarErroPersistencia("update", error, payload);
  }

  if (temMudancaFotos(fotosPendentes)) {
    const falhasRemocao = await removerFotosAntigasDepoisDoSucesso({ fotosAtuais, fotosNovas: fotos, fotosPendentes });
    if (falhasRemocao.length) {
      throw criarErroFotosParcial("A avaliação foi salva, mas não foi possível remover uma foto antiga agora.", falhasRemocao[0], data);
    }
  }

  return rowParaAvaliacaoComPreview(data);
}

export async function excluirAvaliacaoSupabase(id) {
  const user = await buscarUsuarioLogado();
  const { error } = await supabase.from("avaliacoes").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
  return id;
}

async function rowParaAvaliacaoComPreview(row) {
  const avaliacao = rowParaAvaliacao(row);
  avaliacao.fotosPreview = await resolverFotosPreview(avaliacao.fotos);
  return avaliacao;
}

async function prepararFotosParaPersistencia({ userId, alunoId, avaliacaoId, fotosAtuais, fotosPendentes }) {
  const fotos = { ...fotosAtuais };
  const uploadsNovos = [];

  try {
    for (const posicao of POSICOES_FOTOS) {
      const pendente = fotosPendentes[posicao];
      if (!pendente) continue;

      if (pendente.file) {
        const { path } = await uploadAvaliacaoFoto({ userId, alunoId, avaliacaoId, posicao, file: pendente.file });
        fotos[posicao] = path;
        uploadsNovos.push({ path, posicao });
      } else if (pendente.removida) {
        fotos[posicao] = "";
      }
    }
  } catch (erro) {
    await removerUploadsNovos(uploadsNovos);
    throw erro;
  }

  return { fotos, uploadsNovos };
}

async function atualizarFotosDaAvaliacao(id, userId, fotos) {
  const payload = {
    foto_frente_url: fotos.frente || null,
    foto_lateral_url: fotos.lateral || null,
    foto_costas_url: fotos.costas || null,
  };
  const { data, error } = await supabase.from("avaliacoes").update(payload)
    .eq("id", id).eq("user_id", userId).select().single();
  if (error) throw error;
  return data;
}

async function removerUploadsNovos(uploadsNovos) {
  await Promise.allSettled(uploadsNovos.map(({ path, posicao }) => removeAvaliacaoFoto({ path, posicao })));
}

async function removerFotosAntigasDepoisDoSucesso({ fotosAtuais, fotosNovas, fotosPendentes }) {
  const remocoes = POSICOES_FOTOS
    .filter((posicao) => fotosPendentes[posicao]?.file || fotosPendentes[posicao]?.removida)
    .map((posicao) => ({ posicao, path: fotosAtuais[posicao], novoPath: fotosNovas[posicao] }))
    .filter(({ path, novoPath }) => path && path !== novoPath && isAvaliacaoFotoPath(path));

  const resultados = await Promise.allSettled(
    remocoes.map(({ path, posicao }) => removeAvaliacaoFoto({ path, posicao }))
  );

  const falhas = [];
  resultados.forEach((resultado, indice) => {
    if (resultado.status === "rejected") {
      falhas.push(resultado.reason);
      console.warn("Foto antiga nao removida apos troca:", {
        posicao: remocoes[indice].posicao,
        path: remocoes[indice].path,
        erro: formatarErroSupabase(resultado.reason) || resultado.reason?.message,
      });
    }
  });
  return falhas;
}

function temMudancaFotos(fotosPendentes = {}) {
  return POSICOES_FOTOS.some((posicao) => fotosPendentes[posicao]?.file || fotosPendentes[posicao]?.removida);
}

function criarErroFotosParcial(message, cause, avaliacaoSalva = null) {
  console.error("Erro no fluxo de fotos da avaliacao:", {
    message,
    avaliacaoSalva: Boolean(avaliacaoSalva),
    erro: formatarErroSupabase(cause) || cause?.message,
  });
  const erro = new Error(message);
  erro.code = "AVALIACAO_FOTOS_PARCIAL";
  erro.cause = cause;
  erro.avaliacaoSalva = avaliacaoSalva ? rowParaAvaliacao(avaliacaoSalva) : null;
  return erro;
}

function tratarErroPersistencia(operacao, error, payload) {
  console.error("Erro ao persistir avaliação no Supabase:", {
    operacao, erro: formatarErroSupabase(error), payload: sanitizarPayloadParaLog(payload),
  });
  if (isErroSchemaAvaliacao(error)) {
    const erroSchema = new Error("O banco de dados não possui todas as colunas da avaliação. A operação foi cancelada para evitar perda parcial de dados.");
    erroSchema.code = "AVALIACAO_SCHEMA_INCOMPATIVEL";
    erroSchema.supabaseError = error;
    throw erroSchema;
  }
  throw error;
}

function isErroSchemaAvaliacao(error) {
  const texto = [error?.code, error?.message, error?.details, error?.hint].filter(Boolean).join(" ").toLowerCase();
  return texto.includes("pgrst204") || texto.includes("schema cache") || texto.includes("could not find") || texto.includes("column");
}

function sanitizarPayloadParaLog(payload) {
  return {
    possui_aluno_id: Boolean(payload.aluno_id),
    possui_data_avaliacao: Boolean(payload.data_avaliacao),
    campos_enviados: Object.keys(payload),
    campos_preenchidos: Object.entries(payload).filter(([, valor]) => valor !== null && valor !== "").map(([campo]) => campo),
  };
}

export function formatarErroSupabase(error) {
  if (!error) return null;
  const original = error.supabaseError || error;
  return { code: original.code || error.code, message: original.message || error.message, details: original.details, hint: original.hint };
}

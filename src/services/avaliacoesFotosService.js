import { supabase } from "./supabase";

export const AVALIACOES_FOTOS_BUCKET = "avaliacoes-fotos";

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSOES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const TAMANHO_MAXIMO = 8 * 1024 * 1024;
const POSICOES = new Set(["frente", "lateral", "costas"]);
const TEMPO_SIGNED_URL = 60 * 60;

export async function uploadAvaliacaoFoto({ userId, alunoId, avaliacaoId, posicao, file }) {
  validarEntrada({ userId, alunoId, avaliacaoId, posicao });
  validarArquivoAvaliacaoFoto(file);

  const path = montarPathFoto({ userId, alunoId, avaliacaoId, posicao, file });
  const { error } = await supabase.storage
    .from(AVALIACOES_FOTOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    registrarErroFoto("upload", { posicao, path, error });
    throw criarErroFoto("Nao foi possivel enviar uma ou mais fotos.", error);
  }

  return { path };
}

export async function removeAvaliacaoFoto({ path, posicao }) {
  if (!isAvaliacaoFotoPath(path)) return;

  const { error } = await supabase.storage.from(AVALIACOES_FOTOS_BUCKET).remove([path]);
  if (error) {
    registrarErroFoto("remove", { posicao, path, error });
    throw criarErroFoto("Nao foi possivel remover a foto agora.", error);
  }
}

export async function obterUrlAvaliacaoFoto({ path }) {
  if (!path) return "";
  if (!isAvaliacaoFotoPath(path)) return path;

  const { data, error } = await supabase.storage
    .from(AVALIACOES_FOTOS_BUCKET)
    .createSignedUrl(path, TEMPO_SIGNED_URL);

  if (error) {
    registrarErroFoto("signed-url", { path, error });
    return "";
  }

  return data?.signedUrl || "";
}

export async function resolverFotosPreview(fotos = {}) {
  const entradas = await Promise.all(
    ["frente", "lateral", "costas"].map(async (posicao) => [
      posicao,
      await obterUrlAvaliacaoFoto({ path: fotos[posicao] }),
    ])
  );
  return Object.fromEntries(entradas);
}

export function validarArquivoAvaliacaoFoto(file) {
  if (!file || !TIPOS_PERMITIDOS.has(file.type) || file.size > TAMANHO_MAXIMO) {
    const erro = new Error("Selecione uma imagem JPG, PNG ou WEBP de ate 8 MB.");
    erro.code = "AVALIACAO_FOTO_INVALIDA";
    throw erro;
  }
}

export function isAvaliacaoFotoPath(valor) {
  return typeof valor === "string" && /^[0-9a-f-]{36}\//i.test(valor);
}

function validarEntrada({ userId, alunoId, avaliacaoId, posicao }) {
  if (!userId || !alunoId || !avaliacaoId || !POSICOES.has(posicao)) {
    throw new Error("Dados insuficientes para enviar a foto da avaliacao.");
  }
}

function montarPathFoto({ userId, alunoId, avaliacaoId, posicao, file }) {
  return `${userId}/${alunoId}/${avaliacaoId}/${posicao}.${EXTENSOES[file.type]}`;
}

function criarErroFoto(message, error) {
  const erro = new Error(message);
  erro.code = "AVALIACAO_FOTO_ERRO";
  erro.supabaseError = error;
  return erro;
}

function registrarErroFoto(operacao, { posicao, path, error }) {
  console.error("Erro em foto de avaliacao:", {
    operacao,
    posicao,
    path,
    erro: {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    },
  });
}

import { verificarAssinaturaAtiva } from "./assinaturasService";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarPerfilUsuario() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data ? rowParaPerfil(data) : null;
}

export async function criarPerfilPadrao() {
  const user = await buscarUsuarioLogado();
  const perfilAtual = await buscarPerfilPorUserId(user.id);

  if (perfilAtual) return rowParaPerfil(perfilAtual);

  const { data, error } = await supabase
    .from("perfis")
    .insert({
      user_id: user.id,
      email: user.email || "",
      role: "user",
      tipo_acesso: "pendente",
      status: "ativo",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      const perfilCriadoEmParalelo = await buscarPerfilPorUserId(user.id);
      if (perfilCriadoEmParalelo) return rowParaPerfil(perfilCriadoEmParalelo);
    }

    throw error;
  }

  return rowParaPerfil(data);
}

export async function verificarAcessoUsuario() {
  const perfil = (await buscarPerfilUsuario()) || (await criarPerfilPadrao());

  if (perfil.status !== "ativo") {
    return {
      liberado: false,
      motivo: "bloqueado",
      perfil,
    };
  }

  if (perfil.role === "admin" || perfil.tipoAcesso === "admin") {
    return {
      liberado: true,
      motivo: "admin",
      perfil,
    };
  }

  if (perfil.tipoAcesso === "beta") {
    return {
      liberado: true,
      motivo: "beta",
      perfil,
    };
  }

  if (perfil.tipoAcesso === "assinante") {
    const assinaturaAtiva = await verificarAssinaturaAtiva();

    return {
      liberado: assinaturaAtiva,
      motivo: assinaturaAtiva ? "assinante" : "sem-assinatura",
      perfil,
    };
  }

  return {
    liberado: false,
    motivo: perfil.tipoAcesso === "bloqueado" ? "bloqueado" : "pendente",
    perfil,
  };
}

async function buscarPerfilPorUserId(userId) {
  const { data, error } = await supabase
    .from("perfis")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

function rowParaPerfil(row) {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    email: row.email || "",
    role: row.role || "user",
    tipoAcesso: row.tipo_acesso || "pendente",
    status: row.status || "ativo",
    createdAt: row.created_at || "",
  };
}

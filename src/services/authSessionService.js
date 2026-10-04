import { supabase } from "./supabase.js";

export async function buscarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user;
}

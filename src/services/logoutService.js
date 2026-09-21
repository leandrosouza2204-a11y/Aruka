import { markSessionLoggedOut } from "../hooks/useAutoLogout.js";
import { supabase } from "./supabase.js";
import { completeLogout } from "./logoutContract.js";

export async function encerrarSessao() {
  await completeLogout({
    signOut: () => supabase.auth.signOut(),
    markLoggedOut: markSessionLoggedOut,
  });
}

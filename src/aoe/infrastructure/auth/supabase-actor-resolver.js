import { AOEInfrastructureAuthError } from "./auth-errors.js";

export async function resolveSupabaseActor({ userClient, declaredActor = {} }) {
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) throw new AOEInfrastructureAuthError("Sessão inválida.");
  const { data: profile, error: profileError } = await userClient.from("perfis").select("role,tipo_acesso,status").eq("user_id", data.user.id).maybeSingle();
  if (profileError) throw profileError;
  const role = profile?.role === "admin" || profile?.tipo_acesso === "admin" ? "ADMIN" : "PROFESSIONAL";
  if (declaredActor.actorId && declaredActor.actorId !== data.user.id) throw new AOEInfrastructureAuthError("Actor declarado diverge da identidade autenticada.", "FORBIDDEN");
  return { actorId: data.user.id, role, organizationId: declaredActor.organizationId ?? null };
}

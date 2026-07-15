export async function resolveStudentAccess({ supabaseClient, actor, studentId }) {
  const { data, error } = await supabaseClient.from("alunos").select("id,user_id").eq("id", studentId).maybeSingle();
  if (error) throw error;
  return { allowed: Boolean(data && (actor.role === "ADMIN" || data.user_id === actor.actorId)), organizationId: actor.organizationId ?? null };
}

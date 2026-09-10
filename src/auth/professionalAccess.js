export function isProfessionalProfile(profile) {
  if (profile?.status !== "ativo") return false;

  if (profile.role === "admin" || profile.tipoAcesso === "admin") return true;

  return (
    profile.role === "user" &&
    ["beta", "assinante"].includes(profile.tipoAcesso)
  );
}

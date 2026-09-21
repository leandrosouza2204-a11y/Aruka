export async function completeLogout({ signOut, markLoggedOut }) {
  const result = await signOut();
  if (result?.error) {
    const safe = new Error("Não foi possível encerrar sua sessão. Tente novamente.");
    safe.code = "LOGOUT_FAILED";
    safe.cause = result.error;
    throw safe;
  }

  markLoggedOut();
}

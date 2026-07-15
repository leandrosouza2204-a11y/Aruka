export async function parseJsonRequest(request) {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false, error: { code: "INVALID_REQUEST", message: "JSON inválido." } };
  }
}

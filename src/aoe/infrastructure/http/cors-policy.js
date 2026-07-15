export function createCorsHeaders(config = {}) {
  const origin = config.corsOrigins?.[0] ?? "";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, idempotency-key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

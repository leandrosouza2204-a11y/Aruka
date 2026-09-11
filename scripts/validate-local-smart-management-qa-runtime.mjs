import { createClient } from "@supabase/supabase-js";
import { calculateProfitability } from "../src/features/gestaoInteligente/utils/profitabilityEngine.js";
import { normalizeSmartManagementLocation } from "../src/features/gestaoInteligente/utils/smartManagementLocationPersistence.js";
import { assertLocalSmartManagementQaEnvironment, FIXTURE_IDS, QA_SMART_MANAGEMENT_EMAIL } from "./lib/local-smart-management-qa-fixtures.mjs";
import { getJwtTiming } from "./lib/local-auth-jwt-timing.mjs";

const runtime = assertLocalSmartManagementQaEnvironment();
const password = process.env.QA_USER_PASSWORD;
if (!password) throw new Error("QA_USER_PASSWORD_REQUIRED");

const client = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: loginData, error: loginError } = await client.auth.signInWithPassword({ email: QA_SMART_MANAGEMENT_EMAIL, password });
if (loginError) throw loginError;
const jwtTiming = await waitForFreshJwt(loginData.session?.access_token);
const requestStartEpochMs = Date.now();

const [servicesResult, locationsResult] = await Promise.all([
  client.from("smart_management_services").select("id,name,description,service_type,pricing_model,price,sessions_per_week,sessions_per_month,sessions_in_package,session_duration_minutes,min_students,max_students,status,archived_at").eq("status", "active"),
  client.from("smart_management_locations").select("id,name,description,status,archived_at,smart_management_transfer_rules(id,rule_type,fixed_amount,per_student_amount,percentage_rate,smart_management_transfer_tiers(id,min_students,max_students,amount))").eq("status", "active"),
]);
if (servicesResult.error) throw servicesResult.error;
if (locationsResult.error) throw locationsResult.error;
const requestEndEpochMs = Date.now();
const service = (servicesResult.data || []).find((item) => item.id === FIXTURE_IDS.servicePerSession);
const locationRow = (locationsResult.data || []).find((item) => item.id === FIXTURE_IDS.locationNone);
if (!service || !locationRow) throw new Error("AUTHENTICATED_FIXTURE_SOURCE_MISSING");
const result = calculateProfitability({
  service: {
    ...service,
    pricingModel: service.pricing_model,
    sessionDurationMinutes: service.session_duration_minutes,
    minStudents: service.min_students,
    maxStudents: service.max_students,
  },
  location: normalizeSmartManagementLocation(locationRow),
  studentCount: 1,
});
if (!result.valid || result.grossRevenue !== 10000 || result.netAfterTransfer !== 10000) {
  throw new Error("PROFITABILITY_READY_SANITY_FAILED");
}
console.log("AUTHENTICATED_SMART_MANAGEMENT_SOURCE=PASS");
console.log("PROFITABILITY_READY_SANITY=PASS");
console.log(`SERVICES_AVAILABLE=${servicesResult.data.length} LOCATIONS_AVAILABLE=${locationsResult.data.length}`);
if (process.env.LOCAL_AUTH_RUNTIME_DIAGNOSTICS === "1") {
  console.log(JSON.stringify({
    attempt_number: Number(process.env.LOCAL_AUTH_RUNTIME_ATTEMPT || 0) || null,
    host_epoch_ms: requestEndEpochMs,
    jwt_iat: jwtTiming.issuedAt,
    jwt_exp: jwtTiming.expiresAt,
    jwt_iat_epoch_ms: jwtTiming.issuedAtEpochMs,
    request_start_epoch_ms: requestStartEpochMs,
    request_end_epoch_ms: requestEndEpochMs,
    delta_host_vs_iat_ms: requestStartEpochMs - jwtTiming.issuedAtEpochMs,
  }));
}

async function waitForFreshJwt(accessToken) {
  const timing = getJwtTiming(accessToken);
  // JWT timestamps are second-granular; a fixed 2.1 s window clears the measured local stack boundary.
  if (timing.waitMs) await new Promise((resolve) => setTimeout(resolve, timing.waitMs));
  return timing;
}

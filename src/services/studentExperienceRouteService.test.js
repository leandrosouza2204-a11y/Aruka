import assert from "node:assert/strict";
import { test } from "node:test";
import { buscarMinhaRotaExperienciaAluno } from "./studentExperienceRouteService.js";

const authenticate = async () => ({ id: "user-1" });
const telemetry = async () => true;

test("server allow plus build capability grants V2", async () => {
  const decision = await buscarMinhaRotaExperienciaAluno({ buildSupportsV2: true, authenticate, telemetry, rpc: async () => ({ data: { experience: "v2", reasonCode: "STUDENT_ELIGIBLE", configVersion: 3 } }) });
  assert.equal(decision.experience, "v2");
});

test("build capability OFF overrides server allow", async () => {
  const decision = await buscarMinhaRotaExperienciaAluno({ buildSupportsV2: false, authenticate, telemetry, rpc: async () => ({ data: { experience: "v2", reasonCode: "STUDENT_ELIGIBLE", configVersion: 3 } }) });
  assert.equal(decision.experience, "v1");
  assert.equal(decision.reasonCode, "BUILD_CAPABILITY_DISABLED");
});

test("auth, network, malformed and RPC errors fail closed", async () => {
  const cases = [
    { authenticate: async () => { throw new Error("auth"); }, rpc: async () => ({}) },
    { authenticate, rpc: async () => { throw new Error("network"); } },
    { authenticate, rpc: async () => ({ data: null }) },
    { authenticate, rpc: async () => ({ error: new Error("rpc") }) },
  ];
  for (const dependencies of cases) {
    const decision = await buscarMinhaRotaExperienciaAluno({ buildSupportsV2: true, telemetry, ...dependencies });
    assert.equal(decision.experience, "v1");
  }
});

test("telemetry failure never blocks an eligible route", async () => {
  const decision = await buscarMinhaRotaExperienciaAluno({
    buildSupportsV2: true,
    authenticate,
    telemetry: () => { throw new Error("sink unavailable"); },
    rpc: async () => ({ data: { experience: "v2", reasonCode: "STUDENT_ELIGIBLE", configVersion: 4 } }),
  });
  assert.equal(decision.experience, "v2");
});

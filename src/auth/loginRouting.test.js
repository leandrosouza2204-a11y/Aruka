import assert from "node:assert/strict";
import { test } from "node:test";
import { PROFESSIONAL_DEFAULT_ROUTE, STUDENT_DEFAULT_ROUTE, STUDENT_V2_DEFAULT_ROUTE, resolverDestinoPosLogin } from "./loginRouting.js";

test("ROUTE-01: canonical decision sends an eligible student to V2", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "v2" }), async () => null), STUDENT_V2_DEFAULT_ROUTE);
});

test("global OFF/default deny stays on V1", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "v1" }), async () => null), STUDENT_DEFAULT_ROUTE);
});

test("professional identity keeps the professional dashboard", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "professional" }), async () => null), PROFESSIONAL_DEFAULT_ROUTE);
});

test("decision failure uses the caller safe fallback", async () => {
  const route = await resolverDestinoPosLogin(
    async () => { throw new Error("network"); },
    async () => null,
    { fallbackRoute: STUDENT_DEFAULT_ROUTE }
  );
  assert.equal(route, STUDENT_DEFAULT_ROUTE);
});

test("PROFESSIONAL-01: verified professional profile wins before the student rollout RPC", async () => {
  let decisionCalls = 0;
  const route = await resolverDestinoPosLogin(
    async () => {
      decisionCalls += 1;
      return { experience: "v1" };
    },
    async () => ({ role: "user", tipoAcesso: "assinante", status: "ativo" })
  );

  assert.equal(route, PROFESSIONAL_DEFAULT_ROUTE);
  assert.equal(decisionCalls, 0);
});

test("PROFESSIONAL-03: restored professional session survives an unavailable rollout RPC", async () => {
  const route = await resolverDestinoPosLogin(
    async () => { throw new Error("RPC_NOT_DEPLOYED"); },
    async () => ({ role: "admin", tipoAcesso: "admin", status: "ativo" })
  );
  assert.equal(route, PROFESSIONAL_DEFAULT_ROUTE);
});

test("SECURITY-01: inactive or pending profiles never receive professional routing", async () => {
  const profiles = [
    { role: "user", tipoAcesso: "assinante", status: "inativo" },
    { role: "user", tipoAcesso: "pendente", status: "ativo" },
  ];

  for (const profile of profiles) {
    const route = await resolverDestinoPosLogin(
      async () => ({ experience: "v1" }),
      async () => profile
    );
    assert.equal(route, STUDENT_DEFAULT_ROUTE);
  }
});

test("multi-role identity preserves the established professional context priority", async () => {
  const route = await resolverDestinoPosLogin(
    async () => ({ experience: "v2" }),
    async () => ({ role: "user", tipoAcesso: "beta", status: "ativo" })
  );
  assert.equal(route, PROFESSIONAL_DEFAULT_ROUTE);
});

test("exports retain canonical route contract", () => {
  assert.equal(STUDENT_DEFAULT_ROUTE, "/minha-area");
  assert.equal(STUDENT_V2_DEFAULT_ROUTE, "/minha-area/inicio");
  assert.equal(PROFESSIONAL_DEFAULT_ROUTE, "/dashboard");
});

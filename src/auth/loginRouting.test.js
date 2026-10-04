import assert from "node:assert/strict";
import { test } from "node:test";
import { PROFESSIONAL_DEFAULT_ROUTE, STUDENT_DEFAULT_ROUTE, STUDENT_V2_DEFAULT_ROUTE, resolverDestinoPosLogin } from "./loginRouting.js";

test("ROUTE-01: canonical decision sends an eligible student to V2", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "v2" })), STUDENT_V2_DEFAULT_ROUTE);
});

test("global OFF/default deny stays on V1", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "v1" })), STUDENT_DEFAULT_ROUTE);
});

test("professional identity keeps the professional dashboard", async () => {
  assert.equal(await resolverDestinoPosLogin(async () => ({ experience: "professional" })), PROFESSIONAL_DEFAULT_ROUTE);
});

test("decision failure uses the caller safe fallback", async () => {
  const route = await resolverDestinoPosLogin(async () => { throw new Error("network"); }, { fallbackRoute: STUDENT_DEFAULT_ROUTE });
  assert.equal(route, STUDENT_DEFAULT_ROUTE);
});

test("exports retain canonical route contract", () => {
  assert.equal(STUDENT_DEFAULT_ROUTE, "/minha-area");
  assert.equal(STUDENT_V2_DEFAULT_ROUTE, "/minha-area/inicio");
  assert.equal(PROFESSIONAL_DEFAULT_ROUTE, "/dashboard");
});

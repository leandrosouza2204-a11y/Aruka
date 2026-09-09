import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLocationComparison, MAX_LOCATION_COMPARISON_LOCATIONS } from "./locationComparator.js";

const baseService = {
  id: "personal-dupla",
  name: "Personal em Dupla",
  status: "active",
  pricingModel: "PER_STUDENT_SESSION",
  price: 70,
  sessionDurationMinutes: 60,
  minStudents: 1,
  maxStudents: 4,
};

function location(id, name, rule, status = "active") {
  return { id, name, status, rule };
}

function compare(locations, selectedLocationIds = locations.map((item) => item.id), service = baseService, studentCount = 2) {
  return buildLocationComparison({ service, locations, selectedLocationIds, studentCount });
}

describe("location comparator", () => {
  it("compares two active locations and preserves selection order from active locations", () => {
    const result = compare([
      location("a", "Academia A", { type: "fixed", amount: 100 }),
      location("b", "Academia B", { type: "none" }),
    ]);

    assert.equal(result.selectedLocationCount, 2);
    assert.deepEqual(result.scenarioResults.map((item) => item.scenarioId), ["a", "b"]);
    assert.equal(result.invariants.sameGrossRevenue, true);
    assert.deepEqual(result.comparison.highestNet.scenarioIds, ["b"]);
  });

  it("compares the explicit Academia A/B/C reference scenario", () => {
    const result = compare([
      location("a", "Academia A", { type: "tiered", tiers: [{ minStudents: 1, maxStudents: 1, amount: 50 }, { minStudents: 2, maxStudents: 2, amount: 100 }, { minStudents: 3, maxStudents: null, amount: 150 }] }),
      location("b", "Academia B", { type: "fixed", amount: 75 }),
      location("c", "Academia C", { type: "none" }),
    ]);

    assert.deepEqual(result.scenarioResults.map((item) => item.result.grossRevenue), [14000, 14000, 14000]);
    assert.deepEqual(result.scenarioResults.map((item) => item.result.transferAmount), [10000, 7500, 0]);
    assert.deepEqual(result.scenarioResults.map((item) => item.result.netAfterTransfer), [4000, 6500, 14000]);
    assert.deepEqual(result.scenarioResults.map((item) => item.result.netHourlyRate), [4000, 6500, 14000]);
  });

  it("supports four simultaneous locations", () => {
    const result = compare([
      location("a", "A", { type: "none" }),
      location("b", "B", { type: "fixed", amount: 10 }),
      location("c", "C", { type: "per_student", amount: 5 }),
      location("d", "D", { type: "percentage", amount: 10 }),
    ]);

    assert.equal(MAX_LOCATION_COMPARISON_LOCATIONS, 4);
    assert.equal(result.scenarioResults.length, 4);
    assert.equal(result.invariants.sameService, true);
    assert.equal(result.invariants.sameStudentCount, true);
    assert.equal(result.invariants.sameDuration, true);
  });

  it("supports none, fixed, per_student, tiered and percentage rules", () => {
    const result = compare([
      location("none", "Sem repasse", { type: "none" }),
      location("fixed", "Fixo", { type: "fixed", amount: 75 }),
      location("per", "Por aluno", { type: "per_student", amount: 20 }),
      location("tier", "Faixa", { type: "tiered", tiers: [{ minStudents: 2, maxStudents: null, amount: 90 }] }),
      location("percent", "Percentual", { type: "percentage", amount: 25 }),
    ], ["none", "fixed", "per", "tier"]);

    assert.deepEqual(result.scenarioResults.map((item) => item.result.transferAmount), [0, 7500, 4000, 9000]);
  });

  it("keeps ties for highlighted metrics", () => {
    const result = compare([
      location("a", "A", { type: "fixed", amount: 50 }),
      location("b", "B", { type: "fixed", amount: 50 }),
      location("c", "C", { type: "fixed", amount: 80 }),
    ]);

    assert.equal(result.comparison.highestHourly.tie, true);
    assert.deepEqual(result.comparison.highestHourly.scenarioIds, ["a", "b"]);
  });

  it("preserves negative net values", () => {
    const result = compare([
      location("a", "A", { type: "fixed", amount: 160 }),
      location("b", "B", { type: "fixed", amount: 170 }),
    ]);

    assert.deepEqual(result.scenarioResults.map((item) => item.result.netAfterTransfer), [-2000, -3000]);
    assert.deepEqual(result.comparison.highestNet.scenarioIds, ["a"]);
  });

  it("does not highlight null hourly metrics", () => {
    const service = { ...baseService, sessionDurationMinutes: null };
    const result = compare([
      location("a", "A", { type: "none" }),
      location("b", "B", { type: "fixed", amount: 10 }),
    ], ["a", "b"], service);

    assert.equal(result.scenarioResults[0].result.netHourlyRate, null);
    assert.deepEqual(result.comparison.highestHourly.scenarioIds, []);
  });

  it("keeps missing rules invalid without converting them to zero", () => {
    const result = compare([
      location("a", "A", null),
      location("b", "B", { type: "none" }),
    ]);

    assert.equal(result.scenarioResults[0].valid, false);
    assert.equal(result.scenarioResults[0].result.errors[0].code, "RULE_MISSING");
    assert.deepEqual(result.comparison.highestNet.scenarioIds, ["b"]);
  });

  it("reports invalid capacity without producing a valid comparison row", () => {
    const result = compare([
      location("a", "A", { type: "none" }),
      location("b", "B", { type: "fixed", amount: 10 }),
    ], ["a", "b"], { ...baseService, maxStudents: 1 }, 2);

    assert.equal(result.scenarioResults.every((item) => item.valid === false), true);
    assert.equal(result.comparison.validScenarioCount, 0);
  });

  it("filters archived locations from new comparisons", () => {
    const result = compare([
      location("a", "A", { type: "none" }),
      location("archived", "Arquivado", { type: "none" }, "archived"),
      location("b", "B", { type: "fixed", amount: 10 }),
    ], ["a", "archived", "b"]);

    assert.deepEqual(result.scenarioResults.map((item) => item.scenarioId), ["a", "b"]);
  });
});

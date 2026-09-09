import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateProfitability } from "./profitabilityEngine.js";
import { compareProfitabilityScenarios } from "./profitabilityComparison.js";

const service = (overrides = {}) => ({
  id: "service",
  name: "Personal",
  status: "active",
  pricingModel: "PER_STUDENT_SESSION",
  price: 70,
  sessionDurationMinutes: 60,
  minStudents: 1,
  maxStudents: null,
  ...overrides,
});

const location = (overrides = {}) => ({
  id: "location",
  name: "Academia",
  status: "active",
  rule: { type: "none" },
  ...overrides,
});

function scenario(scenarioId, overrides = {}) {
  const nextService = overrides.service || service();
  const nextLocation = overrides.location || location();
  const studentCount = overrides.studentCount ?? 1;
  return {
    scenarioId,
    result: calculateProfitability({ service: nextService, location: nextLocation, studentCount }),
  };
}

describe("profitability scenario comparison", () => {
  it("compares two scenarios without reordering them", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { location: location({ rule: { type: "fixed", amount: 50 } }) }),
      scenario("B", { location: location({ rule: { type: "none" } }) }),
    ]);

    assert.deepEqual(comparison.scenarioResults.map((item) => item.scenarioId), ["A", "B"]);
    assert.deepEqual(comparison.highestNet.scenarioIds, ["B"]);
    assert.equal(comparison.highestNet.value, 7000);
  });

  it("compares three tiered/fixed/none transfer scenarios", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { studentCount: 3, location: location({ rule: { type: "tiered", tiers: [{ minStudents: 1, maxStudents: 1, amount: 50 }, { minStudents: 2, maxStudents: 2, amount: 100 }, { minStudents: 3, maxStudents: null, amount: 150 }] } }) }),
      scenario("B", { studentCount: 3, location: location({ rule: { type: "fixed", amount: 75 } }) }),
      scenario("C", { studentCount: 3, location: location({ rule: { type: "none" } }) }),
    ]);

    assert.equal(comparison.validScenarioCount, 3);
    assert.deepEqual(comparison.highestHourly.scenarioIds, ["C"]);
    assert.equal(comparison.highestHourly.value, 21000);
    assert.deepEqual(comparison.lowestTransfer.scenarioIds, ["C"]);
  });

  it("keeps all winners when there is a tie", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A"),
      scenario("B"),
      scenario("C", { location: location({ rule: { type: "fixed", amount: 10 } }) }),
    ]);

    assert.equal(comparison.highestNet.tie, true);
    assert.deepEqual(comparison.highestNet.scenarioIds, ["A", "B"]);
  });

  it("compares negative values mathematically", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { location: location({ rule: { type: "fixed", amount: 80 } }) }),
      scenario("B", { location: location({ rule: { type: "fixed", amount: 90 } }) }),
    ]);

    assert.equal(comparison.highestNet.value, -1000);
    assert.deepEqual(comparison.highestNet.scenarioIds, ["A"]);
  });

  it("ignores null hourly rates for hourly winners", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { service: service({ sessionDurationMinutes: "" }) }),
      scenario("B"),
    ]);

    assert.deepEqual(comparison.highestHourly.scenarioIds, ["B"]);
  });

  it("keeps invalid scenarios isolated from comparison winners", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { service: service({ maxStudents: 2 }), studentCount: 3 }),
      scenario("B"),
    ]);

    assert.equal(comparison.scenarioResults[0].valid, false);
    assert.equal(comparison.validScenarioCount, 1);
    assert.deepEqual(comparison.highestNet.scenarioIds, ["B"]);
  });

  it("supports mixed pricing models and transfer rules", () => {
    const comparison = compareProfitabilityScenarios([
      scenario("A", { service: service({ pricingModel: "PER_SESSION", price: 100 }), location: location({ rule: { type: "percentage", amount: 20 } }) }),
      scenario("B", { service: service({ pricingModel: "FIXED_PACKAGE", price: 600, sessionsInPackage: 4 }), location: location({ rule: { type: "per_student", amount: 15 } }), studentCount: 2 }),
      scenario("C", { service: service({ pricingModel: "MONTHLY_PACKAGE", price: 1200, sessionsPerWeek: 3 }), location: location({ rule: { type: "none" } }) }),
    ]);

    assert.equal(comparison.validScenarioCount, 3);
    assert.deepEqual(comparison.highestNet.scenarioIds, ["B"]);
    assert.equal(comparison.highestNet.value, 12000);
  });
});

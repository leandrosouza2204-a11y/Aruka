import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MONTHLY_WEEKS_FACTOR, calculateProfitability } from "./profitabilityEngine.js";

const service = (overrides = {}) => ({ pricingModel: "PER_SESSION", price: 120, sessionDurationMinutes: 60, minStudents: 1, maxStudents: null, status: "active", ...overrides });
const location = (rule, overrides = {}) => ({ name: "Academia", status: "active", rule, ...overrides });
const calculate = (serviceOverrides, rule, studentCount = 1) => calculateProfitability({ service: service(serviceOverrides), location: location(rule), studentCount });

describe("profitability transfer rules", () => {
  it("supports none", () => assert.deepEqual(pick(calculate({}, { type: "none" })), [12000, 0, 12000]));
  it("supports fixed without changing by student count", () => {
    assert.equal(calculate({}, { type: "fixed", amount: 75 }, 1).transferAmount, 7500);
    assert.equal(calculate({}, { type: "fixed", amount: 75 }, 5).transferAmount, 7500);
  });
  it("supports per student", () => assert.equal(calculate({}, { type: "per_student", amount: 30 }, 3).transferAmount, 9000));
  it("selects tier without interpolation or accumulation", () => {
    const tiers = [{ minStudents: 1, maxStudents: 1, amount: 50 }, { minStudents: 2, maxStudents: 2, amount: 100 }, { minStudents: 3, maxStudents: null, amount: 150 }];
    assert.deepEqual([1, 2, 3, 4, 10].map((count) => calculate({}, { type: "tiered", tiers }, count).transferAmount), [5000, 10000, 15000, 15000, 15000]);
  });
  it("supports percentage stored as whole percent and rounds to cents", () => {
    assert.equal(calculate({ price: 200 }, { type: "percentage", amount: 20 }).transferAmount, 4000);
    assert.equal(calculate({ price: 0.05 }, { type: "percentage", amount: 10 }).transferAmount, 1);
  });
  it("distinguishes missing rule from none", () => assert.equal(calculateProfitability({ service: service(), location: location(null), studentCount: 1 }).errors[0].code, "RULE_MISSING"));
});

describe("profitability pricing models", () => {
  it("does not multiply per-session price by students", () => assert.equal(calculate({ pricingModel: "PER_SESSION" }, { type: "none" }, 4).grossRevenue, 12000));
  it("multiplies per-student session price", () => assert.equal(calculate({ pricingModel: "PER_STUDENT_SESSION", price: 70 }, { type: "none" }, 3).grossRevenue, 21000));
  it("normalizes monthly weekly frequency with 52/12", () => {
    const result = calculate({ pricingModel: "MONTHLY_PACKAGE", price: 800, sessionsPerWeek: 2 }, { type: "none" });
    assert.equal(result.grossRevenue, 9231);
    assert.equal(result.monthlyNormalization.weeksFactor, MONTHLY_WEEKS_FACTOR);
  });
  it("uses explicit monthly sessions when available", () => assert.equal(calculate({ pricingModel: "MONTHLY_PACKAGE", price: 800, sessionsPerMonth: 8 }, { type: "none" }).grossRevenue, 10000));
  it("rejects monthly package without a usable frequency", () => assert.equal(calculate({ pricingModel: "MONTHLY_PACKAGE", sessionsPerWeek: null }, { type: "none" }).errors[0].code, "MONTHLY_FREQUENCY_REQUIRED"));
  it("divides fixed package by package sessions", () => assert.equal(calculate({ pricingModel: "FIXED_PACKAGE", price: 900, sessionsInPackage: 10 }, { type: "none" }).grossRevenue, 9000));
  it("rejects fixed package without valid quantity", () => assert.equal(calculate({ pricingModel: "FIXED_PACKAGE", sessionsInPackage: null }, { type: "none" }).errors[0].code, "INVALID_FIXED_PACKAGE"));
});

describe("profitability outputs and invariants", () => {
  it("calculates the individual reference scenario", () => assert.deepEqual(pick(calculate({}, { type: "fixed", amount: 50 })), [12000, 5000, 7000]));
  it("calculates the pair reference scenario", () => {
    const result = calculate({ pricingModel: "PER_STUDENT_SESSION", price: 70, minStudents: 2, maxStudents: 2 }, { type: "tiered", tiers: [{ minStudents: 2, maxStudents: 2, amount: 100 }] }, 2);
    assert.deepEqual([result.grossRevenue, result.transferAmount, result.netAfterTransfer, result.netHourlyRate, result.netPerStudent], [14000, 10000, 4000, 4000, 2000]);
  });
  it("preserves negative net", () => assert.equal(calculate({ price: 40 }, { type: "fixed", amount: 50 }).netAfterTransfer, -1000));
  it("returns null hourly rates when duration is missing", () => assert.equal(calculate({ sessionDurationMinutes: null }, { type: "none" }).netHourlyRate, null));
  it("handles 30, 45, 60 and 90 minutes", () => assert.deepEqual([30, 45, 60, 90].map((duration) => calculate({ sessionDurationMinutes: duration }, { type: "none" }).netHourlyRate), [24000, 16000, 12000, 8000]));
  it("rejects capacity outside bounds", () => assert.equal(calculate({ minStudents: 2, maxStudents: 2 }, { type: "none" }, 3).errors[0].code, "ABOVE_MAX_CAPACITY"));
  it("rejects malformed monetary transfer values", () => assert.equal(calculate({}, { type: "fixed", amount: null }).errors[0].code, "INVALID_TRANSFER_AMOUNT"));
  it("keeps gross minus transfer equal to net", () => {
    const result = calculate({ pricingModel: "PER_STUDENT_SESSION", price: 60 }, { type: "per_student", amount: 15 }, 4);
    assert.equal(result.grossRevenue - result.transferAmount, result.netAfterTransfer);
  });
  it("duration changes hourly values only", () => {
    const short = calculate({ sessionDurationMinutes: 30 }, { type: "fixed", amount: 20 });
    const long = calculate({ sessionDurationMinutes: 90 }, { type: "fixed", amount: 20 });
    assert.deepEqual([short.grossRevenue, short.netAfterTransfer], [long.grossRevenue, long.netAfterTransfer]);
    assert.notEqual(short.netHourlyRate, long.netHourlyRate);
  });
});

describe("Academia A/B/C reference scenarios", () => {
  const tiered = { type: "tiered", tiers: [{ minStudents: 1, maxStudents: 1, amount: 50 }, { minStudents: 2, maxStudents: 2, amount: 100 }, { minStudents: 3, maxStudents: null, amount: 150 }] };
  it("Academia A applies exactly one tier to individual and groups", () => assert.deepEqual([1, 2, 3, 4].map((count) => calculate({}, tiered, count).transferAmount), [5000, 10000, 15000, 15000]));
  it("Academia B keeps a fixed transfer for every group size", () => assert.deepEqual([1, 2, 3, 4].map((count) => calculate({}, { type: "fixed", amount: 75 }, count).transferAmount), [7500, 7500, 7500, 7500]));
  it("Academia C explicitly applies no transfer", () => assert.deepEqual([1, 2, 3, 4].map((count) => calculate({}, { type: "none" }, count).transferAmount), [0, 0, 0, 0]));
});

function pick(result) { return [result.grossRevenue, result.transferAmount, result.netAfterTransfer]; }

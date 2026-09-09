import test from "node:test";
import assert from "node:assert/strict";
import { formatMoney, parseBrazilianNumber, parsePercentage, ruleSummary, validateTiers } from "./transferRules.js";

test("formats and parses Brazilian money", () => {
  assert.equal(formatMoney(1250), "R$ 1.250,00");
  assert.equal(parseBrazilianNumber("R$ 1.250,50"), 1250.5);
  assert.equal(parseBrazilianNumber("abc"), null);
});

test("parses percentage as a whole percentage", () => {
  assert.equal(parsePercentage("20,5%"), 20.5);
  assert.equal(parsePercentage("101"), null);
});

test("blocks overlapping and multiple open-ended tiers", () => {
  const result = validateTiers([
    { minStudents: 1, maxStudents: 3, amount: "50" },
    { minStudents: 2, maxStudents: "", amount: "100" },
  ]);
  assert.ok(result.errors.some((error) => error.includes("sobrepor")));
});

test("summarizes each transfer rule", () => {
  assert.equal(ruleSummary({ type: "fixed", amount: 75 }), "R$ 75,00 por atendimento");
  assert.equal(ruleSummary({ type: "tiered", tiers: [{}, {}, {}] }), "3 faixas configuradas");
});

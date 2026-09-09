import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildServiceSummary, formatServicePrice, validateServiceForm } from "./servicesPricing.js";

describe("services pricing presentation", () => {
  it("formats monthly package with frequency, duration and one student", () => {
    const service = { price: 800, pricingModel: "MONTHLY_PACKAGE", sessionsPerWeek: 2, sessionDurationMinutes: 60, minStudents: 1, maxStudents: 1 };
    assert.equal(formatServicePrice(service), "R$ 800,00/mês");
    assert.equal(buildServiceSummary(service), "2x por semana · 60 min · 1 aluno");
  });

  it("formats group per student session with open ended capacity", () => {
    const service = { price: 60, pricingModel: "PER_STUDENT_SESSION", sessionDurationMinutes: 60, minStudents: 3, maxStudents: null };
    assert.equal(formatServicePrice(service), "R$ 60,00 por aluno/sessão");
    assert.equal(buildServiceSummary(service), "60 min · 3 ou mais alunos");
  });
});

describe("services pricing validation", () => {
  it("accepts fixed package only with package sessions", () => {
    const result = validateServiceForm({ name: "Pacote de 10 sessões", serviceType: "personal_training", pricingModel: "FIXED_PACKAGE", priceInput: "900,00", sessionsInPackage: "10", minStudents: "1", maxStudents: "1" });
    assert.deepEqual(result.errors, []);
    assert.equal(result.values.sessionsInPackage, 10);
  });

  it("rejects inverted student capacity", () => {
    const result = validateServiceForm({ name: "Grupo", serviceType: "personal_training", pricingModel: "PER_STUDENT_SESSION", priceInput: "60", minStudents: "3", maxStudents: "2" });
    assert.match(result.errors.join(" "), /máximo de alunos/i);
  });
});

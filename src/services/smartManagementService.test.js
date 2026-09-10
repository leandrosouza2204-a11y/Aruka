import assert from "node:assert/strict";
import { test } from "node:test";
import {
  normalizeSmartManagementLocation,
  requireSavedSmartManagementLocationId,
} from "../features/gestaoInteligente/utils/smartManagementLocationPersistence.js";

function locationWithRule(rule) {
  return {
    id: "location-id",
    name: "Local de teste",
    description: "",
    status: "active",
    archived_at: null,
    smart_management_transfer_rules: rule,
  };
}

test("normaliza o embed um-para-um de regra de repasse", () => {
  const location = normalizeSmartManagementLocation(
    locationWithRule({
      id: "rule-id",
      rule_type: "fixed",
      fixed_amount: "75.00",
      per_student_amount: null,
      percentage_rate: null,
      smart_management_transfer_tiers: [],
    })
  );

  assert.deepEqual(location.rule, {
    id: "rule-id",
    type: "fixed",
    amount: 75,
    tiers: [],
  });
});

test("normaliza todos os modelos persistidos e suas faixas", () => {
  const cases = [
    ["none", null, null, null, 0],
    ["per_student", null, "25.00", null, 0],
    ["percentage", null, null, "12.50", 0],
    ["tiered", null, null, null, 2],
  ];

  for (const [type, fixed, perStudent, percentage, tierCount] of cases) {
    const location = normalizeSmartManagementLocation(
      locationWithRule({
        id: `${type}-rule`,
        rule_type: type,
        fixed_amount: fixed,
        per_student_amount: perStudent,
        percentage_rate: percentage,
        smart_management_transfer_tiers: [
          { id: "tier-2", min_students: 2, max_students: null, amount: "100.00" },
          { id: "tier-1", min_students: 1, max_students: 1, amount: "50.00" },
        ].slice(0, tierCount),
      })
    );

    assert.equal(location.rule.type, type);
    assert.equal(location.rule.tiers.length, tierCount);
    if (tierCount) assert.deepEqual(location.rule.tiers.map((tier) => tier.minStudents), [1, 2]);
  }
});

test("preserva compatibilidade com embed em lista", () => {
  const location = normalizeSmartManagementLocation(
    locationWithRule([
      {
        id: "rule-id",
        rule_type: "fixed",
        fixed_amount: "50.00",
        per_student_amount: null,
        percentage_rate: null,
        smart_management_transfer_tiers: [],
      },
    ])
  );

  assert.equal(location.rule.amount, 50);
});

test("exige identificador confirmado antes de comunicar sucesso", () => {
  assert.equal(requireSavedSmartManagementLocationId([{ location_id: "location-id" }]), "location-id");
  assert.equal(requireSavedSmartManagementLocationId({ location_id: "location-id" }), "location-id");
  assert.throws(() => requireSavedSmartManagementLocationId([]), /did not return a location id/);
});

export function normalizeSmartManagementLocation(row) {
  const embeddedRule = row.smart_management_transfer_rules;
  const ruleRow = Array.isArray(embeddedRule) ? embeddedRule[0] : embeddedRule || null;
  const amount = ruleRow?.fixed_amount ?? ruleRow?.per_student_amount ?? ruleRow?.percentage_rate ?? null;

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    status: row.status,
    archivedAt: row.archived_at,
    rule: ruleRow
      ? {
          id: ruleRow.id,
          type: ruleRow.rule_type,
          amount: amount === null ? null : Number(amount),
          tiers: (ruleRow.smart_management_transfer_tiers || [])
            .map((tier) => ({
              id: tier.id,
              minStudents: tier.min_students,
              maxStudents: tier.max_students,
              amount: Number(tier.amount),
            }))
            .sort((a, b) => a.minStudents - b.minStudents),
        }
      : null,
  };
}

export function requireSavedSmartManagementLocationId(data) {
  const locationId = Array.isArray(data) ? data[0]?.location_id : data?.location_id;
  if (!locationId) {
    throw new Error("Smart management location save did not return a location id.");
  }
  return locationId;
}

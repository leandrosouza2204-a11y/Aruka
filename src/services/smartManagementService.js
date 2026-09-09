import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function listSmartManagementLocations(status = "active") {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase
    .from("smart_management_locations")
    .select("id,name,description,status,archived_at,created_at,smart_management_transfer_rules(id,rule_type,fixed_amount,per_student_amount,percentage_rate,smart_management_transfer_tiers(id,min_students,max_students,amount))")
    .eq("professional_id", user.id)
    .eq("status", status)
    .order("name");
  if (error) throw error;
  return (data || []).map(toLocation);
}

export async function saveSmartManagementLocation(form) {
  const { data, error } = await supabase.rpc("save_smart_management_location", {
    p_location_id: form.id || null,
    p_name: form.name.trim(),
    p_description: form.description.trim(),
    p_rule_type: form.ruleType,
    p_amount: form.amount,
    p_tiers: form.tiers.map((tier) => ({ minStudents: tier.minStudents, maxStudents: tier.maxStudents ?? "", amount: tier.amount })),
  });
  if (error) throw error;
  return data?.[0]?.location_id;
}

export async function updateSmartManagementLocationStatus(id, status) {
  const { error } = await supabase
    .from("smart_management_locations")
    .update({ status, archived_at: status === "archived" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

function toLocation(row) {
  const ruleRow = row.smart_management_transfer_rules?.[0];
  const amount = ruleRow?.fixed_amount ?? ruleRow?.per_student_amount ?? ruleRow?.percentage_rate ?? null;
  return {
    id: row.id, name: row.name, description: row.description || "", status: row.status, archivedAt: row.archived_at,
    rule: ruleRow ? { id: ruleRow.id, type: ruleRow.rule_type, amount: amount === null ? null : Number(amount), tiers: (ruleRow.smart_management_transfer_tiers || []).map((tier) => ({ id: tier.id, minStudents: tier.min_students, maxStudents: tier.max_students, amount: Number(tier.amount) })).sort((a, b) => a.minStudents - b.minStudents) } : null,
  };
}

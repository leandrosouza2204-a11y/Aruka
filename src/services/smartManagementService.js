import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";
import {
  normalizeSmartManagementLocation,
  requireDeletedSmartManagementRecordId,
  requireSavedSmartManagementLocationId,
} from "../features/gestaoInteligente/utils/smartManagementLocationPersistence";

export async function listSmartManagementLocations(status = "active") {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase
    .from("smart_management_locations")
    .select("id,name,description,status,archived_at,created_at,smart_management_transfer_rules(id,rule_type,fixed_amount,per_student_amount,percentage_rate,smart_management_transfer_tiers(id,min_students,max_students,amount))")
    .eq("professional_id", user.id)
    .eq("status", status)
    .order("name");
  if (error) throw error;
  return (data || []).map(normalizeSmartManagementLocation);
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

  return requireSavedSmartManagementLocationId(data);
}

export async function updateSmartManagementLocationStatus(id, status) {
  const { error } = await supabase
    .from("smart_management_locations")
    .update({ status, archived_at: status === "archived" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSmartManagementLocation(id) {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from("smart_management_locations").delete().eq("id", id).eq("professional_id", user.id).select("id").maybeSingle();
  if (error) throw error;
  return requireDeletedSmartManagementRecordId(data, "location");
}

export async function listSmartManagementServices(status = "active") {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase
    .from("smart_management_services")
    .select("id,name,description,service_type,pricing_model,price,sessions_per_week,sessions_per_month,sessions_in_package,session_duration_minutes,min_students,max_students,status,archived_at,created_at")
    .eq("professional_id", user.id)
    .eq("status", status)
    .order("name");
  if (error) throw error;
  return (data || []).map(toService);
}

export async function getSmartManagementDashboardSummary() {
  const user = await buscarUsuarioLogado();
  const [locationsResult, servicesResult] = await Promise.all([
    supabase
      .from("smart_management_locations")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id)
      .eq("status", "active"),
    supabase
      .from("smart_management_services")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id)
      .eq("status", "active"),
  ]);

  if (locationsResult.error) throw locationsResult.error;
  if (servicesResult.error) throw servicesResult.error;

  return {
    activeLocationsCount: locationsResult.count || 0,
    activeServicesCount: servicesResult.count || 0,
  };
}

export async function saveSmartManagementService(form) {
  const { data, error } = await supabase.rpc("save_smart_management_service", {
    p_service_id: form.id || null,
    p_name: form.name.trim(),
    p_description: form.description.trim(),
    p_service_type: form.serviceType,
    p_pricing_model: form.pricingModel,
    p_price: form.price,
    p_sessions_per_week: form.sessionsPerWeek || null,
    p_sessions_per_month: form.sessionsPerMonth || null,
    p_sessions_in_package: form.sessionsInPackage || null,
    p_session_duration_minutes: form.sessionDurationMinutes || null,
    p_min_students: form.minStudents,
    p_max_students: form.maxStudents || null,
  });
  if (error) throw error;
  return data?.[0]?.service_id;
}

export async function updateSmartManagementServiceStatus(id, status) {
  const { error } = await supabase
    .from("smart_management_services")
    .update({ status, archived_at: status === "archived" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSmartManagementService(id) {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from("smart_management_services").delete().eq("id", id).eq("professional_id", user.id).select("id").maybeSingle();
  if (error) throw error;
  return requireDeletedSmartManagementRecordId(data, "service");
}

function toService(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    serviceType: row.service_type,
    pricingModel: row.pricing_model,
    price: Number(row.price || 0),
    sessionsPerWeek: row.sessions_per_week,
    sessionsPerMonth: row.sessions_per_month,
    sessionsInPackage: row.sessions_in_package,
    sessionDurationMinutes: row.session_duration_minutes,
    minStudents: row.min_students,
    maxStudents: row.max_students,
    status: row.status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
  };
}

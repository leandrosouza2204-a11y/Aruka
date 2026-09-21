import { normalizeContactSettingsPayload } from "../features/contactSettings/contactSettings.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { supabase } from "./supabase.js";

export async function buscarMinhaConfiguracaoContato() {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_professional_contact_settings");
  if (error) throw safeContactError("CONTACT_SETTINGS_LOAD_FAILED", error);
  return normalizeContactSettingsPayload(data || {});
}

export async function salvarMinhaConfiguracaoContato(settings) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("save_my_professional_contact_settings", {
    p_whatsapp_enabled: settings.whatsappEnabled,
    p_whatsapp_number: settings.whatsappNumber || null,
    p_email_enabled: settings.emailEnabled,
    p_contact_email: settings.contactEmail || null,
  });
  if (error) throw safeContactError("CONTACT_SETTINGS_SAVE_FAILED", error);
  return normalizeContactSettingsPayload(data || {});
}

function safeContactError(code, cause) {
  const error = new Error("Não foi possível salvar os canais de atendimento agora.");
  error.code = code;
  error.cause = cause;
  return error;
}

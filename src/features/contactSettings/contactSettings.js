export const EMPTY_CONTACT_SETTINGS = Object.freeze({
  whatsappEnabled: false,
  whatsappNumber: "",
  emailEnabled: false,
  contactEmail: "",
});

export function normalizeWhatsAppNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/[a-z]/i.test(raw)) return "";

  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  if (!/^[1-9]\d{9,14}$/.test(digits)) return "";

  if (digits.startsWith("55")) {
    if (!/^55[1-9][1-9]\d{8,9}$/.test(digits)) return "";
  }

  return digits;
}

export function normalizeContactEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidContactEmail(value) {
  const email = normalizeContactEmail(value);
  return email.length > 0 && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactSettings(settings = {}) {
  const whatsappNumber = normalizeWhatsAppNumber(settings.whatsappNumber);
  const contactEmail = normalizeContactEmail(settings.contactEmail);
  const errors = {};

  if (String(settings.whatsappNumber || "").trim() && !whatsappNumber) {
    errors.whatsappNumber = "Informe um número válido com DDD ou código do país.";
  } else if (settings.whatsappEnabled && !whatsappNumber) {
    errors.whatsappNumber = "Informe um WhatsApp válido para habilitar este canal.";
  }

  if (contactEmail && !isValidContactEmail(contactEmail)) {
    errors.contactEmail = "Informe um e-mail válido com até 254 caracteres.";
  } else if (settings.emailEnabled && !contactEmail) {
    errors.contactEmail = "Informe um e-mail válido para habilitar este canal.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      whatsappEnabled: Boolean(settings.whatsappEnabled),
      whatsappNumber,
      emailEnabled: Boolean(settings.emailEnabled),
      contactEmail,
    },
  };
}

export function normalizeContactSettingsPayload(payload = {}) {
  return {
    whatsappEnabled: Boolean(payload.whatsappEnabled ?? payload.whatsapp_enabled),
    whatsappNumber: String(payload.whatsappNumber ?? payload.whatsapp_number ?? ""),
    emailEnabled: Boolean(payload.emailEnabled ?? payload.email_enabled),
    contactEmail: String(payload.contactEmail ?? payload.contact_email ?? ""),
  };
}

export function normalizeStudentProfileV2Payload(payload = {}, accountEmail = "") {
  const professional = payload.professional || {};
  const whatsappNumber = String(professional.whatsappNumber ?? professional.whatsapp_number ?? "");
  const contactEmail = String(professional.contactEmail ?? professional.contact_email ?? "");
  return {
    student: {
      name: String(payload.student?.name || payload.student?.nome || "Aluno"),
      email: String(accountEmail || ""),
    },
    professional: {
      name: String(professional.name || professional.nome || "").trim() || "Seu profissional",
      whatsappNumber,
      contactEmail,
      whatsappUrl: whatsappNumber ? `https://wa.me/${encodeURIComponent(whatsappNumber)}` : "",
      emailUrl: contactEmail ? `mailto:${encodeURIComponent(contactEmail)}` : "",
    },
  };
}

export function hasStudentSupportChannels(profile) {
  return Boolean(profile?.professional?.whatsappUrl || profile?.professional?.emailUrl);
}

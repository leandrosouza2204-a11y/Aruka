import assert from "node:assert/strict";
import test from "node:test";
import { hasStudentSupportChannels, normalizeStudentProfileV2Payload } from "./studentProfileV2.js";

test("profile uses the authenticated account email and neutral professional fallback", () => {
  const profile = normalizeStudentProfileV2Payload({ student: { name: "Ana" }, professional: {} }, "ana@example.com");
  assert.equal(profile.student.email, "ana@example.com");
  assert.equal(profile.professional.name, "Seu profissional");
  assert.equal(hasStudentSupportChannels(profile), false);
});

test("profile exposes only channels present in the minimized payload", () => {
  const whatsapp = normalizeStudentProfileV2Payload({ professional: { whatsappNumber: "5511999991234" } });
  assert.equal(whatsapp.professional.whatsappUrl, "https://wa.me/5511999991234");
  assert.equal(whatsapp.professional.emailUrl, "");
  const both = normalizeStudentProfileV2Payload({ professional: { whatsappNumber: "14155552671", contactEmail: "help@example.com" } });
  assert.equal(hasStudentSupportChannels(both), true);
  assert.equal(both.professional.emailUrl, "mailto:help%40example.com");
});

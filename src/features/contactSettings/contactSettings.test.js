import assert from "node:assert/strict";
import test from "node:test";
import { EMPTY_CONTACT_SETTINGS, normalizeWhatsAppNumber, validateContactSettings } from "./contactSettings.js";

test("contact channels start disabled and may remain disabled", () => {
  assert.equal(validateContactSettings(EMPTY_CONTACT_SETTINGS).valid, true);
});

test("Brazilian WhatsApp input is normalized to international digits", () => {
  assert.equal(normalizeWhatsAppNumber("(11) 99999-1234"), "5511999991234");
  assert.equal(normalizeWhatsAppNumber("+55 11 99999-1234"), "5511999991234");
});

test("enabled channels require valid values", () => {
  const invalid = validateContactSettings({ whatsappEnabled: true, emailEnabled: true });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.whatsappNumber);
  assert.ok(invalid.errors.contactEmail);
});

test("supports only WhatsApp, only email, both, and stored disabled values", () => {
  const cases = [
    { whatsappEnabled: true, whatsappNumber: "11999991234" },
    { emailEnabled: true, contactEmail: " suporte@example.com " },
    { whatsappEnabled: true, whatsappNumber: "+1 415 555 2671", emailEnabled: true, contactEmail: "help@example.com" },
    { whatsappEnabled: false, whatsappNumber: "11999991234", emailEnabled: false, contactEmail: "help@example.com" },
  ];
  for (const value of cases) assert.equal(validateContactSettings(value).valid, true);
});

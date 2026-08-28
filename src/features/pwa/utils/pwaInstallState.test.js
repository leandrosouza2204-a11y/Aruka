import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PWA_INSTALL_DISMISSED_AT_KEY,
  PWA_INSTALL_DISMISSAL_DAYS,
  canShowIosInstallGuide,
  clearInstallDismissal,
  getInstallPromptCopy,
  isIosDevice,
  isIosSafari,
  isStandaloneMode,
  markInstallDismissed,
  readInstallDismissal,
  shouldShowInstallPrompt,
} from "./pwaInstallState.js";

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("detecta standalone por display-mode e navigator standalone", () => {
  assert.equal(
    isStandaloneMode({ matchMedia: () => ({ matches: true }), navigator: {} }),
    true
  );
  assert.equal(
    isStandaloneMode({ matchMedia: () => ({ matches: false }), navigator: { standalone: true } }),
    true
  );
  assert.equal(
    isStandaloneMode({ matchMedia: () => ({ matches: false }), navigator: {} }),
    false
  );
});

test("detecta iOS Safari sem aceitar browsers iOS alternativos", () => {
  const safari = {
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari",
      platform: "iPhone",
    },
  };
  const chrome = {
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS Safari",
      platform: "iPhone",
    },
  };

  assert.equal(isIosDevice(safari), true);
  assert.equal(isIosSafari(safari), true);
  assert.equal(isIosSafari(chrome), false);
  assert.equal(canShowIosInstallGuide({ ...safari, matchMedia: () => ({ matches: false }) }), true);
});

test("copy de instalacao separa profissional e aluno", () => {
  const professional = getInstallPromptCopy("professional");
  const student = getInstallPromptCopy("student");

  assert.match(professional.description, /gestão dos seus alunos/);
  assert.doesNotMatch(professional.description, /timer/);
  assert.match(student.description, /treinos, histórico, vídeos e timer/);
  assert.doesNotMatch(student.description, /gestão dos seus alunos/);
});

test("dismissal usa janela de 14 dias em storage local", () => {
  const local = storage();
  const now = Date.UTC(2026, 7, 28);
  markInstallDismissed(local, now);

  assert.equal(local.getItem(PWA_INSTALL_DISMISSED_AT_KEY), String(now));
  assert.equal(readInstallDismissal(local, now + 13 * 24 * 60 * 60 * 1000).active, true);
  assert.equal(
    readInstallDismissal(local, now + (PWA_INSTALL_DISMISSAL_DAYS + 1) * 24 * 60 * 60 * 1000)
      .active,
    false
  );

  clearInstallDismissal(local);
  assert.equal(readInstallDismissal(local, now).active, false);
});

test("elegibilidade bloqueia login, standalone, dismissal e browser sem suporte", () => {
  const base = {
    role: "professional",
    isAuthenticatedHomeReady: true,
    isStandalone: false,
    hasDeferredPrompt: true,
    canShowIosGuide: false,
    dismissed: false,
  };

  assert.equal(shouldShowInstallPrompt(base), true);
  assert.equal(shouldShowInstallPrompt({ ...base, role: null }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, isAuthenticatedHomeReady: false }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, isStandalone: true }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, dismissed: true }), false);
  assert.equal(
    shouldShowInstallPrompt({ ...base, hasDeferredPrompt: false, canShowIosGuide: false }),
    false
  );
  assert.equal(
    shouldShowInstallPrompt({ ...base, hasDeferredPrompt: false, canShowIosGuide: true }),
    true
  );
});

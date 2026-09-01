import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PWA_INSTALL_HIDE_BANNER_KEY,
  canShowInstallMenuItem,
  canShowIosInstallGuide,
  clearInstallBannerHidden,
  getInstallGuidanceCopy,
  getInstallPlatform,
  getInstallPromptCopy,
  isIosDevice,
  isIosSafari,
  isMobileViewport,
  isStandaloneMode,
  markInstallBannerHidden,
  readInstallHidePreference,
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

test("detecta viewport mobile por media query", () => {
  assert.equal(isMobileViewport({ matchMedia: () => ({ matches: true }) }), true);
  assert.equal(isMobileViewport({ matchMedia: () => ({ matches: false }) }), false);
  assert.equal(isMobileViewport({ matchMedia: null }), false);
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

  assert.match(professional.description, /alunos e treinos/);
  assert.doesNotMatch(professional.description, /timer/);
  assert.match(student.description, /treinos, histórico, vídeos e timer/);
  assert.doesNotMatch(student.description, /gestão dos seus alunos/);
});

test("preferencia explicita de ocultar banner usa storage local", () => {
  const local = storage();
  markInstallBannerHidden(local);

  assert.equal(local.getItem(PWA_INSTALL_HIDE_BANNER_KEY), "true");
  assert.equal(readInstallHidePreference(local), true);
  assert.equal(readInstallHidePreference({ getItem: () => "invalid" }), false);
  assert.equal(readInstallHidePreference(null), false);

  clearInstallBannerHidden(local);
  assert.equal(readInstallHidePreference(local), false);
});

test("elegibilidade bloqueia login, desktop, standalone, preferencia e browser sem suporte", () => {
  const base = {
    role: "professional",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: false,
    hideBanner: false,
    bannerClosed: false,
  };

  assert.equal(shouldShowInstallPrompt(base), true);
  assert.equal(shouldShowInstallPrompt({ ...base, role: null }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, isAuthenticatedHomeReady: false }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, isMobile: false }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, isStandalone: true }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, hideBanner: true }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, bannerClosed: true }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, hasDeferredPrompt: false }), true);
});

test("menu de instalacao independe da preferencia do banner e bloqueia standalone", () => {
  assert.equal(
    canShowInstallMenuItem({ isMobile: true, isStandalone: false, hasDeferredPrompt: true }),
    true
  );
  assert.equal(
    canShowInstallMenuItem({ isMobile: true, isStandalone: true, hasDeferredPrompt: true }),
    false
  );
  assert.equal(
    canShowInstallMenuItem({ isMobile: true, isStandalone: false, hasDeferredPrompt: false }),
    true
  );
  assert.equal(
    canShowInstallMenuItem({ isMobile: false, isStandalone: false, hasDeferredPrompt: true }),
    false
  );
});

test("classifica iOS Safari, iOS browser e iPadOS moderno", () => {
  const safari = {
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari",
      platform: "iPhone",
      maxTouchPoints: 5,
    },
  };
  const chrome = {
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS Safari",
      platform: "iPhone",
      maxTouchPoints: 5,
    },
  };
  const ipad = {
    navigator: {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit Safari",
      platform: "MacIntel",
      maxTouchPoints: 5,
    },
  };

  assert.equal(getInstallPlatform(safari), "ios-safari");
  assert.equal(getInstallPlatform(chrome), "ios-browser");
  assert.equal(getInstallPlatform(ipad), "ios-safari");
});

test("copy de banner iOS orienta instalacao manual", () => {
  const copy = getInstallPromptCopy("professional", { platform: "ios-safari" });

  assert.equal(copy.title, "Instale o Aruka no seu iPhone");
  assert.equal(copy.actionLabel, "Como instalar");
  assert.equal(copy.laterLabel, "Agora nao");
  assert.match(copy.description, /Tela de Inicio/);
});

test("orientacao iOS Safari e navegador alternativo usam fluxo manual seguro", () => {
  const safari = getInstallGuidanceCopy("ios-safari");
  const other = getInstallGuidanceCopy("ios-browser");
  const android = getInstallGuidanceCopy("android");

  assert.equal(safari.title, "Instalar o Aruka");
  assert.match(safari.steps.join(" "), /Compartilhar do Safari/);
  assert.match(safari.steps.join(" "), /Adicionar a Tela de Inicio/);
  assert.equal(other.title, "Instalar o Aruka no iPhone");
  assert.match(other.description, /abra esta pagina no Safari/);
  assert.match(android.steps.join(" "), /Chrome/);
});

test("iOS sem beforeinstallprompt continua elegivel fora de standalone", () => {
  const base = {
    role: "professional",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: false,
    hideBanner: false,
    bannerClosed: false,
    hasDeferredPrompt: false,
  };

  assert.equal(shouldShowInstallPrompt(base), true);
  assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: false }), true);
  assert.equal(shouldShowInstallPrompt({ ...base, isStandalone: true }), false);
  assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: true }), false);
  assert.equal(shouldShowInstallPrompt({ ...base, hideBanner: true }), false);
  assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: false, hideBanner: true }), true);
});

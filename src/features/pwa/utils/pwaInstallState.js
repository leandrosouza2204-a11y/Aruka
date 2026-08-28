export const PWA_INSTALL_DISMISSED_AT_KEY = "aruka:pwaInstallDismissedAt:v1";
export const PWA_INSTALL_DISMISSAL_DAYS = 14;
export const PWA_INSTALL_PROMPT_DELAY_MS = 1600;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isStandaloneMode({ matchMedia, navigator } = getBrowserEnv()) {
  const displayStandalone = Boolean(
    matchMedia?.("(display-mode: standalone)")?.matches
  );
  return displayStandalone || Boolean(navigator?.standalone);
}

export function isIosDevice({ navigator } = getBrowserEnv()) {
  const userAgent = navigator?.userAgent || "";
  const platform = navigator?.platform || "";
  const maxTouchPoints = Number(navigator?.maxTouchPoints || 0);

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

export function isIosSafari(env = getBrowserEnv()) {
  const userAgent = env.navigator?.userAgent || "";
  if (!isIosDevice(env)) return false;
  return /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
}

export function canShowIosInstallGuide(env = getBrowserEnv()) {
  return isIosSafari(env) && !isStandaloneMode(env);
}

export function getInstallPromptCopy(role) {
  if (role === "student") {
    return {
      title: "Instale o Aruka no seu celular",
      description:
        "Acesse seus treinos, histórico, vídeos e timer diretamente pela tela inicial.",
      actionLabel: "Instalar",
      laterLabel: "Agora nao",
      iosActionLabel: "Entendi",
      iosDescription:
        "Para instalar o Aruka no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início.",
    };
  }

  return {
    title: "Instale o Aruka no seu dispositivo",
    description:
      "Tenha acesso mais rápido à gestão dos seus alunos, treinos e acompanhamento.",
    actionLabel: "Instalar",
    laterLabel: "Agora nao",
    iosActionLabel: "Entendi",
    iosDescription:
      "Para instalar o Aruka no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início.",
  };
}

export function readInstallDismissal(storage, now = Date.now()) {
  const dismissedAt = Number(storage?.getItem?.(PWA_INSTALL_DISMISSED_AT_KEY));
  if (!Number.isFinite(dismissedAt) || dismissedAt <= 0) {
    return { dismissedAt: null, active: false, expiresAt: null };
  }

  const expiresAt = dismissedAt + PWA_INSTALL_DISMISSAL_DAYS * DAY_MS;
  return {
    dismissedAt,
    active: now < expiresAt,
    expiresAt,
  };
}

export function markInstallDismissed(storage, now = Date.now()) {
  storage?.setItem?.(PWA_INSTALL_DISMISSED_AT_KEY, String(now));
}

export function clearInstallDismissal(storage) {
  storage?.removeItem?.(PWA_INSTALL_DISMISSED_AT_KEY);
}

export function shouldShowInstallPrompt({
  role,
  isAuthenticatedHomeReady,
  isStandalone,
  hasDeferredPrompt,
  canShowIosGuide,
  dismissed,
  updatePromptVisible = false,
} = {}) {
  if (!role) return false;
  if (!isAuthenticatedHomeReady) return false;
  if (isStandalone) return false;
  if (dismissed) return false;
  if (updatePromptVisible) return false;
  return Boolean(hasDeferredPrompt || canShowIosGuide);
}

export function getBrowserEnv() {
  if (typeof window === "undefined") {
    return { matchMedia: null, navigator: null };
  }

  return {
    matchMedia: window.matchMedia?.bind(window),
    navigator: window.navigator,
  };
}

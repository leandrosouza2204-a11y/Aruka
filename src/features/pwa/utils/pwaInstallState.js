export const PWA_INSTALL_HIDE_BANNER_KEY = "aruka_pwa_install_hide_banner";
export const PWA_INSTALL_PROMPT_DELAY_MS = 3000;
export const PWA_INSTALL_MOBILE_QUERY = "(max-width: 767px)";

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

export function getInstallPlatform(env = getBrowserEnv()) {
  if (isIosDevice(env)) return isIosSafari(env) ? "ios-safari" : "ios-browser";
  return "android";
}

export function isMobileViewport({ matchMedia } = getBrowserEnv()) {
  return Boolean(matchMedia?.(PWA_INSTALL_MOBILE_QUERY)?.matches);
}

export function getInstallPromptCopy(role, { platform = "android" } = {}) {
  if (platform === "ios-safari" || platform === "ios-browser") {
    return {
      title: "Instale o Aruka no seu iPhone",
      description:
        "Adicione o Aruka a Tela de Inicio para acessar o sistema como um aplicativo.",
      actionLabel: "Como instalar",
      laterLabel: "Agora nao",
    };
  }

  if (role === "student") {
    return {
      title: "Instale o Aruka no seu celular",
      description:
        "Acesse seus treinos, histórico, vídeos e timer diretamente pela tela inicial.",
      actionLabel: "Instalar aplicativo",
      laterLabel: "Agora nao",
      iosActionLabel: "Entendi",
      iosDescription:
        "Para instalar o Aruka no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início.",
    };
  }

  return {
    title: "Instale o Aruka no seu celular",
    description:
      "Tenha acesso mais rápido aos seus alunos e treinos, direto pela tela inicial.",
    actionLabel: "Instalar aplicativo",
    laterLabel: "Agora nao",
    iosActionLabel: "Entendi",
    iosDescription:
      "Para instalar o Aruka no iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início.",
  };
}

export function readInstallHidePreference(storage) {
  return storage?.getItem?.(PWA_INSTALL_HIDE_BANNER_KEY) === "true";
}

export function getInstallGuidanceCopy(platform = "android") {
  if (platform === "ios-safari") {
    return {
      title: "Instalar o Aruka",
      description:
        "Adicione o Aruka a Tela de Inicio para acessar o sistema como um aplicativo.",
      steps: [
        "Toque no botao Compartilhar do Safari.",
        "Role as opcoes e toque em \"Adicionar a Tela de Inicio\".",
        "Toque em \"Adicionar\".",
      ],
      finalMessage: "O Aruka ficara disponivel junto aos seus aplicativos.",
      actionLabel: "Entendi",
    };
  }

  if (platform === "ios-browser") {
    return {
      title: "Instalar o Aruka no iPhone",
      description: "Para adicionar o Aruka a Tela de Inicio, abra esta pagina no Safari.",
      steps: [
        "Copie ou abra este endereco no Safari.",
        "Toque em Compartilhar.",
        "Escolha \"Adicionar a Tela de Inicio\".",
        "Toque em \"Adicionar\".",
      ],
      finalMessage: "O Safari oferece o caminho mais confiavel para instalar o Aruka no iPhone.",
      actionLabel: "Entendi",
    };
  }

  return {
    title: "Instalar o Aruka",
    description: "Instale o Aruka na tela inicial para acessar o sistema como um aplicativo.",
    steps: [
      "Toque nos tres pontos (⋮) do Chrome.",
      "Selecione \"Instalar e criar atalho\".",
      "Toque em \"Instalar\".",
    ],
    finalMessage: "Depois disso, o Aruka ficara disponivel na sua tela inicial.",
    actionLabel: "Entendi",
  };
}

export function markInstallBannerHidden(storage) {
  storage?.setItem?.(PWA_INSTALL_HIDE_BANNER_KEY, "true");
}

export function clearInstallBannerHidden(storage) {
  storage?.removeItem?.(PWA_INSTALL_HIDE_BANNER_KEY);
}

export function shouldShowInstallPrompt({
  role,
  isAuthenticatedHomeReady,
  isMobile,
  isStandalone,
  hideBanner,
  bannerClosed,
  updatePromptVisible = false,
} = {}) {
  if (!role) return false;
  if (!isAuthenticatedHomeReady) return false;
  if (!isMobile) return false;
  if (isStandalone) return false;
  if (hideBanner) return false;
  if (bannerClosed) return false;
  if (updatePromptVisible) return false;
  return true;
}

export function canShowInstallMenuItem({
  isMobile,
  isStandalone,
} = {}) {
  if (!isMobile) return false;
  if (isStandalone) return false;
  return true;
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

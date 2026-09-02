import { useEffect, useRef, useState } from "react";
import { Download, RefreshCcw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  PWA_INSTALL_PROMPT_DELAY_MS,
  canShowInstallMenuItem,
  clearInstallBannerHidden,
  getInstallPromptCopy,
  isMobileViewport,
  isStandaloneMode,
  markInstallBannerHidden,
  readInstallHidePreference,
  shouldShowInstallPrompt,
} from "./utils/pwaInstallState";
import { PwaInstallContext } from "./PwaInstallContext";
import { getUpdatePromptCopy, shouldShowUpdatePrompt } from "./utils/pwaUpdateState";

function getLocalStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function PwaExperienceManager({ role, activeWorkout = false, children = null }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [standalone, setStandalone] = useState(() => isStandaloneMode());
  const [installedThisSession, setInstalledThisSession] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [mobileViewport, setMobileViewport] = useState(() => isMobileViewport());
  const [hideBanner, setHideBanner] = useState(() =>
    readInstallHidePreference(getLocalStorage())
  );
  const [hideBannerChecked, setHideBannerChecked] = useState(false);
  const [readyForInstallCheck, setReadyForInstallCheck] = useState(false);
  const [installClosed, setInstallClosed] = useState(false);
  const [installGuidanceOpen, setInstallGuidanceOpen] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const installActionRef = useRef(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered() {},
    onRegisterError(error) {
      console.error("Não foi possível registrar o service worker do PWA.", error);
    },
  });

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setReadyForInstallCheck(true);
    }, PWA_INSTALL_PROMPT_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [role]);

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstallAvailable(true);
      setInstallClosed(false);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setInstallAvailable(false);
      setInstalledThisSession(true);
      setInstallClosed(true);
      setInstallGuidanceOpen(false);
      setHideBanner(false);
      clearInstallBannerHidden(getLocalStorage());
    }

    function syncStandalone() {
      setStandalone(isStandaloneMode());
    }

    function syncViewport() {
      setMobileViewport(isMobileViewport());
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("focus", syncStandalone);
    document.addEventListener("visibilitychange", syncStandalone);

    const media = window.matchMedia?.("(display-mode: standalone)");
    media?.addEventListener?.("change", syncStandalone);
    const mobileMedia = window.matchMedia?.("(max-width: 767px)");
    mobileMedia?.addEventListener?.("change", syncViewport);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("focus", syncStandalone);
      document.removeEventListener("visibilitychange", syncStandalone);
      media?.removeEventListener?.("change", syncStandalone);
      mobileMedia?.removeEventListener?.("change", syncViewport);
    };
  }, []);

  const updateVisible = shouldShowUpdatePrompt({
    hasWaitingWorker: needRefresh,
    activeWorkout,
    updateDismissed,
  });
  const installVisible =
    !installClosed &&
    !installedThisSession &&
    shouldShowInstallPrompt({
      role,
      isAuthenticatedHomeReady: readyForInstallCheck,
      isMobile: mobileViewport,
      isStandalone: standalone,
      hasDeferredPrompt: installAvailable && Boolean(deferredPrompt),
      hideBanner,
      bannerClosed: installClosed,
      updatePromptVisible: updateVisible,
    });
  const showInstallOption = canShowInstallMenuItem({
    isStandalone: standalone || installedThisSession,
    isMobile: mobileViewport,
  });

  async function requestPwaInstall() {
    if (standalone || installedThisSession || !mobileViewport) return;

    if (!deferredPrompt) {
      setInstallGuidanceOpen(true);
      setInstallClosed(true);
      return;
    }

    const promptEvent = deferredPrompt;
    setDeferredPrompt(null);
    setInstallAvailable(false);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === "accepted") {
        setInstalledThisSession(true);
        setInstallClosed(true);
      } else {
        setInstallClosed(true);
      }
    } catch {
      setInstallClosed(true);
    }
  }

  function dismissInstall() {
    if (hideBannerChecked) {
      markInstallBannerHidden(getLocalStorage());
      setHideBanner(true);
    }
    setInstallClosed(true);
  }

  function closeInstall() {
    dismissInstall();
  }

  function updateNow() {
    updateServiceWorker(true);
  }

  const contextValue = {
    showInstallOption,
    canNativePrompt: installAvailable && Boolean(deferredPrompt),
    isStandalone: standalone || installedThisSession,
    installGuidanceOpen,
    openInstallGuidance: () => setInstallGuidanceOpen(true),
    closeInstallGuidance: () => setInstallGuidanceOpen(false),
    requestInstall: requestPwaInstall,
  };
  let panel = null;

  if (updateVisible) {
    const copy = getUpdatePromptCopy();
    panel = (
      <PwaPanel
        icon={<RefreshCcw size={18} aria-hidden="true" />}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.actionLabel}
        laterLabel={copy.laterLabel}
        onAction={updateNow}
        onDismiss={() => setUpdateDismissed(true)}
      />
    );
  } else if (installVisible) {
    const copy = getInstallPromptCopy(role);

    panel = (
      <PwaPanel
        icon={<Download size={18} aria-hidden="true" />}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.actionLabel}
        laterLabel={copy.laterLabel}
        onAction={requestPwaInstall}
        onDismiss={closeInstall}
        actionRef={installActionRef}
        hideBannerChecked={hideBannerChecked}
        onHideBannerChange={setHideBannerChecked}
      />
    );
  }

  return (
    <PwaInstallContext.Provider value={contextValue}>
      {children}
      {panel}
      {installGuidanceOpen && (
        <PwaInstallGuidance onClose={() => setInstallGuidanceOpen(false)} />
      )}
    </PwaInstallContext.Provider>
  );
}

function PwaPanel({
  icon,
  title,
  description,
  actionLabel,
  laterLabel,
  onAction,
  onDismiss,
  actionRef,
  hideBannerChecked = false,
  onHideBannerChange,
}) {
  const hasHideBannerOption = typeof onHideBannerChange === "function";

  return (
    <section
      className="pwa-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="pwa-panel-title"
      aria-describedby="pwa-panel-description"
      data-testid="pwa-install-prompt"
    >
      <div className="pwa-panel-icon">{icon}</div>
      <div className="pwa-panel-copy">
        <h2 id="pwa-panel-title">{title}</h2>
        <p id="pwa-panel-description">{description}</p>
      </div>
      <div className="pwa-panel-actions">
        <button ref={actionRef} className="pwa-panel-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
        <button className="pwa-panel-secondary" type="button" onClick={onDismiss}>
          {laterLabel}
        </button>
      </div>
      {hasHideBannerOption && (
        <label className="pwa-panel-preference">
          <input
            checked={hideBannerChecked}
            onChange={(event) => onHideBannerChange(event.target.checked)}
            type="checkbox"
          />
          <span>Nao mostrar novamente</span>
        </label>
      )}
      <button className="pwa-panel-close" type="button" onClick={onDismiss} aria-label="Fechar sugestão">
        <X size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

function PwaInstallGuidance({ onClose }) {
  return (
    <div className="pwa-guidance-overlay" role="presentation">
      <section
        aria-labelledby="pwa-guidance-title"
        aria-modal="true"
        className="pwa-guidance-panel"
        role="dialog"
      >
        <button
          className="pwa-panel-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar orientacao de instalacao"
        >
          <X size={16} aria-hidden="true" />
        </button>
        <div className="pwa-panel-icon">
          <Download size={18} aria-hidden="true" />
        </div>
        <div className="pwa-guidance-copy">
          <h2 id="pwa-guidance-title">Instalar o Aruka</h2>
          <p>Instale o Aruka na tela inicial para acessar o sistema como um aplicativo.</p>
          <ol>
            <li>Toque nos tres pontos (⋮) do Chrome.</li>
            <li>Selecione "Instalar e criar atalho".</li>
            <li>Toque em "Instalar".</li>
          </ol>
          <p>Depois disso, o Aruka ficara disponivel na sua tela inicial.</p>
        </div>
        <button className="pwa-panel-primary" type="button" onClick={onClose}>
          Entendi
        </button>
      </section>
    </div>
  );
}

export default PwaExperienceManager;

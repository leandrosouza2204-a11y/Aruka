import { useEffect, useRef, useState } from "react";
import { Download, RefreshCcw, Share2, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  PWA_INSTALL_PROMPT_DELAY_MS,
  canShowIosInstallGuide,
  clearInstallDismissal,
  getInstallPromptCopy,
  isStandaloneMode,
  markInstallDismissed,
  readInstallDismissal,
  shouldShowInstallPrompt,
} from "./utils/pwaInstallState";
import { getUpdatePromptCopy, shouldShowUpdatePrompt } from "./utils/pwaUpdateState";

function PwaExperienceManager({ role, activeWorkout = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [standalone, setStandalone] = useState(() => isStandaloneMode());
  const [installedThisSession, setInstalledThisSession] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    readInstallDismissal(window.localStorage).active
  );
  const [readyForInstallCheck, setReadyForInstallCheck] = useState(false);
  const [installClosed, setInstallClosed] = useState(false);
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
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setInstalledThisSession(true);
      setInstallClosed(true);
      clearInstallDismissal(window.localStorage);
    }

    function syncStandalone() {
      setStandalone(isStandaloneMode());
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("focus", syncStandalone);
    document.addEventListener("visibilitychange", syncStandalone);

    const media = window.matchMedia?.("(display-mode: standalone)");
    media?.addEventListener?.("change", syncStandalone);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("focus", syncStandalone);
      document.removeEventListener("visibilitychange", syncStandalone);
      media?.removeEventListener?.("change", syncStandalone);
    };
  }, []);

  const iosGuide = canShowIosInstallGuide();
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
      isStandalone: standalone,
      hasDeferredPrompt: Boolean(deferredPrompt),
      canShowIosGuide: iosGuide,
      dismissed,
      updatePromptVisible: updateVisible,
    });

  async function install() {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt;
    setDeferredPrompt(null);
    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice?.outcome === "dismissed") {
      dismissInstall();
    } else {
      setInstallClosed(true);
    }
  }

  function dismissInstall() {
    markInstallDismissed(window.localStorage);
    setDismissed(true);
    setInstallClosed(true);
  }

  function closeInstall() {
    dismissInstall();
  }

  function updateNow() {
    updateServiceWorker(true);
  }

  if (updateVisible) {
    const copy = getUpdatePromptCopy();
    return (
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
  }

  if (!installVisible) return null;

  const copy = getInstallPromptCopy(role);
  const isIos = iosGuide && !deferredPrompt;

  return (
    <PwaPanel
      icon={isIos ? <Share2 size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
      title={copy.title}
      description={isIos ? copy.iosDescription : copy.description}
      actionLabel={isIos ? copy.iosActionLabel : copy.actionLabel}
      laterLabel={copy.laterLabel}
      onAction={isIos ? dismissInstall : install}
      onDismiss={closeInstall}
      actionRef={installActionRef}
      iosGuide={isIos}
    />
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
  iosGuide = false,
}) {
  return (
    <section
      className="pwa-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="pwa-panel-title"
      aria-describedby="pwa-panel-description"
      data-testid={iosGuide ? "pwa-ios-install-guide" : "pwa-install-prompt"}
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
      <button className="pwa-panel-close" type="button" onClick={onDismiss} aria-label="Fechar sugestão">
        <X size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

export default PwaExperienceManager;

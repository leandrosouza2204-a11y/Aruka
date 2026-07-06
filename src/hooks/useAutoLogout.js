import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_CONFIG } from "../config/sessionConfig";
import { supabase } from "../services/supabase";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "click",
  "touchstart",
  "touchmove",
  "focus",
];

function readLastActivity() {
  const currentValue = Number(localStorage.getItem(SESSION_CONFIG.LAST_ACTIVITY_KEY));
  if (Number.isFinite(currentValue) && currentValue > 0) return currentValue;

  const legacyValue = Number(
    localStorage.getItem(SESSION_CONFIG.LEGACY_LAST_ACTIVITY_KEY)
  );
  if (!Number.isFinite(legacyValue) || legacyValue <= 0) return null;

  localStorage.setItem(SESSION_CONFIG.LAST_ACTIVITY_KEY, String(legacyValue));
  localStorage.removeItem(SESSION_CONFIG.LEGACY_LAST_ACTIVITY_KEY);
  const value = Number(localStorage.getItem(SESSION_CONFIG.LAST_ACTIVITY_KEY));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function writeLastActivity(timestamp = Date.now()) {
  localStorage.setItem(SESSION_CONFIG.LAST_ACTIVITY_KEY, String(timestamp));
  localStorage.removeItem(SESSION_CONFIG.LEGACY_LAST_ACTIVITY_KEY);
}

export function markSessionLoggedOut() {
  localStorage.removeItem(SESSION_CONFIG.LAST_ACTIVITY_KEY);
  localStorage.removeItem(SESSION_CONFIG.LEGACY_LAST_ACTIVITY_KEY);
  localStorage.setItem(SESSION_CONFIG.LOGGED_OUT_AT_KEY, String(Date.now()));
}

export function useAutoLogout({ user, enabled = true } = {}) {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.ceil(SESSION_CONFIG.WARNING_BEFORE_LOGOUT / 1000)
  );
  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const showWarningRef = useRef(false);
  const loggingOutRef = useRef(false);
  const activeRef = useRef(Boolean(enabled && user));

  const clearTimers = useCallback(() => {
    window.clearTimeout(warningTimerRef.current);
    window.clearTimeout(logoutTimerRef.current);
    window.clearInterval(countdownTimerRef.current);
    warningTimerRef.current = null;
    logoutTimerRef.current = null;
    countdownTimerRef.current = null;
  }, []);

  const logoutNow = useCallback(
    async ({ broadcast = true } = {}) => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      clearTimers();
      setShowWarning(false);
      showWarningRef.current = false;

      if (broadcast) {
        markSessionLoggedOut();
      }

      try {
        await supabase.auth.signOut();
      } finally {
        navigate("/login", { replace: true });
      }
    },
    [clearTimers, navigate]
  );

  const startCountdown = useCallback(
    (expiresAt) => {
      window.clearInterval(countdownTimerRef.current);

      const updateRemaining = () => {
        const nextRemaining = Math.max(
          0,
          Math.ceil((expiresAt - Date.now()) / 1000)
        );
        setRemainingSeconds(nextRemaining);

        if (nextRemaining <= 0) {
          logoutNow();
        }
      };

      updateRemaining();
      countdownTimerRef.current = window.setInterval(updateRemaining, 1000);
    },
    [logoutNow]
  );

  const scheduleTimers = useCallback(() => {
    if (!activeRef.current) return;

    clearTimers();

    const lastActivity = readLastActivity() || Date.now();
    const now = Date.now();
    const warningAt =
      lastActivity +
      SESSION_CONFIG.INACTIVITY_LIMIT -
      SESSION_CONFIG.WARNING_BEFORE_LOGOUT;
    const expiresAt = lastActivity + SESSION_CONFIG.INACTIVITY_LIMIT;
    const warningDelay = warningAt - now;
    const logoutDelay = expiresAt - now;

    if (logoutDelay <= 0) {
      logoutNow();
      return;
    }

    logoutTimerRef.current = window.setTimeout(() => {
      logoutNow();
    }, logoutDelay);

    if (warningDelay <= 0) {
      setShowWarning(true);
      showWarningRef.current = true;
      startCountdown(expiresAt);
      return;
    }

    warningTimerRef.current = window.setTimeout(() => {
      setShowWarning(true);
      showWarningRef.current = true;
      startCountdown(expiresAt);
    }, warningDelay);
  }, [clearTimers, logoutNow, startCountdown]);

  const continueSession = useCallback(() => {
    loggingOutRef.current = false;
    setShowWarning(false);
    showWarningRef.current = false;
    setRemainingSeconds(Math.ceil(SESSION_CONFIG.WARNING_BEFORE_LOGOUT / 1000));
    writeLastActivity();
    scheduleTimers();
  }, [scheduleTimers]);

  const registerActivity = useCallback(() => {
    if (!activeRef.current || showWarningRef.current || loggingOutRef.current) {
      return;
    }

    writeLastActivity();
    scheduleTimers();
  }, [scheduleTimers]);

  const verifyElapsedTime = useCallback(() => {
    if (!activeRef.current || loggingOutRef.current) return;

    const lastActivity = readLastActivity();
    if (!lastActivity) {
      writeLastActivity();
      scheduleTimers();
      return;
    }

    if (Date.now() - lastActivity >= SESSION_CONFIG.INACTIVITY_LIMIT) {
      logoutNow();
      return;
    }

    scheduleTimers();
  }, [logoutNow, scheduleTimers]);

  useEffect(() => {
    activeRef.current = Boolean(enabled && user);
    loggingOutRef.current = false;

    if (!activeRef.current) {
      clearTimers();
      setShowWarning(false);
      showWarningRef.current = false;
      return undefined;
    }

    if (!readLastActivity()) {
      writeLastActivity();
    }

    verifyElapsedTime();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        verifyElapsedTime();
      }
    }

    function handleStorage(event) {
      if (
        (event.key === SESSION_CONFIG.LOGGED_OUT_AT_KEY ||
          event.key === SESSION_CONFIG.LEGACY_LOGGED_OUT_AT_KEY) &&
        event.newValue
      ) {
        logoutNow({ broadcast: false });
        return;
      }

      if (
        (event.key === SESSION_CONFIG.LAST_ACTIVITY_KEY ||
          event.key === SESSION_CONFIG.LEGACY_LAST_ACTIVITY_KEY) &&
        event.newValue &&
        !showWarningRef.current
      ) {
        scheduleTimers();
      }
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, registerActivity, {
        passive: true,
        capture: true,
      });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, registerActivity, {
          capture: true,
        });
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
      clearTimers();
    };
  }, [
    clearTimers,
    enabled,
    logoutNow,
    registerActivity,
    scheduleTimers,
    user,
    verifyElapsedTime,
  ]);

  return {
    showWarning,
    remainingSeconds,
    continueSession,
    logoutNow,
  };
}

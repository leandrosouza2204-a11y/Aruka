import { useCallback, useEffect, useRef, useState } from "react";
import { buscarPainelAgendaHoje } from "../../../services/agendaService";
import { todayKey } from "../../agenda/utils/agendaDate";
import { selecionarAgendaDeHoje } from "../utils/dashboardAgenda";

export const DASHBOARD_AGENDA_UPDATED_EVENT = "aruka:agenda-updated";

export function useDashboardAgenda() {
  const [state, setState] = useState({ status: "loading", compromissos: [], proximosAtendimentos: [], resumo: null, error: "" });
  const requestId = useRef(0);

  const load = useCallback(async ({ background = false } = {}) => {
    const currentRequest = ++requestId.current;
    if (!background) setState((current) => ({ ...current, status: "loading", error: "" }));
    try {
      const controlledFailure = ["localhost", "127.0.0.1"].includes(window.location.hostname)
        && window.localStorage?.getItem("ARUKA_QA_DASHBOARD_AGENDA_FAIL") === "true";
      if (controlledFailure) throw new Error("Falha controlada LOCAL_QA na Agenda de hoje.");
      const dateKey = todayKey();
      const payload = await buscarPainelAgendaHoje(dateKey, new Date().toISOString(), 3);
      if (currentRequest !== requestId.current) return;
      setState({ ...payload, status: "ready", error: "" });
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setState((current) => ({ ...current, status: "error", error: error?.message || "Não foi possível carregar a agenda de hoje." }));
    }
  }, []);

  useEffect(() => {
    load();
    const refresh = () => load({ background: true });
    const handleVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    window.addEventListener(DASHBOARD_AGENDA_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      requestId.current += 1;
      window.removeEventListener("focus", refresh);
      window.removeEventListener(DASHBOARD_AGENDA_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  return {
    ...state,
    itens: selecionarAgendaDeHoje(state.compromissos),
    retry: () => load(),
  };
}

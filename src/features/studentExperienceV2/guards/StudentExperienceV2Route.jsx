import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingFallback from "../../../components/LoadingFallback.jsx";
import { buscarMinhaHomeAlunoV2 } from "../../../services/studentHomeV2Service.js";
import { buscarMinhaRotaExperienciaAluno } from "../../../services/studentExperienceRouteService.js";
import { recordStudentExperienceEvent } from "../../../services/studentExperienceTelemetryService.js";
import { StudentExperienceV2Provider } from "../context/StudentExperienceV2Context.jsx";

function StudentExperienceV2Route({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", home: null, decision: null, error: null });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading", error: null }));
    const decision = await buscarMinhaRotaExperienciaAluno();
    if (decision.experience !== "v2") {
      void recordStudentExperienceEvent("route_fallback", { experience: "v1", reasonCode: decision.reasonCode, configVersion: decision.configVersion, route: location.pathname });
      setState({ status: "denied", home: null, decision, error: null });
      return null;
    }
    try {
      const home = await buscarMinhaHomeAlunoV2();
      setState({ status: "success", home, decision, error: null });
      return home;
    } catch (error) {
      setState({ status: "error", home: null, decision, error });
      throw error;
    }
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(async () => {
        const decision = await buscarMinhaRotaExperienciaAluno();
        if (!active) return;
        if (decision.experience !== "v2") {
          void recordStudentExperienceEvent("route_fallback", { experience: "v1", reasonCode: decision.reasonCode, configVersion: decision.configVersion, route: location.pathname });
          setState({ status: "denied", home: null, decision, error: null });
          return;
        }
        setState({ status: "loading", home: null, decision, error: null });
        const home = await buscarMinhaHomeAlunoV2();
        if (active) setState({ status: "success", home, decision, error: null });
      })
      .catch((error) => active && setState({ status: "error", home: null, decision: null, error }));
    return () => { active = false; };
  }, [location.pathname]);

  const context = useMemo(() => ({ ...state, reload: load }), [load, state]);
  if (state.status === "loading" && !state.decision) return <LoadingFallback texto="Validando seu acesso..." variant="route" />;
  if (state.status === "denied") {
    return <Navigate to="/minha-area" replace state={{ studentV2FallbackFrom: location.pathname }} />;
  }
  return <StudentExperienceV2Provider value={context}>{children}</StudentExperienceV2Provider>;
}

export default StudentExperienceV2Route;

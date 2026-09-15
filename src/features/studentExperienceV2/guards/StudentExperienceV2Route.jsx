import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { buscarMinhaHomeAlunoV2 } from "../../../services/studentHomeV2Service.js";
import { isStudentExperienceV2Enabled } from "../config/studentExperienceV2Config.js";
import { StudentExperienceV2Provider } from "../context/StudentExperienceV2Context.jsx";
import { resolveStudentExperienceV2Access, STUDENT_V2_ACCESS } from "./studentExperienceV2Access.js";

function StudentExperienceV2Route({ children }) {
  const location = useLocation();
  const enabled = isStudentExperienceV2Enabled();
  const [state, setState] = useState({ status: "loading", home: null, error: null });

  const load = useCallback(async () => {
    if (!enabled) return null;
    setState((current) => ({ ...current, status: "loading", error: null }));
    try {
      const home = await buscarMinhaHomeAlunoV2();
      setState({ status: "success", home, error: null });
      return home;
    } catch (error) {
      setState({ status: "error", home: null, error });
      throw error;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    buscarMinhaHomeAlunoV2()
      .then((home) => active && setState({ status: "success", home, error: null }))
      .catch((error) => active && setState({ status: "error", home: null, error }));
    return () => { active = false; };
  }, [enabled]);

  const context = useMemo(() => ({ ...state, reload: load }), [load, state]);
  const access = state.home ? resolveStudentExperienceV2Access(state.home) : null;

  if (!enabled) {
    return <Navigate to="/minha-area" replace state={{ studentV2FallbackFrom: location.pathname }} />;
  }
  if (access && access.state !== STUDENT_V2_ACCESS.ALLOWED) {
    return <Navigate to="/minha-area" replace state={{ studentV2FallbackFrom: location.pathname }} />;
  }
  return <StudentExperienceV2Provider value={context}>{children}</StudentExperienceV2Provider>;
}

export default StudentExperienceV2Route;

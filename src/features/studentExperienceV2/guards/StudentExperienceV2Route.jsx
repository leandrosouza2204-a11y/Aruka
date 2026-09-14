import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { buscarMinhaExperienciaDiariaAluno } from "../../../services/studentDailyExperienceService.js";
import { isStudentExperienceV2Enabled } from "../config/studentExperienceV2Config.js";
import { resolveStudentExperienceV2Access, STUDENT_V2_ACCESS } from "./studentExperienceV2Access.js";

function StudentExperienceV2Route({ children }) {
  const location = useLocation();
  const [access, setAccess] = useState(null);

  useEffect(() => {
    let active = true;
    buscarMinhaExperienciaDiariaAluno()
      .then((payload) => active && setAccess(resolveStudentExperienceV2Access(payload)))
      .catch(() => active && setAccess({ state: STUDENT_V2_ACCESS.INACTIVE }));
    return () => { active = false; };
  }, []);

  if (!isStudentExperienceV2Enabled()) {
    return <Navigate to="/minha-area" replace state={{ studentV2FallbackFrom: location.pathname }} />;
  }
  if (!access) return <div aria-live="polite">Carregando sua área...</div>;
  if (access.state !== STUDENT_V2_ACCESS.ALLOWED) return <Navigate to="/minha-area" replace />;
  return children;
}

export default StudentExperienceV2Route;

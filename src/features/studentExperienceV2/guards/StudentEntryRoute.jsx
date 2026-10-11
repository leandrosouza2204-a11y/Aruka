import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingFallback from "../../../components/LoadingFallback";
import { resolverDestinoPosLogin } from "../../../auth/loginRouting.js";
import { isStudentExperienceV2Enabled } from "../config/studentExperienceV2Config.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

function StudentEntryRoute({ children }) {
  const location = useLocation();
  const enabled = isStudentExperienceV2Enabled();
  const isGuardFallback = Boolean(location.state?.studentV2FallbackFrom);
  const [destination, setDestination] = useState(!enabled || isGuardFallback ? STUDENT_EXPERIENCE_V2_ROUTES.LEGACY : null);

  useEffect(() => {
    if (!enabled || isGuardFallback) return undefined;
    let active = true;
    resolverDestinoPosLogin(undefined, { fallbackRoute: STUDENT_EXPERIENCE_V2_ROUTES.LEGACY })
      .then((route) => active && setDestination(route))
      .catch(() => active && setDestination(STUDENT_EXPERIENCE_V2_ROUTES.LEGACY));
    return () => { active = false; };
  }, [enabled, isGuardFallback]);

  if (!enabled || isGuardFallback || destination === STUDENT_EXPERIENCE_V2_ROUTES.LEGACY) return children;
  if (destination) return <Navigate to={destination} replace />;
  return <LoadingFallback texto="Preparando sua área..." variant="route" />;
}

export default StudentEntryRoute;

import { useLocation } from "react-router-dom";
import { useAutoLogout } from "../hooks/useAutoLogout";
import SessionTimeoutModal from "./SessionTimeoutModal";

function AutoLogoutProvider({ children, user }) {
  const location = useLocation();
  const enabled = Boolean(user) && location.pathname !== "/login";
  const { showWarning, remainingSeconds, continueSession, logoutNow } =
    useAutoLogout({ user, enabled });

  return (
    <>
      {children}
      {showWarning && enabled && (
        <SessionTimeoutModal
          remainingSeconds={remainingSeconds}
          onContinue={continueSession}
          onLogout={() => logoutNow()}
        />
      )}
    </>
  );
}

export default AutoLogoutProvider;

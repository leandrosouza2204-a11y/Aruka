import { Activity, Dumbbell, Home, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import PwaExperienceManager from "../../pwa/PwaExperienceManager.jsx";
import { encerrarSessao } from "../../../services/logoutService.js";
import { useStudentExperienceV2 } from "../context/studentExperienceV2Context.js";
import { buildStudentHomeV2 } from "../domain/studentHomeV2.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

const STUDENT_V2_NAVIGATION = Object.freeze([
  { to: STUDENT_EXPERIENCE_V2_ROUTES.HOME, label: "Início", icon: Home },
  { to: STUDENT_EXPERIENCE_V2_ROUTES.TRAINING, label: "Treinos", icon: Dumbbell },
  { to: STUDENT_EXPERIENCE_V2_ROUTES.EVOLUTION, label: "Evolução", icon: Activity },
  { to: STUDENT_EXPERIENCE_V2_ROUTES.PROFILE, label: "Perfil", icon: UserRound },
]);

function StudentShell() {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const { home } = useStudentExperienceV2();
  const view = buildStudentHomeV2(home || {});

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await encerrarSessao();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Não foi possível sair. Sua sessão continua ativa.");
      setLoggingOut(false);
    }
  }

  return (
    <PwaExperienceManager role="student" activeWorkout={Boolean(view.activeSession)}>
      <div className="student-v2-shell" data-testid="student-v2-shell">
        <header className="student-v2-header">
          <div className="student-v2-header-copy">
            <span>Minha área</span>
            <strong>{view.student ? `Olá, ${view.student.firstName}` : "Área do aluno"}</strong>
          </div>
          <div className="student-v2-header-actions">
            {logoutError && <span className="student-v2-logout-error" role="alert">{logoutError}</span>}
            <span aria-hidden="true" className="student-v2-avatar">{view.student?.initials || "A"}</span>
            <button aria-label="Sair da área do aluno" className="student-v2-icon-button" disabled={loggingOut} onClick={logout} title="Sair" type="button">
              <LogOut aria-hidden="true" size={19} />
            </button>
          </div>
        </header>

        <aside className="student-v2-navigation-rail">
          <div aria-hidden="true" className="student-v2-brand">ARUKA</div>
          <nav aria-label="Navegação principal da área do aluno" data-testid="student-v2-navigation">
            {STUDENT_V2_NAVIGATION.map(({ icon: Icon, label, to }) => (
              <NavLink className={({ isActive }) => `student-v2-nav-item${isActive ? " is-active" : ""}`} key={to} to={to}>
                <Icon aria-hidden="true" size={21} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="student-v2-content" data-testid="student-v2-outlet">
          <Outlet />
        </main>
      </div>
    </PwaExperienceManager>
  );
}

export default StudentShell;

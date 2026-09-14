import { NavLink, Outlet } from "react-router-dom";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

const navigation = [
  [STUDENT_EXPERIENCE_V2_ROUTES.HOME, "Início"],
  [STUDENT_EXPERIENCE_V2_ROUTES.TRAINING, "Treinos"],
  [STUDENT_EXPERIENCE_V2_ROUTES.EVOLUTION, "Evolução"],
  [STUDENT_EXPERIENCE_V2_ROUTES.PROFILE, "Perfil"],
];

function StudentShell() {
  return (
    <main data-testid="student-v2-shell">
      <header><strong>Aruka</strong></header>
      <nav aria-label="Navegação da área do aluno" data-testid="student-v2-navigation">
        {navigation.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
      </nav>
      <section data-testid="student-v2-outlet"><Outlet /></section>
    </main>
  );
}

export default StudentShell;

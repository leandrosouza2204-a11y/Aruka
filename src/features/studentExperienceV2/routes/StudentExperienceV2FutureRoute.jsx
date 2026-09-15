import { Activity, Dumbbell, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

const ROUTES = {
  "/minha-area/treinos": { title: "Treinos", text: "Sua biblioteca de treinos será organizada aqui.", icon: Dumbbell },
  "/minha-area/evolucao": { title: "Evolução", text: "Seus registros e resultados ganharão uma visão completa aqui.", icon: Activity },
  "/minha-area/perfil": { title: "Perfil", text: "Preferências e dados da conta ficarão disponíveis aqui.", icon: UserRound },
};

function StudentExperienceV2FutureRoute() {
  const { pathname } = useLocation();
  const route = ROUTES[pathname] || ROUTES["/minha-area/treinos"];
  const Icon = route.icon;
  return (
    <section aria-labelledby="student-future-route-title" className="student-v2-state student-v2-future-route" data-testid="student-v2-future-route">
      <Icon aria-hidden="true" size={28} />
      <span className="student-v2-eyebrow">Em breve</span>
      <h1 id="student-future-route-title">{route.title}</h1>
      <p>{route.text}</p>
    </section>
  );
}

export default StudentExperienceV2FutureRoute;

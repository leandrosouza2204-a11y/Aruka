import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { buscarPerfilUsuario } from "../services/perfisService";

function ProfessionalRoute({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [profissional, setProfissional] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificarPerfil() {
      try {
        const perfil = await buscarPerfilUsuario();
        const isProfessional =
          perfil?.status === "ativo" &&
          perfil?.role === "user" &&
          ["beta", "assinante", "admin"].includes(perfil?.tipoAcesso);

        if (ativo) setProfissional(Boolean(isProfessional));
      } catch {
        if (ativo) setProfissional(false);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    verificarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <div style={loadingScreen}>Verificando perfil profissional...</div>;
  }

  if (!profissional) {
    return <Navigate to="/minha-area" replace />;
  }

  return children;
}

const loadingScreen = {
  alignItems: "center",
  color: "#111827",
  display: "grid",
  fontWeight: "700",
  minHeight: "100vh",
  placeItems: "center",
};

export default ProfessionalRoute;

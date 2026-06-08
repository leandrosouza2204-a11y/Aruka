import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { buscarPerfilUsuario, criarPerfilPadrao } from "../services/perfisService";

function AdminRoute({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificarAdmin() {
      try {
        const perfil = (await buscarPerfilUsuario()) || (await criarPerfilPadrao());

        if (!ativo) return;

        setAdmin(perfil.role === "admin" || perfil.tipoAcesso === "admin");
      } catch {
        if (ativo) setAdmin(false);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    verificarAdmin();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <div style={carregandoTela}>Verificando permissao...</div>;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const carregandoTela = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  color: "#111827",
  fontWeight: "700",
};

export default AdminRoute;

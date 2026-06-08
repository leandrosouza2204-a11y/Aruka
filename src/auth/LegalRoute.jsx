import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verificarAceiteLegal } from "../services/legalService";

function LegalRoute({ children }) {
  const location = useLocation();
  const [carregando, setCarregando] = useState(true);
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      try {
        const aceiteValido = await verificarAceiteLegal();

        if (ativo) setAceito(aceiteValido);
      } catch {
        if (ativo) setAceito(false);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    verificar();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <div style={carregandoTela}>Verificando documentos...</div>;
  }

  if (!aceito) {
    return (
      <Navigate
        to="/aceite-legal"
        replace
        state={{ from: location }}
      />
    );
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

export default LegalRoute;

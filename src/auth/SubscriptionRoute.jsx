import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  criarAssinaturaPendente,
  verificarAcessoAtivo,
} from "../services/assinaturasService";

function SubscriptionRoute({ children }) {
  const location = useLocation();
  const [carregando, setCarregando] = useState(true);
  const [acessoLiberado, setAcessoLiberado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      setCarregando(true);
      setErro("");

      try {
        await criarAssinaturaPendente();
        const acesso = await verificarAcessoAtivo();

        if (!ativo) return;
        setAcessoLiberado(acesso);
      } catch (error) {
        if (!ativo) return;
        setErro(error.message || "Nao foi possivel verificar a assinatura.");
        setAcessoLiberado(false);
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
    return <div style={carregandoTela}>Verificando assinatura...</div>;
  }

  if (erro) {
    return <Navigate to="/assinatura" replace state={{ erro }} />;
  }

  if (!acessoLiberado) {
    return <Navigate to="/assinatura" replace state={{ from: location }} />;
  }

  return children;
}

const carregandoTela = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#111827",
  fontWeight: "700",
};

export default SubscriptionRoute;

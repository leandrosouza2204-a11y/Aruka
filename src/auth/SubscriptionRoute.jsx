import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verificarAcessoUsuario } from "../services/perfisService";

function SubscriptionRoute({ children }) {
  const location = useLocation();
  const [carregando, setCarregando] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      setCarregando(true);
      setErro("");

      try {
        const acesso = await verificarAcessoUsuario();

        if (!ativo) return;
        setResultado(acesso);
      } catch (error) {
        if (!ativo) return;
        setErro(error.message || "Não foi possível verificar o acesso.");
        setResultado({
          liberado: false,
          motivo: "erro",
        });
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
    return <div style={carregandoTela}>Verificando acesso...</div>;
  }

  if (resultado?.liberado) return children;

  return (
    <Navigate
      to="/assinatura-pendente"
      replace
      state={{
        from: location,
        motivo: resultado?.motivo || "pendente",
        erro,
      }}
    />
  );
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

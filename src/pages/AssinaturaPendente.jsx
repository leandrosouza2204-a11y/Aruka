import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import EscolherPlano from "./EscolherPlano";

function AssinaturaPendente() {
  const location = useLocation();
  const navigate = useNavigate();
  const erro = location.state?.erro || "";

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={pagina}>
      <main style={card}>
        <div style={topo}>
          <span style={badge}>Acesso aguardando liberacao</span>
          <h1 style={titulo}>Sua assinatura ainda nao esta ativa</h1>
          <p style={texto}>
            Seu cadastro foi criado, mas o acesso ao sistema fica bloqueado ate
            a confirmacao da assinatura. Escolha uma opcao abaixo e solicite a
            liberacao pelo WhatsApp.
          </p>
        </div>

        {erro && <div style={erroBox}>{erro}</div>}

        <EscolherPlano />

        <div style={rodape}>
          <button
            onClick={() => navigate("/criar-senha")}
            style={botaoSecundario}
          >
            Criar senha
          </button>
          <button onClick={sair} style={botaoSecundario}>
            Sair
          </button>
        </div>
      </main>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  padding: "32px 18px",
};

const card = {
  width: "min(960px, 100%)",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
  padding: "28px",
};

const topo = {
  display: "grid",
  gap: "10px",
};

const badge = {
  color: "#b45309",
  fontSize: "13px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const titulo = {
  color: "#111827",
  fontSize: "30px",
  margin: 0,
};

const texto = {
  color: "#4b5563",
  lineHeight: 1.6,
  maxWidth: "720px",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const rodape = {
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "24px",
  paddingTop: "16px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

export default AssinaturaPendente;

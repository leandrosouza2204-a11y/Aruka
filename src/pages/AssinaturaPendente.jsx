import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import EscolherPlano from "./EscolherPlano";

function AssinaturaPendente() {
  const location = useLocation();
  const navigate = useNavigate();
  const erro = location.state?.erro || "";
  const motivo = location.state?.motivo || "pendente";
  const conteudo = mensagensPorMotivo[motivo] || mensagensPorMotivo.pendente;

  async function sair() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={pagina}>
      <main style={card}>
        <div style={topo}>
          <span style={badge}>{conteudo.badge}</span>
          <h1 style={titulo}>{conteudo.titulo}</h1>
          <p style={texto}>{conteudo.texto}</p>
        </div>

        {erro && <div style={erroBox}>{erro}</div>}

        {motivo !== "bloqueado" && <EscolherPlano />}

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

const mensagensPorMotivo = {
  pendente: {
    badge: "Acesso aguardando liberacao",
    titulo: "Seu acesso ainda está aguardando liberação.",
    texto:
      "Seu cadastro foi criado, mas o acesso ao sistema fica bloqueado ate a liberacao. Escolha uma opcao abaixo e solicite a ativacao pelo WhatsApp.",
  },
  bloqueado: {
    badge: "Acesso bloqueado",
    titulo: "Seu acesso está bloqueado. Entre em contato.",
    texto:
      "Nao foi possivel liberar seu acesso neste momento. Entre em contato com o suporte para verificar sua situacao.",
  },
  "sem-assinatura": {
    badge: "Assinatura indisponivel",
    titulo: "Assinatura não encontrada ou vencida.",
    texto:
      "Seu perfil exige uma assinatura ativa, mas nao encontramos uma assinatura valida. Escolha uma opcao abaixo e solicite a regularizacao.",
  },
  erro: {
    badge: "Erro na verificacao",
    titulo: "Nao foi possivel verificar seu acesso.",
    texto:
      "Tente novamente em alguns instantes. Se o problema continuar, entre em contato com o suporte.",
  },
};

export default AssinaturaPendente;

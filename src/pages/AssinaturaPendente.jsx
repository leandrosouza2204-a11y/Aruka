import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import FooterLegal from "../components/FooterLegal";
import { markSessionLoggedOut } from "../hooks/useAutoLogout";
import { verificarAcessoUsuario } from "../services/perfisService";
import { supabase } from "../services/supabase";
import EscolherPlano from "./EscolherPlano";

function AssinaturaPendente() {
  const location = useLocation();
  const navigate = useNavigate();
  const erro = location.state?.erro || "";
  const motivo = location.state?.motivo || "pendente";
  const conteudo = mensagensPorMotivo[motivo] || mensagensPorMotivo.pendente;

  useEffect(() => {
    let ativo = true;

    async function verificarAcesso() {
      try {
        const acesso = await verificarAcessoUsuario();

        if (ativo && acesso.liberado) {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        // Mantem a mensagem amigavel da tela caso a verificacao falhe.
      }
    }

    verificarAcesso();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  async function sair() {
    markSessionLoggedOut();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={pagina}>
      <main style={card}>
        <div style={marca}>
          <div className="brand-pending-full">
            <BrandLogo variant="full" size="md" />
          </div>
          <div className="brand-pending-icon">
            <BrandLogo variant="icon" size="lg" showSlogan />
          </div>
        </div>

        <div style={topo}>
          <span style={badge}>{conteudo.badge}</span>
          <h1 style={titulo}>{conteudo.titulo}</h1>
          <p style={texto}>{conteudo.texto}</p>
        </div>

        {erro && <div style={erroBox}>{erro}</div>}

        {motivo !== "bloqueado" && <EscolherPlano />}

        <div style={rodape}>
          <button
            type="button"
            onClick={() => navigate("/criar-senha")}
            style={botaoSecundario}
          >
            Criar senha
          </button>
          <button type="button" onClick={sair} style={botaoSecundario}>
            Sair
          </button>
        </div>

        <FooterLegal compact />
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

const marca = {
  display: "grid",
  gap: "8px",
  justifyItems: "center",
  marginBottom: "28px",
  textAlign: "center",
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
  gap: "10px",
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
    badge: "Acesso aguardando liberação",
    titulo: "Seu acesso ainda está aguardando liberação.",
    texto:
      "Seu cadastro foi criado com sucesso. O acesso à Aruka será liberado após aprovação. Escolha uma opção abaixo e solicite a ativação pelo WhatsApp.",
  },
  bloqueado: {
    badge: "Acesso bloqueado",
    titulo: "Seu acesso está bloqueado. Entre em contato.",
    texto:
      "Não foi possível liberar seu acesso neste momento. Entre em contato com o suporte para verificar sua situação.",
  },
  "sem-assinatura": {
    badge: "Assinatura indisponível",
    titulo: "Assinatura não encontrada ou vencida.",
    texto:
      "Seu perfil exige uma assinatura ativa, mas não encontramos uma assinatura válida. Escolha uma opção abaixo e solicite a regularização.",
  },
  erro: {
    badge: "Erro na verificação",
    titulo: "Não foi possível verificar seu acesso.",
    texto:
      "Tente novamente em alguns instantes. Se o problema continuar, entre em contato com o suporte.",
  },
};

export default AssinaturaPendente;

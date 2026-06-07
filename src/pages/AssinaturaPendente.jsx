import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buscarPerfilUsuario } from "../services/perfisService";
import { supabase } from "../services/supabase";
import EscolherPlano from "./EscolherPlano";

function AssinaturaPendente() {
  const location = useLocation();
  const navigate = useNavigate();
  const [diagnostico, setDiagnostico] = useState({
    carregando: true,
    email: "",
    perfil: null,
    erro: "",
  });
  const erro = location.state?.erro || "";
  const motivo = location.state?.motivo || "pendente";
  const conteudo = mensagensPorMotivo[motivo] || mensagensPorMotivo.pendente;

  useEffect(() => {
    let ativo = true;

    async function carregarDiagnostico() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        const perfil = user ? await buscarPerfilUsuario() : null;

        if (!ativo) return;

        setDiagnostico({
          carregando: false,
          email: user?.email || "",
          perfil,
          erro: "",
        });
      } catch (error) {
        if (!ativo) return;

        setDiagnostico({
          carregando: false,
          email: "",
          perfil: null,
          erro:
            error.message ||
            "Nao foi possivel carregar os dados de acesso do usuario.",
        });
      }
    }

    carregarDiagnostico();

    return () => {
      ativo = false;
    };
  }, []);

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

        <div style={diagnosticoBox}>
          <strong style={diagnosticoTitulo}>Diagnostico do acesso</strong>
          {diagnostico.carregando ? (
            <span style={diagnosticoTexto}>Carregando dados do perfil...</span>
          ) : diagnostico.erro ? (
            <span style={diagnosticoErro}>{diagnostico.erro}</span>
          ) : (
            <div style={diagnosticoGrid}>
              <span>
                <b>Email:</b> {diagnostico.email || "-"}
              </span>
              <span>
                <b>Role:</b> {diagnostico.perfil?.role || "sem perfil"}
              </span>
              <span>
                <b>Tipo de acesso:</b>{" "}
                {diagnostico.perfil?.tipoAcesso || "sem perfil"}
              </span>
              <span>
                <b>Status:</b> {diagnostico.perfil?.status || "sem perfil"}
              </span>
              <span>
                <b>Motivo do bloqueio:</b> {motivo}
              </span>
            </div>
          )}
        </div>

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

const diagnosticoBox = {
  background: "#f8fafc",
  border: "1px solid #dbe4ef",
  borderRadius: "8px",
  color: "#334155",
  display: "grid",
  gap: "10px",
  marginTop: "18px",
  padding: "14px",
};

const diagnosticoTitulo = {
  color: "#0f172a",
  fontSize: "14px",
};

const diagnosticoTexto = {
  color: "#64748b",
  fontSize: "14px",
};

const diagnosticoErro = {
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
};

const diagnosticoGrid = {
  display: "grid",
  gap: "6px",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  fontSize: "14px",
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

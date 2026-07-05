import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import FooterLegal from "../components/FooterLegal";
import {
  obterVersoesLegaisAtuais,
  registrarAceiteLegal,
} from "../services/legalService";
import { useToast } from "../hooks/useToast";

function AceiteLegal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [politicaAceita, setPoliticaAceita] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const toast = useToast();
  const { politicaVersao, termosVersao } = obterVersoesLegaisAtuais();
  const destino = location.state?.from?.pathname || "/";
  const podeContinuar = politicaAceita && termosAceitos && !carregando;

  async function aceitar(e) {
    e.preventDefault();

    if (!podeContinuar) return;

    setCarregando(true);
    setErro("");

    try {
      await registrarAceiteLegal({
        userAgent: navigator.userAgent,
      });
      toast.sucesso(
        "Aceite registrado",
        "Obrigado por confirmar os documentos legais."
      );
      navigate(destino, { replace: true });
    } catch (error) {
      console.error(error);
      setErro("Não foi possível registrar o aceite. Tente novamente em instantes.");
      toast.erro(
        "Não foi possível registrar o aceite",
        "Tente novamente em instantes."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={pagina}>
      <main style={card}>
        <div style={marca}>
          <BrandLogo variant="full" size="md" />
        </div>

        <div style={topo}>
          <span style={badge}>Documentos legais</span>
          <h1 style={titulo}>Aceite obrigatório</h1>
          <p style={texto}>
            Para continuar usando a Aruka, leia e aceite a Política de
            Privacidade e os Termos de Uso vigentes.
          </p>
          <p style={versao}>
            Política versão {politicaVersao} • Termos versão {termosVersao}
          </p>
        </div>

        {erro && <div style={erroBox}>{erro}</div>}

        <form onSubmit={aceitar} style={form}>
          <label style={checkItem}>
            <input
              type="checkbox"
              checked={politicaAceita}
              onChange={(e) => setPoliticaAceita(e.target.checked)}
            />
            <span>
              Li e aceito a{" "}
              <Link style={link} to="/politica-privacidade" target="_blank">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>

          <label style={checkItem}>
            <input
              type="checkbox"
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
            />
            <span>
              Li e aceito os{" "}
              <Link style={link} to="/termos-de-uso" target="_blank">
                Termos de Uso
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!podeContinuar}
            style={{
              ...botao,
              ...(!podeContinuar ? botaoDesabilitado : {}),
            }}
          >
            {carregando ? "Registrando..." : "Aceitar e continuar"}
          </button>
        </form>

        <FooterLegal compact />
      </main>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const card = {
  width: "min(680px, 100%)",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
  display: "grid",
  gap: "22px",
  padding: "28px",
};

const marca = {
  display: "grid",
  gap: "8px",
  justifyItems: "center",
  textAlign: "center",
};

const topo = {
  display: "grid",
  gap: "8px",
};

const badge = {
  color: "#2563eb",
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
};

const versao = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: "700",
};

const form = {
  display: "grid",
  gap: "12px",
};

const checkItem = {
  alignItems: "flex-start",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#111827",
  display: "flex",
  gap: "10px",
  lineHeight: 1.5,
  padding: "12px",
};

const link = {
  color: "#2563eb",
  fontWeight: "800",
};

const botao = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "44px",
};

const botaoDesabilitado = {
  background: "#9ca3af",
  cursor: "not-allowed",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontWeight: "700",
  padding: "12px",
};

export default AceiteLegal;

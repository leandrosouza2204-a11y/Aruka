import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase, supabaseConfigurado } from "../services/supabase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  const destino = location.state?.from?.pathname || "/";

  async function entrar(e) {
    e.preventDefault();
    setErro("");

    if (!supabaseConfigurado) {
      setErro(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para habilitar o login."
      );
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setAutenticado(true);
    navigate(destino, { replace: true });
  }

  if (autenticado) {
    return <Navigate to={destino} replace />;
  }

  return (
    <div style={pagina}>
      <form onSubmit={entrar} style={card}>
        <div>
          <h1 style={titulo}>Consultoria Online</h1>
          <p style={subtitulo}>Acesse sua area de gestao.</p>
        </div>

        <label style={campoGrupo}>
          <span style={label}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={campo}
            required
          />
        </label>

        <label style={campoGrupo}>
          <span style={label}>Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            style={campo}
            required
          />
        </label>

        {erro && <p style={erroTexto}>{erro}</p>}

        <button type="submit" disabled={carregando} style={botao}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const pagina = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0f172a",
  padding: "24px",
};

const card = {
  width: "min(380px, 100%)",
  background: "white",
  borderRadius: "8px",
  padding: "28px",
  display: "grid",
  gap: "16px",
  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
};

const titulo = {
  color: "#111827",
  fontSize: "26px",
  margin: 0,
};

const subtitulo = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const campoGrupo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const label = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
};

const campo = {
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  outline: "none",
};

const botao = {
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "44px",
};

const erroTexto = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  padding: "10px",
};

export default Login;

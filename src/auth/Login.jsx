import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { criarPerfilPadrao } from "../services/perfisService";
import { supabase, supabaseConfigurado } from "../services/supabase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

  const destino = location.state?.from?.pathname || "/";

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

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

    await criarPerfilPadrao();
    setAutenticado(true);
    navigate(destino, { replace: true });
  }

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!supabaseConfigurado) {
      setErro(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para habilitar o cadastro."
      );
      return;
    }

    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    if (data.session) {
      await criarPerfilPadrao();
      setAutenticado(true);
      navigate(destino, { replace: true });
      return;
    }

    setMensagem("Cadastro criado. Verifique seu email para confirmar o acesso.");
  }

  if (autenticado) {
    return <Navigate to={destino} replace />;
  }

  return (
    <div style={pagina}>
      <form onSubmit={modoCadastro ? cadastrar : entrar} style={card}>
        <div style={marca}>
          <BrandLogo variant="full" size="lg" />
          <p style={subtitulo}>
            {modoCadastro
              ? "Crie sua conta para solicitar a liberacao."
              : "Acesse sua area de gestao."}
          </p>
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
        {mensagem && <p style={sucessoTexto}>{mensagem}</p>}

        <button type="submit" disabled={carregando} style={botao}>
          {carregando
            ? modoCadastro
              ? "Criando conta..."
              : "Entrando..."
            : modoCadastro
              ? "Criar conta"
              : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setErro("");
            setMensagem("");
          }}
          style={botaoAlternar}
        >
          {modoCadastro ? "Ja tenho conta" : "Criar nova conta"}
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
  width: "min(460px, 100%)",
  background: "white",
  borderRadius: "8px",
  padding: "28px",
  display: "grid",
  gap: "16px",
  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
};

const marca = {
  display: "grid",
  gap: "8px",
  justifyItems: "center",
  textAlign: "center",
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

const sucessoTexto = {
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  fontSize: "14px",
  padding: "10px",
};

const botaoAlternar = {
  background: "transparent",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "42px",
};

export default Login;

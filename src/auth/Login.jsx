import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import FooterLegal from "../components/FooterLegal";
import { criarPerfilPadrao } from "../services/perfisService";
import { supabase, supabaseConfigurado } from "../services/supabase";
import { claimPendingStudentInvite } from "../services/studentInviteLinkingService";
import { resolverDestinoPosLogin } from "./loginRouting";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

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

    const studentAccess = await claimPendingStudentInvite({ optional: true });
    if (!studentAccess) await criarPerfilPadrao();
    const destinoPosLogin = await resolverDestinoPosLogin();
    navigate(destinoPosLogin, { replace: true });
  }

  async function recuperarSenha(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!supabaseConfigurado) {
      setErro(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para habilitar a recuperação de senha."
      );
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErro("Informe um e-mail válido para receber as instruções.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    setCarregando(false);

    if (error) {
      setErro("Não foi possível enviar as instruções agora. Tente novamente em instantes.");
      return;
    }

    setMensagem("Se existir uma conta com este e-mail, você receberá as instruções para redefinir sua senha.");
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
      const destinoPosLogin = await resolverDestinoPosLogin();
      navigate(destinoPosLogin, { replace: true });
      return;
    }

    setMensagem(
      "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro e depois retorne para entrar. Em seguida, o acesso ao painel pode depender da liberação da assinatura e do aceite dos termos."
    );
  }

  return (
    <div style={pagina}>
      <form onSubmit={modoRecuperacao ? recuperarSenha : modoCadastro ? cadastrar : entrar} style={card}>
        <div style={marca}>
          <BrandLogo variant="full" size="login" />
          {modoRecuperacao && <p style={subtitulo}>Receba instruções para redefinir sua senha.</p>}
          <p style={modoRecuperacao ? { ...subtitulo, display: "none" } : subtitulo}>
            {modoCadastro
              ? "Crie sua conta para iniciar a liberação de acesso."
              : "Acesse sua área de gestão."}
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

        {!modoRecuperacao && (
          <label style={campoGrupo}>
            <span style={label}>Senha</span>
            <div style={senhaLinha}>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                style={campo}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={botaoIcone}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </label>
        )}

        {modoCadastro && (
          <p className="app-muted" style={orientacaoCadastro}>
            Após criar sua conta, você poderá precisar confirmar o e-mail,
            concluir a liberação do acesso e aceitar os termos da plataforma.
          </p>
        )}

        {erro && <p style={erroTexto}>{erro}</p>}
        {mensagem && <p style={sucessoTexto}>{mensagem}</p>}

        <button type="submit" disabled={carregando} style={botao}>
          {carregando
            ? modoRecuperacao
              ? "Enviando..."
              : modoCadastro
              ? "Criando conta..."
              : "Entrando..."
            : modoRecuperacao
              ? "Enviar instruções"
              : modoCadastro
              ? "Criar conta"
              : "Entrar"}
        </button>

        {!modoCadastro && !modoRecuperacao && (
          <button
            type="button"
            onClick={() => {
              setModoRecuperacao(true);
              setErro("");
              setMensagem("");
            }}
            style={botaoTexto}
          >
            Esqueci minha senha
          </button>
        )}

        {modoRecuperacao && (
          <button
            type="button"
            onClick={() => {
              setModoRecuperacao(false);
              setModoCadastro(false);
              setErro("");
              setMensagem("");
            }}
            style={botaoAlternar}
          >
            Voltar para o login
          </button>
        )}

        {!modoRecuperacao && (
        <button
          type="button"
          onClick={() => {
            if (modoRecuperacao) {
              setModoRecuperacao(false);
              setModoCadastro(false);
            } else {
              setModoCadastro(!modoCadastro);
            }
            setErro("");
            setMensagem("");
          }}
          style={botaoAlternar}
        >
          {modoCadastro ? "Já tenho conta" : "Criar nova conta"}
        </button>

        )}

        <FooterLegal compact />
      </form>
    </div>
  );
}

const pagina = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at 50% 12%, rgba(59, 130, 246, 0.18), transparent 360px), linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)",
  overflowY: "auto",
  padding: "32px 24px",
};

const card = {
  width: "min(430px, calc(100vw - 32px))",
  boxSizing: "border-box",
  background: "rgba(255, 255, 255, 0.96)",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: "8px",
  padding: "32px",
  display: "grid",
  gap: "16px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
};

const marca = {
  display: "grid",
  gap: "16px",
  justifyItems: "center",
  marginBottom: "8px",
  textAlign: "center",
};

const subtitulo = {
  color: "#7b8493",
  fontSize: "13px",
  margin: 0,
};

const campoGrupo = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const label = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
};

const campo = {
  boxSizing: "border-box",
  width: "100%",
  minHeight: "44px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "10px 12px",
  outline: "none",
};

const senhaLinha = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "1fr auto",
};

const botaoIcone = {
  width: "44px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const orientacaoCadastro = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#4b5563",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
  padding: "10px 12px",
};

const botao = {
  width: "100%",
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
  margin: 0,
  padding: "10px",
};

const sucessoTexto = {
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  fontSize: "14px",
  lineHeight: 1.5,
  margin: 0,
  padding: "10px",
};

const botaoAlternar = {
  width: "100%",
  background: "transparent",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "44px",
};

const botaoTexto = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "32px",
  padding: "0",
  textAlign: "center",
};

export default Login;

import BrandLogo from "../components/BrandLogo";
import DefinirSenhaForm from "../components/DefinirSenhaForm";
import FooterLegal from "../components/FooterLegal";

function CriarSenha() {
  return (
    <div style={pagina}>
      <main style={card}>
        <BrandLogo variant="full" size="md" />

        <div style={topo}>
          <span style={etiqueta}>Primeiro acesso</span>
          <h1 style={titulo}>Crie sua senha de acesso</h1>
          <p style={descricao}>
            Use esta tela quando acessar pelo convite enviado por e-mail. Como o
            convite já autentica sua sessão, aqui você cria uma senha sem
            precisar informar senha atual.
          </p>
          <p className="app-muted" style={orientacao}>
            Depois de salvar a senha, você poderá entrar normalmente com e-mail
            e senha. Caso ainda falte liberação de acesso ou aceite legal, a
            Aruka mostrará a próxima etapa antes do Dashboard.
          </p>
        </div>

        <DefinirSenhaForm />

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
  width: "min(520px, 100%)",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
  display: "grid",
  gap: "22px",
  padding: "28px",
};

const topo = {
  display: "grid",
  gap: "8px",
};

const etiqueta = {
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const titulo = {
  color: "#111827",
  fontSize: "28px",
  margin: 0,
};

const descricao = {
  color: "#6b7280",
  lineHeight: 1.6,
};

const orientacao = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#4b5563",
  lineHeight: 1.55,
  margin: 0,
  padding: "12px",
};

export default CriarSenha;

import BrandLogo from "../components/BrandLogo";
import DefinirSenhaForm from "../components/DefinirSenhaForm";

function CriarSenha() {
  return (
    <div style={pagina}>
      <main style={card}>
        <BrandLogo variant="full" size="md" />

        <div style={topo}>
          <span style={etiqueta}>Primeiro acesso</span>
          <h1 style={titulo}>Crie sua senha de acesso</h1>
          <p style={descricao}>
            Use esta tela quando acessar pelo convite enviado por email. Como o
            convite ja autentica sua sessao, aqui voce cria uma senha sem
            precisar informar senha atual.
          </p>
        </div>

        <DefinirSenhaForm />
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

export default CriarSenha;

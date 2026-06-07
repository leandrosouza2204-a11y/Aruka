import Sidebar from "../components/Sidebar";
import AlterarSenhaForm from "../components/AlterarSenhaForm";

function AlterarSenha() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <section style={card}>
          <div style={topo}>
            <span style={etiqueta}>Seguranca</span>
            <h1 style={titulo}>Alterar Senha</h1>
            <p style={descricao}>
              Atualize sua senha de acesso. Por seguranca, confirme sua senha
              atual antes de definir uma nova senha forte.
            </p>
          </div>

          <AlterarSenhaForm />
        </section>
      </div>
    </div>
  );
}

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  display: "grid",
  gap: "24px",
  maxWidth: "720px",
  padding: "24px",
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
  fontSize: "30px",
  margin: 0,
};

const descricao = {
  color: "#6b7280",
  lineHeight: 1.6,
  maxWidth: "600px",
};

export default AlterarSenha;

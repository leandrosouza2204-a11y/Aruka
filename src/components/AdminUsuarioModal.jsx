import { useState } from "react";
import { validateCommercialSubscriptionInput } from "../features/adminCommercial/utils/commercialAccountState";

const formInicial = {
  nome: "",
  role: "user",
  tipoAcesso: "pendente",
  status: "ativo",
  assinaturaPlano: "",
  assinaturaStatus: "pendente",
  dataInicio: "",
  dataVencimento: "",
};

function AdminUsuarioModal({ usuario, onClose, onSave, salvando }) {
  const [form, setForm] = useState(() => ({
    ...formInicial,
    ...usuario,
    assinaturaStatus: usuario?.assinaturaStatus || "pendente",
  }));
  const [erro, setErro] = useState("");

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function salvar() {
    setErro("");

    const validation = validateCommercialSubscriptionInput({
      plano: form.assinaturaPlano.trim() || "pendente",
      status: form.assinaturaStatus,
      dataInicio: form.dataInicio || null,
      dataVencimento: form.dataVencimento || null,
    });

    if (!validation.valid) {
      setErro(validation.errors[0]);
      return;
    }

    onSave({
      nome: form.nome.trim(),
      role: form.role,
      tipoAcesso: form.tipoAcesso,
      status: form.status,
      assinatura: {
        plano: form.assinaturaPlano.trim() || "pendente",
        status: form.assinaturaStatus,
        dataInicio: form.dataInicio || null,
        dataVencimento: form.dataVencimento || null,
      },
    });
  }

  return (
    <div style={overlay}>
      <div className="admin-user-modal" style={modal}>
        <div style={topo}>
          <div>
            <h2 style={titulo}>Editar Usuário</h2>
            <p style={subtitulo}>{usuario.email}</p>
          </div>

          <button type="button" onClick={onClose} style={botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={secao}>
          <h3 style={secaoTitulo}>Perfil de acesso</h3>
          <div className="admin-modal-grid" style={grid}>
            <Campo label="Nome">
              <input
                value={form.nome}
                onChange={(e) => atualizar("nome", e.target.value)}
                placeholder="Nome do usuário"
                style={campo}
              />
            </Campo>

            <Campo label="Role">
              <select
                value={form.role}
                onChange={(e) => atualizar("role", e.target.value)}
                style={campo}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </Campo>

            <Campo label="Tipo de acesso">
              <select
                value={form.tipoAcesso}
                onChange={(e) => atualizar("tipoAcesso", e.target.value)}
                style={campo}
              >
                <option value="admin">admin</option>
                <option value="beta">beta</option>
                <option value="assinante">assinante</option>
                <option value="pendente">pendente</option>
                <option value="bloqueado">bloqueado</option>
              </select>
            </Campo>

            <Campo label="Status">
              <select
                value={form.status}
                onChange={(e) => atualizar("status", e.target.value)}
                style={campo}
              >
                <option value="ativo">ativo</option>
                <option value="inativo">inativo</option>
              </select>
            </Campo>
          </div>
        </div>

        <div style={secao}>
          <h3 style={secaoTitulo}>Assinatura</h3>
          <p style={secaoTexto}>
            Registre a situacao comercial depois da confirmacao externa. O Aruka nao
            processa pagamento automaticamente neste fluxo.
          </p>
          <div className="admin-modal-grid" style={grid}>
            <Campo label="Plano">
              <input
                value={form.assinaturaPlano}
                onChange={(e) => atualizar("assinaturaPlano", e.target.value)}
                placeholder="Mensal, Trimestral, Anual..."
                style={campo}
              />
            </Campo>

            <Campo label="Status da assinatura">
              <select
                value={form.assinaturaStatus}
                onChange={(e) => atualizar("assinaturaStatus", e.target.value)}
                style={campo}
              >
                <option value="pendente">pendente</option>
                <option value="ativo">ativo</option>
                <option value="vencido">vencido</option>
                <option value="cancelado">cancelado</option>
                <option value="teste">teste</option>
              </select>
            </Campo>

            <Campo label="Data de início">
              <input
                type="date"
                value={form.dataInicio || ""}
                onChange={(e) => atualizar("dataInicio", e.target.value)}
                style={campo}
              />
            </Campo>

            <Campo label="Data de vencimento">
              <input
                type="date"
                value={form.dataVencimento || ""}
                onChange={(e) => atualizar("dataVencimento", e.target.value)}
                style={campo}
              />
            </Campo>
          </div>
        </div>

        <div style={avisoAlunos}>
          O acesso dos alunos e gerenciado separadamente. Alterar assinatura do
          profissional nao suspende alunos automaticamente.
        </div>

        {erro && <div className="app-error">{erro}</div>}

        <div className="admin-modal-footer" style={rodape}>
          <button type="button" onClick={onClose} style={botaoSecundario}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={salvar}
            style={botaoPrimario}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label style={campoGrupo}>
      <span style={labelCampo}>{label}</span>
      {children}
    </label>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.6)",
};

const modal = {
  width: "min(760px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
};

const titulo = { margin: 0, color: "#111827", fontSize: "22px" };
const subtitulo = { color: "#6b7280", fontSize: "14px", marginTop: "5px" };

const secao = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "18px",
  paddingTop: "18px",
};

const secaoTitulo = {
  color: "#111827",
  fontSize: "16px",
  margin: "0 0 12px",
};

const secaoTexto = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: "0 0 12px",
};

const avisoAlunos = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: 1.5,
  marginTop: "18px",
  padding: "12px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const campoGrupo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelCampo = {
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

const rodape = {
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
  paddingTop: "16px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  padding: "10px 14px",
};

const botaoPrimario = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  padding: "10px 14px",
};

export default AdminUsuarioModal;

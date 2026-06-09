import { useState } from "react";

const planoVazio = {
  nome: "",
  descricao: "",
  duracaoMeses: 1,
  valor: "",
  ativo: true,
};

function PlanoModal({ plano, onClose, onSave, salvando }) {
  const [form, setForm] = useState(() => ({ ...planoVazio, ...plano }));

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function salvar() {
    if (!form.nome.trim()) {
      alert("Informe o nome do plano.");
      return;
    }

    if (Number(form.duracaoMeses || 0) <= 0) {
      alert("Informe uma duracao valida.");
      return;
    }

    onSave({
      ...form,
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      duracaoMeses: Number(form.duracaoMeses || 1),
      valor: Number(form.valor || 0),
      ativo: Boolean(form.ativo),
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={titulo}>{plano?.id ? "Editar Plano" : "Novo Plano"}</h2>
            <p style={subtitulo}>Defina preco, duracao e disponibilidade.</p>
          </div>

          <button onClick={onClose} style={botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={formGrid}>
          <Campo label="Nome do plano">
            <input
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
              placeholder="Ex: Mensal"
              style={campo}
            />
          </Campo>

          <Campo label="Duração em meses">
            <input
              type="number"
              min="1"
              value={form.duracaoMeses}
              onChange={(e) => atualizar("duracaoMeses", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Valor">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => atualizar("valor", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Status">
            <select
              value={form.ativo ? "ativo" : "inativo"}
              onChange={(e) => atualizar("ativo", e.target.value === "ativo")}
              style={campo}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </Campo>

          <Campo label="Descrição">
            <textarea
              rows="3"
              value={form.descricao}
              onChange={(e) => atualizar("descricao", e.target.value)}
              placeholder="Detalhes, condicoes ou observacoes do plano"
              style={{ ...campo, minHeight: "84px", resize: "vertical" }}
            />
          </Campo>
        </div>

        <div style={rodape}>
          <button onClick={onClose} style={botaoSecundario}>
            Cancelar
          </button>
          <button onClick={salvar} style={botaoPrimario} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Plano"}
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
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(17, 24, 39, 0.55)",
};

const modal = {
  width: "min(640px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

const modalTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
};

const titulo = { margin: 0, fontSize: "22px" };
const subtitulo = { color: "#6b7280", fontSize: "14px", marginTop: "5px" };

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "22px",
};

const campoGrupo = { display: "flex", flexDirection: "column", gap: "6px" };
const labelCampo = { color: "#374151", fontSize: "13px", fontWeight: "700" };

const campo = {
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const rodape = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "24px",
};

const botaoPrimario = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "9px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default PlanoModal;

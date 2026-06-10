import { useMemo, useState } from "react";
import { useToast } from "../hooks/useToast";

const avaliacaoVazia = {
  aluno: "",
  data: "",
  idade: "",
  sexo: "",
  status: "inicial",
  altura: "",
  peso: "",
  medidas: {},
  dobras: {},
  fotos: {},
  observacoes: "",
  objetivoAtual: "",
  aderenciaTreino: "",
  aderenciaDieta: "",
};

const medidasCampos = [
  ["pescoco", "Pescoço"],
  ["ombro", "Ombro"],
  ["torax", "Tórax"],
  ["cintura", "Cintura"],
  ["abdomen", "Abdômen"],
  ["quadril", "Quadril"],
  ["bracoDireito", "Braço direito"],
  ["bracoEsquerdo", "Braço esquerdo"],
  ["antebracoDireito", "Antebraço direito"],
  ["antebracoEsquerdo", "Antebraço esquerdo"],
  ["coxaDireita", "Coxa direita"],
  ["coxaEsquerda", "Coxa esquerda"],
  ["panturrilhaDireita", "Panturrilha direita"],
  ["panturrilhaEsquerda", "Panturrilha esquerda"],
];

const dobrasCampos = [
  ["peitoral", "Peitoral"],
  ["abdominal", "Abdominal"],
  ["coxa", "Coxa"],
  ["triceps", "Tríceps"],
  ["subescapular", "Subescapular"],
  ["supraIliaca", "Supra-ilíaca"],
  ["axilarMedia", "Axilar média"],
];

function AvaliacaoModal({ alunos, avaliacao, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...avaliacaoVazia,
    ...avaliacao,
    medidas: { ...avaliacaoVazia.medidas, ...avaliacao?.medidas },
    dobras: { ...avaliacaoVazia.dobras, ...avaliacao?.dobras },
    fotos: { ...avaliacaoVazia.fotos, ...avaliacao?.fotos },
  }));
  const toast = useToast();

  const alunosOptions = useMemo(
    () => alunos.map((aluno) => aluno.nome).filter(Boolean),
    [alunos]
  );

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function atualizarGrupo(grupo, campo, valor) {
    setForm({
      ...form,
      [grupo]: {
        ...form[grupo],
        [campo]: valor,
      },
    });
  }

  function salvar() {
    if (!form.aluno.trim() || !form.data) {
      toast.aviso("Avaliação incompleta", "Informe o aluno e a data da avaliação.");
      return;
    }

    onSave({
      ...form,
      aluno: form.aluno.trim(),
    });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={titulo}>Avaliação Física</h2>
            <p style={subtitulo}>Registre medidas, fotos e indicadores corporais.</p>
          </div>
          <button onClick={onClose} style={botaoSecundario}>Fechar</button>
        </div>

        <Secao titulo="Dados básicos">
          <Campo label="Aluno">
            <input
              list="alunos-avaliacao"
              value={form.aluno}
              onChange={(e) => atualizar("aluno", e.target.value)}
              style={campo}
            />
            <datalist id="alunos-avaliacao">
              {alunosOptions.map((nome) => (
                <option key={nome} value={nome} />
              ))}
            </datalist>
          </Campo>
          <Input label="Data da avaliação" type="date" value={form.data} onChange={(valor) => atualizar("data", valor)} />
          <Input label="Idade" value={form.idade} onChange={(valor) => atualizar("idade", valor)} />
          <Campo label="Sexo">
            <select value={form.sexo} onChange={(e) => atualizar("sexo", e.target.value)} style={campo}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </Campo>
          <Campo label="Status da avaliação">
            <select value={form.status} onChange={(e) => atualizar("status", e.target.value)} style={campo}>
              <option value="inicial">Inicial</option>
              <option value="acompanhamento">Acompanhamento</option>
              <option value="retorno">Retorno</option>
              <option value="final">Final</option>
            </select>
          </Campo>
          <Input label="Altura (cm)" value={form.altura} onChange={(valor) => atualizar("altura", valor)} />
          <Input label="Peso atual (kg)" value={form.peso} onChange={(valor) => atualizar("peso", valor)} />
        </Secao>

        <Secao titulo="Medidas corporais (cm)">
          {medidasCampos.map(([chave, label]) => (
            <Input
              key={chave}
              label={label}
              value={form.medidas[chave] || ""}
              onChange={(valor) => atualizarGrupo("medidas", chave, valor)}
            />
          ))}
        </Secao>

        <Secao titulo="Dobras cutâneas (opcional)">
          {dobrasCampos.map(([chave, label]) => (
            <Input
              key={chave}
              label={label}
              value={form.dobras[chave] || ""}
              onChange={(valor) => atualizarGrupo("dobras", chave, valor)}
            />
          ))}
        </Secao>

        <Secao titulo="Fotos (opcional)">
          <Input label="Foto frente" value={form.fotos.frente || ""} onChange={(valor) => atualizarGrupo("fotos", "frente", valor)} />
          <Input label="Foto lateral" value={form.fotos.lateral || ""} onChange={(valor) => atualizarGrupo("fotos", "lateral", valor)} />
          <Input label="Foto costas" value={form.fotos.costas || ""} onChange={(valor) => atualizarGrupo("fotos", "costas", valor)} />
        </Secao>

        <Secao titulo="Observações">
          <Input label="Objetivo atual" value={form.objetivoAtual} onChange={(valor) => atualizar("objetivoAtual", valor)} />
          <Input label="Aderência ao treino" value={form.aderenciaTreino} onChange={(valor) => atualizar("aderenciaTreino", valor)} />
          <Input label="Aderência à dieta" value={form.aderenciaDieta} onChange={(valor) => atualizar("aderenciaDieta", valor)} />
          <Campo label="Observações do avaliador">
            <textarea
              rows="4"
              value={form.observacoes}
              onChange={(e) => atualizar("observacoes", e.target.value)}
              style={{ ...campo, minHeight: "96px", resize: "vertical" }}
            />
          </Campo>
        </Secao>

        <div style={rodape}>
          <button onClick={onClose} style={botaoSecundario}>Cancelar</button>
          <button onClick={salvar} style={botaoPrimario}>Salvar Avaliação</button>
        </div>
      </div>
    </div>
  );
}

function Secao({ titulo, children }) {
  return (
    <section style={secao}>
      <h3 style={secaoTitulo}>{titulo}</h3>
      <div style={grid}>{children}</div>
    </section>
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

function Input({ label, value, onChange, type = "text" }) {
  return (
    <Campo label={label}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={campo} />
    </Campo>
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
  width: "min(980px, 100%)",
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
  gap: "16px",
  alignItems: "flex-start",
};

const titulo = { margin: 0, fontSize: "22px" };
const subtitulo = { color: "#6b7280", fontSize: "14px", marginTop: "5px" };

const secao = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "22px",
  paddingTop: "18px",
};

const secaoTitulo = { margin: "0 0 14px", fontSize: "17px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
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

export default AvaliacaoModal;

import { useEffect, useMemo, useState } from "react";
import AvaliacaoFotoField from "../features/avaliacoes/components/AvaliacaoFotoField";
import { useToast } from "../hooks/useToast";

const avaliacaoVazia = {
  alunoId: "",
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

function AvaliacaoModal({ alunos, avaliacao, alunoIdInicial = "", onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...avaliacaoVazia,
    alunoId: avaliacao?.alunoId || alunoIdInicial || "",
    ...avaliacao,
    medidas: { ...avaliacaoVazia.medidas, ...avaliacao?.medidas },
    dobras: { ...avaliacaoVazia.dobras, ...avaliacao?.dobras },
    fotos: { ...avaliacaoVazia.fotos, ...avaliacao?.fotos },
  }));
  const [fotosLocais, setFotosLocais] = useState({
    frente: { file: null, previewUrl: "", removida: false },
    lateral: { file: null, previewUrl: "", removida: false },
    costas: { file: null, previewUrl: "", removida: false },
  });
  const toast = useToast();

  const alunosPorId = useMemo(
    () => new Map(alunos.map((aluno) => [aluno.id, aluno])),
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

  useEffect(() => () => {
    Object.values(fotosLocais).forEach((foto) => {
      if (foto.previewUrl) URL.revokeObjectURL(foto.previewUrl);
    });
  }, [fotosLocais]);

  function atualizarFotoLocal(campo, file) {
    setFotosLocais((atuais) => {
      if (atuais[campo]?.previewUrl) URL.revokeObjectURL(atuais[campo].previewUrl);
      return {
        ...atuais,
        [campo]: {
          file,
          previewUrl: URL.createObjectURL(file),
          removida: false,
        },
      };
    });
  }

  function removerFotoLocal(campo) {
    setFotosLocais((atuais) => {
      if (atuais[campo]?.previewUrl) URL.revokeObjectURL(atuais[campo].previewUrl);
      return {
        ...atuais,
        [campo]: {
          file: null,
          previewUrl: "",
          removida: true,
        },
      };
    });
  }

  function previewFoto(campo) {
    const local = fotosLocais[campo];
    if (local.previewUrl) return local.previewUrl;
    if (local.removida) return "";
    return form.fotosPreview?.[campo] || form.fotos[campo] || "";
  }

  function salvar() {
    const alunoSelecionado = alunosPorId.get(form.alunoId);

    if (!alunoSelecionado || !form.data) {
      toast.aviso("Avaliação incompleta", "Informe o aluno e a data da avaliação.");
      return;
    }

    onSave({
      ...form,
      fotosPendentes: {
        frente: { file: fotosLocais.frente.file, removida: fotosLocais.frente.removida },
        lateral: { file: fotosLocais.lateral.file, removida: fotosLocais.lateral.removida },
        costas: { file: fotosLocais.costas.file, removida: fotosLocais.costas.removida },
      },
      alunoId: alunoSelecionado.id,
      aluno: alunoSelecionado.nome,
      nomeAluno: alunoSelecionado.nome,
    });
  }

  return (
    <div style={overlay}>
      <div style={modal} data-testid="avaliacao-form">
        <div style={modalTopo}>
          <div>
            <h2 style={titulo}>Avaliação Física</h2>
            <p style={subtitulo}>Registre medidas, fotos e indicadores corporais.</p>
          </div>
          <button onClick={onClose} style={botaoSecundario}>Fechar</button>
        </div>

        <Secao titulo="Dados básicos">
          <Campo label="Aluno *" helper="Obrigatorio. O aluno contextual vem selecionado quando o fluxo parte da ficha do aluno.">
            <select
              id="avaliacao-student"
              data-testid="avaliacao-student"
              value={form.alunoId || ""}
              onChange={(e) => atualizar("alunoId", e.target.value)}
              required
              style={campo}
            >
              <option value="">Selecione</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
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
          <Input label="Altura (cm)" value={form.altura} onChange={(valor) => atualizar("altura", valor)} helper="Unidade: cm. Exemplo: 168." />
          <Input label="Peso atual (kg)" value={form.peso} onChange={(valor) => atualizar("peso", valor)} helper="Unidade: kg. Exemplo: 72,5." />
        </Secao>

        <Secao titulo="Medidas corporais (cm)">
          <p style={avisoFotos}>Unidade: cm.</p>
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
          <p style={avisoFotos}>Unidade: mm.</p>
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
          <p style={avisoFotos}>
            As fotos sao opcionais e ajudam na comparacao visual da evolucao.
          </p>
          <AvaliacaoFotoField
            id="avaliacao-foto-frente"
            label="Foto frente"
            value={fotosLocais.frente.file}
            previewUrl={previewFoto("frente")}
            onFileChange={(file) => atualizarFotoLocal("frente", file)}
            onRemove={() => removerFotoLocal("frente")}
          />
          <AvaliacaoFotoField
            id="avaliacao-foto-lateral"
            label="Foto lateral"
            value={fotosLocais.lateral.file}
            previewUrl={previewFoto("lateral")}
            onFileChange={(file) => atualizarFotoLocal("lateral", file)}
            onRemove={() => removerFotoLocal("lateral")}
          />
          <AvaliacaoFotoField
            id="avaliacao-foto-costas"
            label="Foto costas"
            value={fotosLocais.costas.file}
            previewUrl={previewFoto("costas")}
            onFileChange={(file) => atualizarFotoLocal("costas", file)}
            onRemove={() => removerFotoLocal("costas")}
          />
          <p style={avisoFotos}>
            As imagens selecionadas serao enviadas ao salvar a avaliacao.
          </p>
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

function Campo({ label, children, helper }) {
  return (
    <label style={campoGrupo}>
      <span style={labelCampo}>{label}</span>
      {children}
      {helper && <span style={textoAuxiliar}>{helper}</span>}
    </label>
  );
}

function Input({ label, value, onChange, type = "text", helper, required = false }) {
  return (
    <Campo label={label} helper={helper || (type === "date" ? "Obrigatorio. Informe a data do registro." : "")}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required || type === "date"}
        style={campo}
      />
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
const textoAuxiliar = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.35,
};

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

const avisoFotos = {
  gridColumn: "1 / -1",
  margin: "0",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.45,
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

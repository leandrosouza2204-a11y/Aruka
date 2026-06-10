import { useMemo, useState } from "react";
import { useToast } from "../hooks/useToast";

const anamneseVazia = {
  aluno: "",
  profissao: "",
  rotinaTrabalho: "",
  objetivoPrincipal: "",
  objetivoSecundario: "",
  doencaDiagnosticada: "",
  medicamento: "",
  doresLesoes: "",
  cirurgia: "",
  restricaoMedica: "",
  liberadoExercicios: "",
  jaTreinou: "",
  tempoExperiencia: "",
  frequenciaSemanal: "",
  diasDisponiveis: "",
  tempoPorTreino: "",
  localTreino: "",
  equipamentos: "",
  qualidadeSono: "",
  horasSono: "",
  nivelEstresse: "",
  ingestaoAgua: "",
  consumoAlcool: "",
  tabagismo: "",
  segueDieta: "",
  nutricionista: "",
  refeicoesDia: "",
  dificuldadeAlimentacao: "",
  fomeNoite: "",
  compulsaoAlimentar: "",
  exerciciosGosta: "",
  exerciciosNaoGosta: "",
  gruposPrioritarios: "",
  limitacoesHorario: "",
  observacoesImportantes: "",
  escalaSono: "",
  escalaEstresse: "",
  escalaEnergia: "",
  escalaFome: "",
  escalaMotivacao: "",
  escalaAdesaoRotina: "",
};

const camposSimNao = new Set([
  "doencaDiagnosticada",
  "medicamento",
  "doresLesoes",
  "cirurgia",
  "restricaoMedica",
  "liberadoExercicios",
  "jaTreinou",
  "consumoAlcool",
  "tabagismo",
  "segueDieta",
  "nutricionista",
  "fomeNoite",
  "compulsaoAlimentar",
]);

const escalas = [
  ["escalaSono", "Sono"],
  ["escalaEstresse", "Estresse"],
  ["escalaEnergia", "Energia"],
  ["escalaFome", "Fome"],
  ["escalaMotivacao", "Motivação"],
  ["escalaAdesaoRotina", "Adesão à rotina"],
];

const secoes = [
  {
    titulo: "Dados pessoais",
    campos: [
      ["profissao", "Profissão"],
      ["rotinaTrabalho", "Rotina de trabalho"],
      ["objetivoPrincipal", "Objetivo principal"],
      ["objetivoSecundario", "Objetivo secundário"],
    ],
  },
  {
    titulo: "Saúde geral",
    campos: [
      ["doencaDiagnosticada", "Possui alguma doença diagnosticada?"],
      ["medicamento", "Usa medicamento?"],
      ["doresLesoes", "Possui dores ou lesões?"],
      ["cirurgia", "Já fez cirurgia?"],
      ["restricaoMedica", "Possui restrição médica?"],
      ["liberadoExercicios", "Está liberado para praticar exercícios?"],
    ],
  },
  {
    titulo: "Histórico de treino",
    campos: [
      ["jaTreinou", "Já treinou musculação?"],
      ["tempoExperiencia", "Tempo de experiência"],
      ["frequenciaSemanal", "Frequência semanal disponível"],
      ["diasDisponiveis", "Dias disponíveis"],
      ["tempoPorTreino", "Tempo por treino"],
      ["localTreino", "Local de treino"],
      ["equipamentos", "Equipamentos disponíveis"],
    ],
  },
  {
    titulo: "Hábitos",
    campos: [
      ["qualidadeSono", "Qualidade do sono"],
      ["horasSono", "Horas de sono por noite"],
      ["ingestaoAgua", "Ingestão de água"],
      ["consumoAlcool", "Consumo de álcool"],
      ["tabagismo", "Tabagismo"],
    ],
  },
  {
    titulo: "Alimentação",
    campos: [
      ["segueDieta", "Segue dieta?"],
      ["nutricionista", "Possui nutricionista?"],
      ["refeicoesDia", "Número de refeições por dia"],
      ["dificuldadeAlimentacao", "Dificuldade com alimentação"],
      ["fomeNoite", "Fome à noite"],
      ["compulsaoAlimentar", "Compulsão alimentar"],
    ],
  },
  {
    titulo: "Preferências",
    campos: [
      ["exerciciosGosta", "Exercícios que gosta"],
      ["exerciciosNaoGosta", "Exercícios que não gosta"],
      ["gruposPrioritarios", "Grupos musculares prioritários"],
      ["limitacoesHorario", "Limitações de horário"],
      ["observacoesImportantes", "Observações importantes"],
    ],
  },
];

function AnamneseModal({ alunos, anamnese, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...anamneseVazia, ...anamnese }));
  const toast = useToast();
  const alunosOptions = useMemo(
    () => alunos.map((aluno) => aluno.nome).filter(Boolean),
    [alunos]
  );

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function salvar() {
    if (!form.aluno.trim()) {
      toast.aviso("Aluno obrigatório", "Informe o aluno da anamnese.");
      return;
    }

    onSave({ ...form, aluno: form.aluno.trim() });
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={modalTopo}>
          <div>
            <h2 style={titulo}>Anamnese</h2>
            <p style={subtitulo}>Mapeie saúde, rotina, hábitos e preferências.</p>
          </div>
          <button onClick={onClose} style={botaoSecundario}>Fechar</button>
        </div>

        <section style={secao}>
          <h3 style={secaoTitulo}>Aluno</h3>
          <label style={campoGrupo}>
            <span style={labelCampo}>Aluno</span>
            <input
              list="alunos-anamnese"
              value={form.aluno}
              onChange={(e) => atualizar("aluno", e.target.value)}
              style={campo}
            />
            <datalist id="alunos-anamnese">
              {alunosOptions.map((nome) => (
                <option key={nome} value={nome} />
              ))}
            </datalist>
          </label>
        </section>

        <section style={secao}>
          <h3 style={secaoTitulo}>Escalas de acompanhamento</h3>
          <div style={grid}>
            {escalas.map(([chave, label]) => (
              <label key={chave} style={campoGrupo}>
                <span style={labelCampo}>{label} (1 a 5)</span>
                <select
                  value={form[chave]}
                  onChange={(e) => atualizar(chave, e.target.value)}
                  style={campo}
                >
                  <option value="">Selecione</option>
                  <option value="1">1 - Muito baixo</option>
                  <option value="2">2 - Baixo</option>
                  <option value="3">3 - Moderado</option>
                  <option value="4">4 - Bom</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </label>
            ))}
          </div>
        </section>

        {secoes.map((secaoItem) => (
          <section key={secaoItem.titulo} style={secao}>
            <h3 style={secaoTitulo}>{secaoItem.titulo}</h3>
            <div style={grid}>
              {secaoItem.campos.map(([chave, label]) => (
                <label key={chave} style={campoGrupo}>
                  <span style={labelCampo}>{label}</span>
                  {chave === "consumoAlcool" ? (
                    <select
                      value={form[chave]}
                      onChange={(e) => atualizar(chave, e.target.value)}
                      style={campo}
                    >
                      <option value="">Selecione</option>
                      <option value="Sim">Sim</option>
                      <option value="Sim, socialmente">Sim, socialmente</option>
                      <option value="Não">Não</option>
                      <option value="Não informado">Não informado</option>
                    </select>
                  ) : camposSimNao.has(chave) ? (
                    <select
                      value={form[chave]}
                      onChange={(e) => atualizar(chave, e.target.value)}
                      style={campo}
                    >
                      <option value="">Selecione</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      <option value="Não informado">Não informado</option>
                    </select>
                  ) : (
                    <textarea
                      rows="2"
                      value={form[chave]}
                      onChange={(e) => atualizar(chave, e.target.value)}
                      style={{ ...campo, minHeight: "70px", resize: "vertical" }}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <div style={rodape}>
          <button onClick={onClose} style={botaoSecundario}>Cancelar</button>
          <button onClick={salvar} style={botaoPrimario}>Salvar Anamnese</button>
        </div>
      </div>
    </div>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

export default AnamneseModal;

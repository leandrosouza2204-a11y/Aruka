import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExercicioCard from "./ExercicioCard";
import TreinoSalvarModeloModal from "../features/treinos/components/TreinoSalvarModeloModal";
import { useConfirm } from "../hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import {
  areTreinoEditorStatesEqual,
  normalizeTreinoEditorState,
  validateTreinoEditorState,
} from "../features/treinos/utils/treinoEditorState";

const treinoVazio = {
  alunoId: "",
  aluno: "",
  rotina: "",
  objetivo: "",
  nivel: "",
  status: "Ativo",
  dataInicio: "",
  dataRevisao: "",
  diasPorSemana: "",
  observacoes: "",
  dias: [],
};

const diaVazio = {
  nome: "",
  descricao: "",
  exercicios: [],
};

const exercicioVazio = {
  nome: "",
  series: "",
  repeticoes: "",
  carga: "",
  descanso: "",
  observacoes: "",
  video: "",
};

function TreinoModal({ alunos, treino, onClose, onSave, onSaveTemplate }) {
  const [form, setForm] = useState(() => ({
    ...treinoVazio,
    ...treino,
    dias: treino?.dias?.length ? treino.dias : [],
  }));
  const [initialSnapshot, setInitialSnapshot] = useState(() =>
    normalizeTreinoEditorState({
      form: {
        ...treinoVazio,
        ...treino,
        dias: treino?.dias?.length ? treino.dias : [],
      },
      exerciseDrafts: {},
    })
  );
  const [novoDia, setNovoDia] = useState(diaVazio);
  const [exercicioPorDia, setExercicioPorDia] = useState({});
  const [edicaoExercicio, setEdicaoExercicio] = useState(null);
  const [salvandoModelo, setSalvandoModelo] = useState(false);
  const [salvandoTreino, setSalvandoTreino] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState({});
  const modalRef = useRef(null);
  const alunoRef = useRef(null);
  const rotinaRef = useRef(null);
  const adicionarDiaRef = useRef(null);
  const adicionarExercicioRef = useRef(null);
  const toast = useToast();
  const { confirmar } = useConfirm();

  const titulo = treino?.id ? "Editar Treino" : "Cadastro de Treino";

  const alunosPorId = useMemo(
    () => new Map(alunos.map((aluno) => [aluno.id, aluno])),
    [alunos]
  );
  const estadoAtual = useMemo(
    () => ({ form, exerciseDrafts: exercicioPorDia }),
    [exercicioPorDia, form]
  );
  const isDirty = useMemo(
    () => !areTreinoEditorStatesEqual(initialSnapshot, estadoAtual),
    [estadoAtual, initialSnapshot]
  );
  const requestCloseEditor = useCallback(async (reason) => {
    if (!isDirty) {
      onClose(reason);
      return true;
    }

    const discard = await confirmar({
      titulo: "Descartar alteracoes?",
      descricao: "Voce possui alteracoes nao salvas. Ao sair, essas alteracoes serao perdidas.",
      textoCancelar: "Continuar editando",
      textoConfirmar: "Descartar alteracoes",
      variante: "perigo",
      testIdPrefix: "treino-discard",
    });

    if (!discard) return false;
    onClose(reason);
    return true;
  }, [confirmar, isDirty, onClose]);

  useEffect(() => {
    modalRef.current?.querySelector("select, input, textarea, button")?.focus?.();
  }, []);

  useEffect(() => {
    if (!isDirty) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return undefined;

    window.history.pushState({ treinoEditorGuard: true }, "", window.location.href);

    function handlePopState() {
      requestCloseEditor("history").then((closed) => {
        if (closed) window.setTimeout(() => window.history.back(), 0);
        else window.history.pushState({ treinoEditorGuard: true }, "", window.location.href);
      });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty, requestCloseEditor]);

  function atualizarCampo(campo, valor) {
    setForm({ ...form, [campo]: valor });
    setErrosValidacao((atuais) => ({
      ...atuais,
      [campo === "alunoId" ? "student" : campo === "rotina" ? "name" : campo]: undefined,
    }));
  }

  function adicionarDia() {
    if (!novoDia.nome.trim()) {
      toast.aviso("Nome obrigatório", "Informe o nome do dia de treino.");
      return;
    }

    setForm({
      ...form,
      dias: [
        ...form.dias,
        {
          ...novoDia,
          id: crypto.randomUUID(),
          nome: novoDia.nome.trim(),
          descricao: novoDia.descricao.trim(),
          exercicios: [],
        },
      ],
    });
    setNovoDia(diaVazio);
    setErrosValidacao((atuais) => ({ ...atuais, days: undefined }));
  }

  async function removerDia(id) {
    const confirmado = await confirmar({
      titulo: "Excluir dia de treino?",
      descricao: "Os exercícios deste dia também serão removidos.",
      textoConfirmar: "Excluir",
    });

    if (!confirmado) return;

    setForm({
      ...form,
      dias: form.dias.filter((dia) => dia.id !== id),
    });
  }

  function atualizarExercicioTemporario(diaId, campo, valor) {
    const atual = exercicioPorDia[diaId] || exercicioVazio;
    setExercicioPorDia({
      ...exercicioPorDia,
      [diaId]: {
        ...atual,
        [campo]: valor,
      },
    });
  }

  function salvarExercicio(diaId) {
    const exercicio = exercicioPorDia[diaId] || exercicioVazio;

    if (!exercicio.nome.trim()) {
      toast.aviso("Nome obrigatório", "Informe o nome do exercício.");
      return;
    }

    const diasAtualizados = form.dias.map((dia) => {
      if (dia.id !== diaId) return dia;

      const exercicioSalvo = {
        ...exercicio,
        id: edicaoExercicio?.diaId === diaId ? edicaoExercicio.exercicioId : crypto.randomUUID(),
        nome: exercicio.nome.trim(),
      };

      const exerciciosAtualizados =
        edicaoExercicio?.diaId === diaId
          ? dia.exercicios.map((item) =>
              item.id === edicaoExercicio.exercicioId ? exercicioSalvo : item
            )
          : [...dia.exercicios, exercicioSalvo];

      return {
        ...dia,
        exercicios: exerciciosAtualizados,
      };
    });

    setForm({ ...form, dias: diasAtualizados });
    setExercicioPorDia({ ...exercicioPorDia, [diaId]: exercicioVazio });
    setEdicaoExercicio(null);
    setErrosValidacao((atuais) => ({ ...atuais, exercises: undefined }));
  }

  function editarExercicio(diaId, exercicio) {
    setExercicioPorDia({ ...exercicioPorDia, [diaId]: exercicio });
    setEdicaoExercicio({ diaId, exercicioId: exercicio.id });
  }

  function cancelarEdicaoExercicio(diaId) {
    setExercicioPorDia({ ...exercicioPorDia, [diaId]: exercicioVazio });
    setEdicaoExercicio(null);
  }

  function moverExercicio(diaId, exercicioId, direcao) {
    setForm({
      ...form,
      dias: form.dias.map((dia) => {
        if (dia.id !== diaId) return dia;

        const indice = dia.exercicios.findIndex(
          (exercicio) => exercicio.id === exercicioId
        );
        const destino = indice + direcao;

        if (indice < 0 || destino < 0 || destino >= dia.exercicios.length) {
          return dia;
        }

        const exercicios = [...dia.exercicios];
        const [movido] = exercicios.splice(indice, 1);
        exercicios.splice(destino, 0, movido);

        return {
          ...dia,
          exercicios,
        };
      }),
    });
  }

  async function excluirExercicio(diaId, exercicioId) {
    const confirmado = await confirmar({
      titulo: "Excluir exercício?",
      descricao: "Esta ação remove apenas o exercício selecionado deste dia.",
      textoConfirmar: "Excluir",
      testIdPrefix: "exercise-delete",
    });

    if (!confirmado) return;

    setForm({
      ...form,
      dias: form.dias.map((dia) =>
        dia.id === diaId
          ? {
              ...dia,
              exercicios: dia.exercicios.filter(
                (exercicio) => exercicio.id !== exercicioId
              ),
            }
          : dia
      ),
    });
  }

  async function salvarTreino() {
    if (salvandoTreino) return;
    const validacao = validateTreinoEditorState(estadoAtual, alunos);

    if (!validacao.ok) {
      setErrosValidacao(validacao.errors);
      toast.aviso("Treino incompleto", Object.values(validacao.errors)[0]);
      window.setTimeout(() => focarPrimeiroErro(validacao.errors), 0);
      return;
    }

    const alunoSelecionado = alunosPorId.get(form.alunoId);

    setSalvandoTreino(true);
    try {
      const salvo = await onSave({
        ...form,
        alunoId: alunoSelecionado.id,
        aluno: alunoSelecionado.nome,
        nomeAluno: alunoSelecionado.nome,
        rotina: form.rotina.trim(),
        objetivo: form.objetivo.trim(),
        nivel: form.nivel.trim(),
        status: form.status || "Ativo",
        dataInicio: form.dataInicio,
        dataRevisao: form.dataRevisao,
        observacoes: form.observacoes.trim(),
        diasPorSemana: Number(form.diasPorSemana || form.dias.length || 0),
      });
      if (salvo !== false) {
        setInitialSnapshot(normalizeTreinoEditorState(estadoAtual));
      }
    } finally {
      setSalvandoTreino(false);
    }
  }

  function focarPrimeiroErro(errors) {
    if (errors.name) rotinaRef.current?.focus();
    else if (errors.student) alunoRef.current?.focus();
    else if (errors.days) adicionarDiaRef.current?.focus();
    else if (errors.exercises) adicionarExercicioRef.current?.focus();
  }

  function handleOverlayMouseDown(event) {
    if (event.target === event.currentTarget) requestCloseEditor("backdrop");
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      requestCloseEditor("escape");
    }
  }

  function abrirSalvarModelo() {
    const totalExercicios = form.dias.reduce(
      (total, dia) => total + Number(dia.exercicios?.length || 0),
      0
    );

    if (!form.dias.length || totalExercicios === 0) {
      toast.aviso(
        "Modelo incompleto",
        "Inclua pelo menos um dia com exercicio antes de salvar como modelo."
      );
      return;
    }

    setSalvandoModelo(true);
  }

  async function salvarComoModelo(metadata) {
    if (!onSaveTemplate) return;

    await onSaveTemplate(metadata, form);
    setSalvandoModelo(false);
  }

  return (
    <div className="treino-modal-overlay" style={overlay} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={modalRef}
        className="treino-editor-modal"
        style={modal}
        data-testid="treino-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="treino-editor-title"
        onKeyDown={handleKeyDown}
      >
        <div className="treino-editor-header" style={modalTopo}>
          <div>
            <div style={tituloLinha}>
              <h2 id="treino-editor-title" style={tituloModal}>{titulo}</h2>
              {isDirty && (
                <span style={dirtyIndicator} data-testid="treino-editor-dirty-indicator">
                  Alteracoes nao salvas
                </span>
              )}
            </div>
            <p style={subtitulo}>Monte a rotina, os dias e os exercícios.</p>
          </div>

          <button onClick={() => requestCloseEditor("close")} style={botaoSecundario} data-testid="treino-editor-close">
            Fechar
          </button>
        </div>

        <div className="treino-editor-scroll" data-testid="treino-editor-scroll">
          {Object.values(errosValidacao).filter(Boolean).length > 0 && (
            <div
              style={validationSummary}
              data-testid="treino-editor-validation-summary"
              role="alert"
              tabIndex={-1}
            >
              <strong>Revise o treino antes de salvar.</strong>
              <ul style={validationList}>
                {Object.values(errosValidacao).filter(Boolean).map((erro) => (
                  <li key={erro}>{erro}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="treino-editor-form-grid" style={formGrid}>
          <Campo label="Aluno">
            <select
              ref={alunoRef}
              value={form.alunoId || ""}
              onChange={(e) => atualizarCampo("alunoId", e.target.value)}
              style={campoComErro(errosValidacao.student)}
              data-testid="treino-form-student"
              aria-invalid={Boolean(errosValidacao.student)}
              aria-describedby={errosValidacao.student ? "treino-editor-error-student" : undefined}
            >
              <option value="">Selecione</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
            {errosValidacao.student && <ErroCampo id="treino-editor-error-student">{errosValidacao.student}</ErroCampo>}
          </Campo>

          <Campo label="Nome da rotina">
            <input
              ref={rotinaRef}
              placeholder="Ex: Hipertrofia - Fase 1"
              value={form.rotina}
              onChange={(e) => atualizarCampo("rotina", e.target.value)}
              style={campoComErro(errosValidacao.name)}
              data-testid="treino-editor-name"
              aria-invalid={Boolean(errosValidacao.name)}
              aria-describedby={errosValidacao.name ? "treino-editor-error-name" : undefined}
            />
            {errosValidacao.name && <ErroCampo id="treino-editor-error-name">{errosValidacao.name}</ErroCampo>}
          </Campo>

          <Campo label="Objetivo">
            <input
              placeholder="Ex: Ganho de massa muscular"
              value={form.objetivo}
              onChange={(e) => atualizarCampo("objetivo", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Nível">
            <select
              value={form.nivel}
              onChange={(e) => atualizarCampo("nivel", e.target.value)}
              style={campo}
            >
              <option value="">Selecione</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </Campo>

          <Campo label="Status">
            <select
              value={form.status}
              onChange={(e) => atualizarCampo("status", e.target.value)}
              style={campo}
            >
              <option value="Ativo">Ativo</option>
              <option value="Em revisão">Em revisão</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </Campo>

          <Campo label="Data de início">
            <input
              type="date"
              value={form.dataInicio}
              onChange={(e) => atualizarCampo("dataInicio", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Data de revisão">
            <input
              type="date"
              value={form.dataRevisao}
              onChange={(e) => atualizarCampo("dataRevisao", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Dias por semana">
            <input
              type="number"
              min="1"
              max="7"
              value={form.diasPorSemana}
              onChange={(e) => atualizarCampo("diasPorSemana", e.target.value)}
              style={campo}
            />
          </Campo>

          <Campo label="Observações gerais">
            <textarea
              rows="3"
              placeholder="Orientações, restrições ou ajustes gerais"
              value={form.observacoes}
              onChange={(e) => atualizarCampo("observacoes", e.target.value)}
              style={{ ...campo, minHeight: "84px", resize: "vertical" }}
            />
          </Campo>
          </div>

        <section className="treino-editor-section" style={bloco}>
          <h3 style={secaoTitulo}>Dias de treino</h3>
          <div className="treino-editor-day-form" style={diaForm}>
            <input
              placeholder="Ex: Treino A"
              value={novoDia.nome}
              onChange={(e) => setNovoDia({ ...novoDia, nome: e.target.value })}
              style={campo}
            />
            <input
              placeholder="Ex: Peito, Ombro e Tríceps"
              value={novoDia.descricao}
              onChange={(e) =>
                setNovoDia({ ...novoDia, descricao: e.target.value })
              }
              style={campo}
            />
            <button onClick={adicionarDia} style={botaoSecundario} data-testid="treino-day-add" ref={adicionarDiaRef}>
              Adicionar Dia
            </button>
          </div>
          {errosValidacao.days && <ErroCampo id="treino-editor-error-days">{errosValidacao.days}</ErroCampo>}

          <div className="treino-editor-days-list" style={diasLista}>
            {form.dias.map((dia) => {
              const exercicioAtual = exercicioPorDia[dia.id] || exercicioVazio;
              const editando =
                edicaoExercicio?.diaId === dia.id ? "Salvar exercício" : "Adicionar exercício";

              return (
                <div key={dia.id} className="treino-editor-day-card" style={diaCard}>
                  <div className="treino-editor-day-header" style={diaTopo}>
                    <div>
                      <h4 style={diaTitulo}>{dia.nome}</h4>
                      <p style={subtitulo}>{dia.descricao || "Sem descrição"}</p>
                    </div>
                    <button onClick={() => removerDia(dia.id)} style={botaoExcluir}>
                      Excluir Dia
                    </button>
                  </div>

                  <div
                    className="treino-editor-exercise-form"
                    style={exercicioForm}
                    data-testid="exercise-form"
                  >
                    <input
                      placeholder="Nome do exercício"
                      value={exercicioAtual.nome}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "nome",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-name"
                      aria-label="Nome do exercício"
                    />
                    <input
                      placeholder="Séries"
                      value={exercicioAtual.series}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "series",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-sets"
                      inputMode="decimal"
                      aria-label="Séries"
                    />
                    <input
                      placeholder="Repetições"
                      value={exercicioAtual.repeticoes}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "repeticoes",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-repetitions"
                      aria-label="Repetições"
                    />
                    <input
                      placeholder="Carga"
                      value={exercicioAtual.carga}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "carga",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-load"
                      inputMode="decimal"
                      aria-label="Carga"
                    />
                    <input
                      placeholder="Descanso"
                      value={exercicioAtual.descanso}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "descanso",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-rest"
                      aria-label="Descanso"
                    />
                    <input
                      placeholder="Link de vídeo"
                      value={exercicioAtual.video}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "video",
                          e.target.value
                        )
                      }
                      style={campo}
                      data-testid="exercise-video"
                      aria-label="Link de vídeo"
                    />
                    <textarea
                      rows="2"
                      placeholder="Observações"
                      value={exercicioAtual.observacoes}
                      onChange={(e) =>
                        atualizarExercicioTemporario(
                          dia.id,
                          "observacoes",
                          e.target.value
                        )
                      }
                      style={{ ...campo, minHeight: "70px", resize: "vertical" }}
                      data-testid="exercise-notes"
                      aria-label="Observações do exercício"
                    />
                    <button
                      ref={adicionarExercicioRef}
                      type="button"
                      onClick={() => salvarExercicio(dia.id)}
                      style={botaoPrimario}
                      data-testid="exercise-add"
                      data-qa="treino-exercise-add"
                    >
                      {editando}
                    </button>
                    {edicaoExercicio?.diaId === dia.id && (
                      <button
                        type="button"
                        onClick={() => cancelarEdicaoExercicio(dia.id)}
                        style={botaoSecundario}
                        data-testid="exercise-cancel"
                      >
                        Cancelar edição
                      </button>
                    )}
                  </div>

                  <div className="treino-editor-exercises-list" style={exerciciosLista}>
                    {dia.exercicios.map((exercicio, index) => (
                      <ExercicioCard
                        key={exercicio.id}
                        exercicio={exercicio}
                        index={index}
                        total={dia.exercicios.length}
                        onEdit={() => editarExercicio(dia.id, exercicio)}
                        onDelete={() => excluirExercicio(dia.id, exercicio.id)}
                        onMoveUp={() => moverExercicio(dia.id, exercicio.id, -1)}
                        onMoveDown={() => moverExercicio(dia.id, exercicio.id, 1)}
                      />
                    ))}

                    {dia.exercicios.length === 0 && (
                      <p style={vazio}>Nenhum exercício cadastrado neste dia.</p>
                    )}
                  </div>
                </div>
              );
            })}

            {form.dias.length === 0 && (
              <p style={vazio}>Adicione pelo menos um dia de treino.</p>
            )}
            {errosValidacao.exercises && <ErroCampo id="treino-editor-error-exercises">{errosValidacao.exercises}</ErroCampo>}
          </div>
        </section>

        </div>

        <div className="treino-editor-footer" style={rodape} data-testid="treino-editor-footer">
          <button onClick={() => requestCloseEditor("cancel")} style={botaoSecundario} data-testid="treino-editor-cancel">
            Cancelar
          </button>
          {onSaveTemplate && (
            <button
              onClick={abrirSalvarModelo}
              style={botaoSecundario}
              data-testid="save-workout-template"
            >
              Salvar como modelo
            </button>
          )}
          <button
            onClick={salvarTreino}
            style={salvandoTreino ? botaoDesabilitado : botaoPrimario}
            disabled={salvandoTreino}
            data-testid="treino-editor-save"
          >
            {salvandoTreino ? "Salvando..." : "Salvar Treino"}
          </button>
        </div>
      </div>

      {salvandoModelo && (
        <TreinoSalvarModeloModal
          treino={form}
          onClose={() => setSalvandoModelo(false)}
          onSubmit={salvarComoModelo}
        />
      )}
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

function ErroCampo({ id, children }) {
  return (
    <span id={id} style={erroCampo}>
      {children}
    </span>
  );
}

function campoComErro(erro) {
  return erro ? { ...campo, ...campoErro } : campo;
}

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 30,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  alignItems: "flex-start",
  gap: "16px",
};

const tituloModal = {
  margin: 0,
  fontSize: "22px",
};

const tituloLinha = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const dirtyIndicator = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "999px",
  color: "#9a3412",
  fontSize: "12px",
  fontWeight: "800",
  padding: "5px 8px",
};

const subtitulo = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "22px",
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
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const campoErro = {
  border: "1px solid #dc2626",
  boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.12)",
};

const erroCampo = {
  color: "#991b1b",
  fontSize: "12px",
  fontWeight: "750",
};

const validationSummary = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  marginTop: "18px",
  padding: "12px",
};

const validationList = {
  margin: "8px 0 0",
  paddingLeft: "18px",
};

const bloco = {
  marginTop: "24px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "20px",
};

const secaoTitulo = {
  margin: 0,
  fontSize: "18px",
};

const diaForm = {
  display: "grid",
  gridTemplateColumns: "minmax(140px, 180px) minmax(220px, 1fr) auto",
  gap: "10px",
  marginTop: "14px",
};

const diasLista = {
  display: "grid",
  gap: "16px",
  marginTop: "16px",
};

const diaCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  background: "#fff",
};

const diaTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const diaTitulo = {
  margin: 0,
  fontSize: "16px",
};

const exercicioForm = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
  marginTop: "14px",
};

const exerciciosLista = {
  display: "grid",
  gap: "10px",
  marginTop: "14px",
};

const vazio = {
  color: "#6b7280",
  fontSize: "14px",
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

const botaoDesabilitado = {
  ...botaoPrimario,
  cursor: "not-allowed",
  opacity: 0.62,
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "9px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const botaoExcluir = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "9px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default TreinoModal;


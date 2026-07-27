import { useId, useMemo, useRef, useState } from "react";
import ExercicioCard from "../../../components/ExercicioCard";
import { useConfirm } from "../../../hooks/useConfirm";
import {
  DIVISOES_MODELO_PESSOAL,
  GENEROS_REFERENCIA_MODELO,
} from "../utils/workoutTemplateSanitization";
import {
  areWorkoutTemplateDraftsEqual,
  createWorkoutTemplateEditorDraft,
  validateWorkoutTemplateDraft,
} from "../utils/workoutTemplateEditorState";
import {
  PERSONAL_TEMPLATE_MODES,
  buildPersonalTemplatePreview,
  mapPersonalTemplateManagementError,
  preparePersonalTemplateDraft,
  submitPersonalTemplateOnce,
} from "../utils/personalWorkoutTemplateManagement";

const emptyDay = { nome: "", descricao: "", exercicios: [] };
const emptyExercise = {
  nome: "",
  series: "",
  repeticoes: "",
  carga: "",
  descanso: "",
  observacoes: "",
  video: "",
};

function TreinoSalvarModeloModal({
  treino,
  modelo,
  modo = "create",
  currentUserId = "",
  onClose,
  onSubmit,
}) {
  const initialDraft = useMemo(
    () => {
      const prepared = preparePersonalTemplateDraft({
        mode: modo,
        workout: treino,
        template: modelo,
        currentUserId,
      });
      return createWorkoutTemplateEditorDraft({ treino: prepared.workout, modelo: prepared });
    },
    [currentUserId, modelo, modo, treino]
  );
  const [draft, setDraft] = useState(initialDraft);
  const [originalDraft, setOriginalDraft] = useState(initialDraft);
  const [newDay, setNewDay] = useState(emptyDay);
  const [exerciseByDay, setExerciseByDay] = useState({});
  const [editingExercise, setEditingExercise] = useState(null);
  const [status, setStatus] = useState("editingMetadata");
  const [errors, setErrors] = useState({});
  const [technicalError, setTechnicalError] = useState("");
  const nameRef = useRef(null);
  const submitGateRef = useRef({ activePromise: null });
  const modalTitleId = useId();
  const nameErrorId = useId();
  const exercisesErrorId = useId();
  const { confirmar } = useConfirm();

  const dirty = !areWorkoutTemplateDraftsEqual(originalDraft, draft);
  const saving = status === "submitting";
  const preview = useMemo(
    () =>
      buildPersonalTemplatePreview({
        mode: modo,
        draft,
        originalTemplate: modelo,
        currentUserId,
      }),
    [currentUserId, draft, modelo, modo]
  );

  async function enviar(event) {
    event.preventDefault();
    if (saving) return;

    const validation = validateWorkoutTemplateDraft(draft);
    const combinedErrors = { ...validation.errors, ...preview.validation.errors };
    setErrors(combinedErrors);
    if (!validation.ok || !preview.validation.ok) {
      setStatus("error");
      window.setTimeout(() => nameRef.current?.focus?.(), 0);
      return;
    }

    setTechnicalError("");
    setStatus("previewing");
  }

  async function confirmarPersistencia() {
    if (saving || !preview.validation.ok) return;

    try {
      setStatus("submitting");
      await submitPersonalTemplateOnce(submitGateRef.current, () => onSubmit({
        mode: modo,
        draft,
        originalTemplate: modelo,
        metadata: preview.validation.normalized.metadata,
        templateData: preview.validation.normalized.templateData,
      }, {
        ...draft.workout,
        rotina: preview.validation.normalized.metadata.name,
        objetivo: preview.validation.normalized.metadata.objective,
        nivel: preview.validation.normalized.metadata.level,
      }));
      const nextOriginal = createWorkoutTemplateEditorDraft({
        treino: {
          ...draft.workout,
          rotina: preview.validation.normalized.metadata.name,
          objetivo: preview.validation.normalized.metadata.objective,
          nivel: preview.validation.normalized.metadata.level,
        },
        modelo: { ...modelo, ...preview.validation.normalized.metadata },
      });
      setOriginalDraft(nextOriginal);
      setDraft(nextOriginal);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setTechnicalError(mapPersonalTemplateManagementError(error));
      setStatus("error");
    }
  }

  async function fechar() {
    if (!dirty || status === "success") {
      onClose();
      return;
    }

    const discard = await confirmar({
      titulo: "Descartar alteracoes?",
      descricao: "Existem alteracoes nao salvas neste modelo.",
      textoCancelar: "Continuar editando",
      textoConfirmar: "Descartar",
      testIdPrefix: "workout-template-unsaved",
    });

    if (discard) onClose();
  }

  function setMetadata(field, value) {
    setDraft((current) => ({
      ...current,
      metadata: { ...current.metadata, [field]: value },
    }));
    setStatus("editingMetadata");
  }

  function setWorkout(updater) {
    setDraft((current) => ({
      ...current,
      workout: typeof updater === "function" ? updater(current.workout) : updater,
    }));
    setStatus("editingStructure");
  }

  function addDay() {
    if (!newDay.nome.trim()) return;
    setWorkout((workout) => ({
      ...workout,
      dias: [
        ...workout.dias,
        { id: crypto.randomUUID(), nome: newDay.nome.trim(), descricao: newDay.descricao.trim(), exercicios: [] },
      ],
    }));
    setNewDay(emptyDay);
  }

  function updateExerciseDraft(dayId, field, value) {
    setExerciseByDay((current) => ({
      ...current,
      [dayId]: { ...(current[dayId] || emptyExercise), [field]: value },
    }));
  }

  function saveExercise(dayId) {
    const exercise = exerciseByDay[dayId] || emptyExercise;
    if (!exercise.nome.trim()) return;

    setWorkout((workout) => ({
      ...workout,
      dias: workout.dias.map((day) => {
        if (day.id !== dayId) return day;
        const saved = {
          ...exercise,
          id: editingExercise?.dayId === dayId ? editingExercise.exerciseId : crypto.randomUUID(),
          nome: exercise.nome.trim(),
        };
        return {
          ...day,
          exercicios:
            editingExercise?.dayId === dayId
              ? day.exercicios.map((item) => (item.id === editingExercise.exerciseId ? saved : item))
              : [...day.exercicios, saved],
        };
      }),
    }));
    setExerciseByDay((current) => ({ ...current, [dayId]: emptyExercise }));
    setEditingExercise(null);
  }

  function editExercise(dayId, exercise) {
    setExerciseByDay((current) => ({ ...current, [dayId]: exercise }));
    setEditingExercise({ dayId, exerciseId: exercise.id });
  }

  async function deleteExercise(dayId, exerciseId) {
    const confirmed = await confirmar({
      titulo: "Excluir exercicio?",
      descricao: "Esta acao remove apenas o exercicio selecionado do modelo.",
      textoConfirmar: "Excluir",
      testIdPrefix: "exercise-delete",
    });
    if (!confirmed) return;
    setWorkout((workout) => ({
      ...workout,
      dias: workout.dias.map((day) =>
        day.id === dayId
          ? { ...day, exercicios: day.exercicios.filter((exercise) => exercise.id !== exerciseId) }
          : day
      ),
    }));
    if (editingExercise?.exerciseId === exerciseId) {
      setEditingExercise(null);
      setExerciseByDay((current) => ({ ...current, [dayId]: emptyExercise }));
    }
  }

  function moveExercise(dayId, exerciseId, direction) {
    setWorkout((workout) => ({
      ...workout,
      dias: workout.dias.map((day) => {
        if (day.id !== dayId) return day;
        const index = day.exercicios.findIndex((exercise) => exercise.id === exerciseId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= day.exercicios.length) return day;
        const exercises = [...day.exercicios];
        const [moved] = exercises.splice(index, 1);
        exercises.splice(target, 0, moved);
        return { ...day, exercicios: exercises };
      }),
    }));
  }

  const titulo = tituloPorModo(modo);
  const statusText = saving
    ? "Salvando..."
    : status === "success"
      ? mensagemSucesso(modo)
      : status === "previewing"
        ? "Revise e confirme para persistir."
        : status === "error"
          ? technicalError || "Revise os campos antes de continuar."
          : dirty
            ? "Alteracoes pendentes."
            : "Sem alteracoes pendentes.";

  return (
    <div className="treino-template-overlay">
      <section
        className="treino-save-template-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        aria-busy={saving}
        data-testid="workout-template-modal"
      >
        <header className="treino-template-header">
          <div>
            <span className="treino-template-step">Modelo pessoal</span>
            <h2 id={modalTitleId}>{titulo}</h2>
            <p>
              O modelo salva apenas estrutura, exercicios e orientacoes gerais.
              Dados do aluno, datas, status e cargas individuais nao entram no modelo.
            </p>
          </div>
          <button type="button" onClick={fechar} className="treino-template-close" data-testid="workout-template-close">
            Fechar
          </button>
        </header>

        <form className="treino-save-template-form" onSubmit={enviar} data-testid="workout-template-form">
          <label>
            <span>Nome do modelo</span>
            <input
              ref={nameRef}
              value={draft.metadata.name}
              onChange={(event) => setMetadata("name", event.target.value)}
              maxLength={90}
              required
              data-testid="workout-template-name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? nameErrorId : undefined}
            />
            {errors.name && <small className="app-error" id={nameErrorId}>{errors.name}</small>}
          </label>

          <label>
            <span>Genero de referencia</span>
            <select
              value={draft.metadata.referenceGender}
              onChange={(event) => setMetadata("referenceGender", event.target.value)}
              data-testid="custom-template-gender"
            >
              {GENEROS_REFERENCIA_MODELO.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Divisao</span>
            <select
              value={draft.metadata.splitType}
              onChange={(event) => setMetadata("splitType", event.target.value)}
              data-testid="custom-template-split"
            >
              {DIVISOES_MODELO_PESSOAL.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Objetivo</span>
            <input
              value={draft.metadata.objective}
              onChange={(event) => setMetadata("objective", event.target.value)}
              maxLength={90}
              data-testid="custom-template-objective"
            />
          </label>

          <label>
            <span>Nivel</span>
            <select
              value={draft.metadata.level}
              onChange={(event) => setMetadata("level", event.target.value)}
              data-testid="custom-template-level"
            >
              <option value="">Selecione</option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediario">Intermediario</option>
              <option value="Avancado">Avancado</option>
            </select>
          </label>

          <label className="treino-save-template-wide">
            <span>Descricao</span>
            <textarea
              value={draft.metadata.description}
              onChange={(event) => setMetadata("description", event.target.value)}
              rows="3"
              maxLength={220}
              data-testid="custom-template-description"
            />
          </label>

          <section
            className="treino-save-template-wide treino-editor-section"
            aria-invalid={Boolean(errors.exercises)}
            aria-describedby={errors.exercises ? exercisesErrorId : undefined}
          >
            <h3>Dias e exercicios</h3>
            <div className="treino-editor-day-form">
              <input
                value={newDay.nome}
                onChange={(event) => setNewDay({ ...newDay, nome: event.target.value })}
                placeholder="Nome do dia"
              />
              <input
                value={newDay.descricao}
                onChange={(event) => setNewDay({ ...newDay, descricao: event.target.value })}
                placeholder="Descricao"
              />
              <button type="button" className="app-button app-button-secondary" onClick={addDay}>
                Adicionar Dia
              </button>
            </div>

            <div className="treino-editor-days-list">
              {draft.workout.dias.map((day) => {
                const exercise = exerciseByDay[day.id] || emptyExercise;
                return (
                  <article key={day.id} className="treino-editor-day-card">
                    <div className="treino-editor-day-header">
                      <div>
                        <h4>{day.nome}</h4>
                        <p>{day.descricao || "Sem descricao"}</p>
                      </div>
                    </div>
                    <div className="treino-editor-exercise-form" data-testid="exercise-form">
                      <input value={exercise.nome} onChange={(event) => updateExerciseDraft(day.id, "nome", event.target.value)} placeholder="Nome do exercicio" data-testid="exercise-name" />
                      <input value={exercise.series} onChange={(event) => updateExerciseDraft(day.id, "series", event.target.value)} placeholder="Series" data-testid="exercise-sets" inputMode="decimal" />
                      <input value={exercise.repeticoes} onChange={(event) => updateExerciseDraft(day.id, "repeticoes", event.target.value)} placeholder="Repeticoes" data-testid="exercise-repetitions" />
                      <input value={exercise.carga} onChange={(event) => updateExerciseDraft(day.id, "carga", event.target.value)} placeholder="Carga" data-testid="exercise-load" />
                      <input value={exercise.descanso} onChange={(event) => updateExerciseDraft(day.id, "descanso", event.target.value)} placeholder="Descanso" data-testid="exercise-rest" />
                      <textarea value={exercise.observacoes} onChange={(event) => updateExerciseDraft(day.id, "observacoes", event.target.value)} placeholder="Observacoes" data-testid="exercise-notes" />
                      <button type="button" className="app-button app-button-primary" onClick={() => saveExercise(day.id)} data-testid="exercise-add">
                        {editingExercise?.dayId === day.id ? "Salvar exercicio" : "Adicionar exercicio"}
                      </button>
                      {editingExercise?.dayId === day.id && (
                        <button type="button" className="app-button app-button-secondary" onClick={() => setEditingExercise(null)} data-testid="exercise-cancel">
                          Cancelar edicao
                        </button>
                      )}
                    </div>
                    <div className="treino-editor-exercises-list">
                      {day.exercicios.map((item, index) => (
                        <ExercicioCard
                          key={item.id}
                          exercicio={item}
                          index={index}
                          total={day.exercicios.length}
                          onEdit={() => editExercise(day.id, item)}
                          onDelete={() => deleteExercise(day.id, item.id)}
                          onMoveUp={() => moveExercise(day.id, item.id, -1)}
                          onMoveDown={() => moveExercise(day.id, item.id, 1)}
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
            {errors.exercises && (
              <small className="app-error" id={exercisesErrorId}>
                {errors.exercises}
              </small>
            )}
          </section>

          <p className="treino-template-privacy" data-testid="custom-template-privacy">
            Aviso de privacidade: este modelo fica disponivel apenas para o seu usuario.
            Modelos oficiais seguem protegidos no codigo e nao podem ser alterados aqui.
          </p>

          {status === "previewing" && (
            <section className="treino-save-template-wide treino-template-summary" data-testid="personal-template-preview">
              <strong>{preview.operationLabel}</strong>
              <span>Nome final: {preview.name}</span>
              <span>Origem resultante: pessoal</span>
              <span>Objetivo: {preview.objective}</span>
              <span>Nivel: {preview.level}</span>
              <span>Divisao: {preview.split}</span>
              <span>{preview.dayCount} dias - {preview.exerciseCount} exercicios</span>
              <span>{preview.createsNewRecord ? "Sera criado um novo modelo." : "O modelo pessoal existente sera atualizado."}</span>
              {preview.mainExercises.length > 0 && <span>Principais: {preview.mainExercises.join(", ")}</span>}
              {preview.changes.length > 0 && (
                <ul className="treino-template-warnings">
                  {preview.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              )}
              {preview.days.map((day) => (
                <details key={day.id} open>
                  <summary>{day.nome} ({day.exercicios.length} exercicios)</summary>
                  <div>
                    {day.exercicios.map((exercise) => (
                      <span key={exercise.id}>{exercise.nome}</span>
                    ))}
                  </div>
                </details>
              ))}
            </section>
          )}

          <p aria-live="polite" data-testid={status === "success" ? "workout-template-save-success" : saving ? "workout-template-saving" : status === "error" ? "workout-template-save-error" : undefined}>
            {statusText}
          </p>

          <footer className="treino-template-footer">
            <button type="button" onClick={fechar} className="app-button app-button-secondary" data-testid="workout-template-cancel">
              Cancelar
            </button>
            {status === "previewing" ? (
              <button type="button" className="app-button app-button-primary" data-testid="workout-template-confirm-save" disabled={saving} onClick={confirmarPersistencia}>
                {saving ? "Salvando..." : modo === "edit" ? "Salvar alteracoes" : "Confirmar e salvar"}
              </button>
            ) : (
              <button type="submit" className="app-button app-button-primary" data-testid="workout-template-save" disabled={saving}>
                Revisar
              </button>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}

function tituloPorModo(modo) {
  if (modo === PERSONAL_TEMPLATE_MODES.EDIT) return "Editar modelo pessoal";
  if (modo === PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL) return "Duplicar como modelo pessoal";
  if (modo === PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL) return "Duplicar modelo pessoal";
  if (modo === PERSONAL_TEMPLATE_MODES.CREATE) return "Criar modelo";
  return "Salvar como modelo";
}

function mensagemSucesso(modo) {
  if (modo === PERSONAL_TEMPLATE_MODES.EDIT) return "Modelo atualizado com sucesso.";
  if (modo === PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL || modo === PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL) {
    return "Modelo duplicado com sucesso.";
  }
  if (modo === PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT) return "Treino salvo como modelo com sucesso.";
  return "Modelo criado com sucesso.";
}

export default TreinoSalvarModeloModal;

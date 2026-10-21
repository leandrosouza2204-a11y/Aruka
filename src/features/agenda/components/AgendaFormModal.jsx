import { useMemo, useState } from "react";
import AccessibleModal from "../../../components/AccessibleModal";
import { eventDateKey, formatAgendaTime, validateAgendaForm } from "../utils/agendaDate";

const WEEKDAYS = [
  [1, "Seg"], [2, "Ter"], [3, "Qua"], [4, "Qui"], [5, "Sex"], [6, "Sáb"], [0, "Dom"],
];

export function AgendaFormModal({ editing, students, busy, onClose, onSave }) {
  const initial = useMemo(() => initialForm(editing), [editing]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [scope, setScope] = useState("ocorrencia");
  const isEdit = Boolean(editing?.id);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function toggleStudent(id) {
    update("alunoIds", form.alunoIds.includes(id) ? form.alunoIds.filter((value) => value !== id) : [...form.alunoIds, id]);
  }

  function toggleWeekday(day) {
    update("diasSemana", form.diasSemana.includes(day) ? form.diasSemana.filter((value) => value !== day) : [...form.diasSemana, day]);
  }

  async function submit(event) {
    event.preventDefault();
    const result = validateAgendaForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    await onSave(form, scope);
  }

  const footer = (
    <div className="agenda-modal-actions">
      <button className="app-button app-button-secondary" disabled={busy} onClick={onClose} type="button">Cancelar</button>
      <button className="app-button app-button-primary" disabled={busy} form="agenda-form" type="submit">{busy ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar compromisso"}</button>
    </div>
  );

  return (
    <AccessibleModal
      isOpen
      title={isEdit ? "Editar compromisso" : "Novo compromisso"}
      description="Organize atendimentos, compromissos pessoais e indisponibilidades."
      onClose={busy ? undefined : onClose}
      closeOnEscape={!busy}
      closeOnOverlayClick={!busy}
      showCloseButton={!busy}
      footer={footer}
      size="lg"
      className="agenda-form-overlay"
      contentClassName="agenda-form-modal"
      aria-busy={busy || undefined}
    >
      <form className="agenda-form" id="agenda-form" noValidate onSubmit={submit}>
        {isEdit && editing.serieId && (
          <fieldset className="agenda-form-scope">
            <legend>Aplicar alterações</legend>
            <label><input checked={scope === "ocorrencia"} name="scope" onChange={() => setScope("ocorrencia")} type="radio" /> Somente esta ocorrência</label>
            <label><input checked={scope === "serie"} name="scope" onChange={() => setScope("serie")} type="radio" /> Esta e as próximas da série</label>
            <small>Exceções já editadas permanecem preservadas.</small>
          </fieldset>
        )}

        <div className="agenda-form-grid">
          <Field error={errors.titulo} label="Título" span>
            <input autoFocus maxLength={160} onChange={(event) => update("titulo", event.target.value)} placeholder="Ex.: Avaliação de acompanhamento" value={form.titulo} />
          </Field>
          <Field label="Tipo">
            <select onChange={(event) => update("tipo", event.target.value)} value={form.tipo}>
              <option value="atendimento">Atendimento</option>
              <option value="pessoal">Compromisso pessoal</option>
              <option value="bloqueio">Indisponibilidade</option>
              <option value="outro">Outro</option>
            </select>
          </Field>
          <Field error={errors.data} label="Data"><input onChange={(event) => update("data", event.target.value)} type="date" value={form.data} /></Field>
          <Field error={errors.inicio} label="Início"><input onChange={(event) => update("inicio", event.target.value)} type="time" value={form.inicio} /></Field>
          <Field error={errors.fim} label="Término"><input onChange={(event) => update("fim", event.target.value)} type="time" value={form.fim} /></Field>
        </div>

        <fieldset className="agenda-student-picker">
          <legend>Alunos participantes {form.tipo !== "atendimento" && <small>(opcional)</small>}</legend>
          {students.length ? <div className="agenda-student-options">
            {students.map((student) => <label key={student.id}><input checked={form.alunoIds.includes(student.id)} onChange={() => toggleStudent(student.id)} type="checkbox" /> <span>{student.nome}</span></label>)}
          </div> : <p>Nenhum aluno ativo disponível.</p>}
          {errors.alunoIds && <small className="agenda-field-error">{errors.alunoIds}</small>}
        </fieldset>

        {!isEdit && (
          <fieldset className="agenda-recurrence">
            <legend>Recorrência</legend>
            <div className="agenda-form-grid">
              <Field label="Repetir">
                <select onChange={(event) => update("frequencia", event.target.value)} value={form.frequencia}>
                  <option value="nenhuma">Não repetir</option>
                  <option value="diaria">Diariamente</option>
                  <option value="semanal">Semanalmente</option>
                  <option value="dias_semana">Em dias específicos</option>
                </select>
              </Field>
              {form.frequencia !== "nenhuma" && <Field label="Intervalo"><select onChange={(event) => update("intervalo", event.target.value)} value={form.intervalo}><option value="1">A cada período</option><option value="2">A cada 2 períodos</option><option value="3">A cada 3 períodos</option><option value="4">A cada 4 períodos</option></select></Field>}
            </div>
            {form.frequencia === "dias_semana" && <div className="agenda-weekdays" aria-label="Dias da semana">{WEEKDAYS.map(([day, label]) => <label key={day}><input checked={form.diasSemana.includes(day)} onChange={() => toggleWeekday(day)} type="checkbox" /><span>{label}</span></label>)}{errors.diasSemana && <small className="agenda-field-error">{errors.diasSemana}</small>}</div>}
            {form.frequencia !== "nenhuma" && <div className="agenda-recurrence-end">
              <label><input checked={form.terminoRecorrencia === "quantidade"} name="recurrence-end" onChange={() => update("terminoRecorrencia", "quantidade")} type="radio" /> Após <input aria-label="Quantidade de ocorrências" max="366" min="1" onChange={(event) => update("quantidade", event.target.value)} type="number" value={form.quantidade} /> ocorrências</label>
              <label><input checked={form.terminoRecorrencia === "data"} name="recurrence-end" onChange={() => update("terminoRecorrencia", "data")} type="radio" /> Até <input aria-label="Data final da recorrência" disabled={form.terminoRecorrencia !== "data"} min={form.data} onChange={(event) => update("terminaEm", event.target.value)} type="date" value={form.terminaEm} /></label>
              {(errors.quantidade || errors.terminaEm) && <small className="agenda-field-error">{errors.quantidade || errors.terminaEm}</small>}
            </div>}
          </fieldset>
        )}

        <Field label="Observações" span><textarea maxLength={2000} onChange={(event) => update("observacoes", event.target.value)} placeholder="Informações opcionais para o profissional" rows="4" value={form.observacoes} /></Field>
        {errors.form && <p className="agenda-form-error" role="alert">{errors.form}</p>}
      </form>
    </AccessibleModal>
  );
}

function Field({ children, error, label, span = false }) {
  return <label className={`agenda-field${span ? " agenda-field-span" : ""}`}><span>{label}</span>{children}{error && <small className="agenda-field-error">{error}</small>}</label>;
}

function initialForm(editing) {
  const date = editing?.id ? eventDateKey(editing.inicio) : editing?.prefillDate;
  return {
    titulo: editing?.titulo || "",
    tipo: editing?.tipo || "atendimento",
    data: date,
    inicio: editing?.id ? formatAgendaTime(editing.inicio) : "09:00",
    fim: editing?.id ? formatAgendaTime(editing.fim) : "10:00",
    observacoes: editing?.observacoes || "",
    alunoIds: editing?.alunos?.map((student) => student.id) || [],
    frequencia: "nenhuma",
    intervalo: "1",
    diasSemana: [],
    terminoRecorrencia: "quantidade",
    quantidade: "4",
    terminaEm: date,
  };
}

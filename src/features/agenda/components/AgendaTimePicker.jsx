import { useId, useRef } from "react";
import { combineAgendaTime, splitAgendaTime } from "../utils/agendaTime";

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

export function AgendaTimePicker({ error, label, onChange, value }) {
  const legendId = useId();
  const errorId = useId();
  const parsed = splitAgendaTime(value);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  function updateValue() {
    onChange(combineAgendaTime(hourRef.current?.value || "", minuteRef.current?.value || ""));
  }

  const describedBy = error ? errorId : undefined;

  return (
    <fieldset className={`agenda-time-picker${error ? " has-error" : ""}`} aria-describedby={describedBy}>
      <legend id={legendId}>{label}</legend>
      <div className="agenda-time-picker-controls" role="group" aria-labelledby={legendId}>
        <select key={`hour-${value}`} ref={hourRef} aria-label={`Hora de ${label.toLowerCase()}`} aria-invalid={Boolean(error)} defaultValue={parsed.hour} onChange={updateValue}>
          <option value="">Hora</option>
          {HOURS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <span aria-hidden="true">:</span>
        <select key={`minute-${value}`} ref={minuteRef} aria-label={`Minutos de ${label.toLowerCase()}`} aria-invalid={Boolean(error)} defaultValue={parsed.minute} onChange={updateValue}>
          <option value="">Min</option>
          {MINUTES.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      {error && <small className="agenda-field-error" id={errorId}>{error}</small>}
    </fieldset>
  );
}

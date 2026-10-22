import { Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { filterStudents, nextStudentIndex, toggleStudentId, uniqueStudentsById } from "../utils/studentPicker";

export function AgendaStudentPicker({
  students = [],
  selectedStudents = [],
  selectedIds = [],
  status = "ready",
  error = "",
  onChange,
  onRetry,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();
  const helpId = useId();

  const allKnownStudents = useMemo(
    () => uniqueStudentsById([...selectedStudents, ...students]),
    [selectedStudents, students],
  );
  const filteredStudents = useMemo(() => filterStudents(students, query), [query, students]);
  const selected = useMemo(() => {
    const byId = new Map(allKnownStudents.map((student) => [student.id, student]));
    return [...new Set(selectedIds)].map((id) => byId.get(id) || { id, nome: "Aluno selecionado" });
  }, [allKnownStudents, selectedIds]);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const option = listRef.current.querySelector(`[data-option-index="${activeIndex}"]`);
    if (!option) return;
    const optionTop = option.offsetTop;
    const optionBottom = optionTop + option.offsetHeight;
    if (optionTop < listRef.current.scrollTop) listRef.current.scrollTop = optionTop;
    else if (optionBottom > listRef.current.scrollTop + listRef.current.clientHeight) {
      listRef.current.scrollTop = optionBottom - listRef.current.clientHeight;
    }
  }, [activeIndex]);

  function choose(id) {
    onChange(toggleStudentId(selectedIds, id));
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
      }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => nextStudentIndex(current, event.key, filteredStudents.length));
      return;
    }
    if (event.key === "Enter" && open && activeIndex >= 0 && activeIndex < filteredStudents.length) {
      event.preventDefault();
      choose(filteredStudents[activeIndex].id);
    }
  }

  const activeOptionId = open && activeIndex >= 0 && activeIndex < filteredStudents.length ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div className="agenda-student-combobox" ref={rootRef}>
      <div className="agenda-student-picker-summary">
        <span id={helpId}>{selected.length} {selected.length === 1 ? "aluno selecionado" : "alunos selecionados"}</span>
        {selected.length > 0 && <button className="agenda-student-clear-selection" type="button" onClick={() => onChange([])}>Remover todos</button>}
      </div>

      {selected.length > 0 && (
        <div className="agenda-student-chips" aria-label="Alunos selecionados">
          {selected.map((student) => (
            <span className="agenda-student-chip" key={student.id}>
              <span>{student.nome}</span>
              <button type="button" onClick={() => choose(student.id)} aria-label={`Remover ${student.nome}`}><X size={14} aria-hidden="true" /></button>
            </span>
          ))}
        </div>
      )}

      <div className={`agenda-student-search${open ? " is-open" : ""}`}>
        <Search size={17} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-describedby={helpId}
          aria-expanded={open}
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          disabled={status === "loading" || status === "error"}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActiveIndex(0); }}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar aluno por nome"
          value={query}
        />
        {query ? <button className="agenda-student-clear-query" type="button" onClick={() => { setQuery(""); setActiveIndex(0); inputRef.current?.focus(); }} aria-label="Limpar pesquisa"><X size={16} aria-hidden="true" /></button> : <ChevronDown className="agenda-student-chevron" size={18} aria-hidden="true" />}
      </div>

      {open && status === "ready" && students.length > 0 && (
        <div className="agenda-student-list" id={listboxId} ref={listRef} role="listbox" aria-label="Alunos elegíveis" aria-multiselectable="true">
          {filteredStudents.length ? filteredStudents.map((student, index) => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <div
                aria-selected={isSelected}
                className={`agenda-student-option${index === activeIndex ? " is-active" : ""}${isSelected ? " is-selected" : ""}`}
                data-option-index={index}
                id={`${listboxId}-option-${index}`}
                key={student.id}
                onClick={() => choose(student.id)}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <span>{student.nome}</span>
                {isSelected && <Check size={17} aria-hidden="true" />}
              </div>
            );
          }) : <p className="agenda-student-picker-state" role="status">Nenhum aluno encontrado para “{query}”.</p>}
        </div>
      )}

      {status === "loading" && <p className="agenda-student-picker-state" role="status" aria-live="polite">Carregando alunos elegíveis...</p>}
      {status === "error" && <div className="agenda-student-picker-state is-error" role="alert"><span>{error || "Não foi possível carregar os alunos."}</span>{onRetry && <button type="button" onClick={onRetry}>Tentar novamente</button>}</div>}
      {status === "ready" && students.length === 0 && <p className="agenda-student-picker-state">Nenhum aluno ativo elegível no momento.</p>}
    </div>
  );
}

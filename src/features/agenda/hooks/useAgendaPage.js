import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  atualizarCompromissoAgenda,
  atualizarStatusAgenda,
  buscarCompromissosAgenda,
  cancelarCompromissoAgenda,
  criarCompromissoAgenda,
} from "../../../services/agendaService";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import {
  agendaRange,
  AGENDA_TIME_ZONE,
  localDateTimeToIso,
  moveAgendaDate,
  todayKey,
} from "../utils/agendaDate";
import { DASHBOARD_AGENDA_UPDATED_EVENT } from "../../dashboard/hooks/useDashboardAgenda";

export function useAgendaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const handledIntent = useRef("");
  const [view, setView] = useState(() => window.matchMedia?.("(max-width: 767px)").matches ? "dia" : "semana");
  const [dateKey, setDateKey] = useState(() => todayKey());
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsStatus, setStudentsStatus] = useState("loading");
  const [studentsError, setStudentsError] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [mutation, setMutation] = useState("");
  const toast = useToast();
  const confirm = useConfirm();

  const range = useMemo(() => agendaRange(dateKey, view), [dateKey, view]);

  const loadStudents = useCallback(async () => {
    setStudentsStatus("loading");
    setStudentsError("");
    try {
      const loadedStudents = await buscarAlunosSupabase();
      setStudents(loadedStudents.filter((student) => student.status !== "Inativo"));
      setStudentsStatus("ready");
    } catch (loadError) {
      setStudentsError(loadError?.message || "Não foi possível carregar os alunos elegíveis.");
      setStudentsStatus("error");
    }
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    void loadStudents();
    try {
      const loadedEvents = await buscarCompromissosAgenda(
        localDateTimeToIso(range.startKey, "00:00"),
        localDateTimeToIso(range.endKey, "00:00"),
      );
      setEvents(loadedEvents);
      setStatus("ready");
    } catch (loadError) {
      setError(loadError?.message || "Não foi possível carregar a agenda.");
      setStatus("error");
    }
  }, [loadStudents, range.endKey, range.startKey]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (status !== "ready") return;
    const compromissoId = searchParams.get("compromisso") || "";
    const novaData = searchParams.get("novo") || "";
    const intent = compromissoId ? `compromisso:${compromissoId}` : novaData ? `novo:${novaData}` : "";
    if (!intent || handledIntent.current === intent) return;

    const event = compromissoId ? events.find((item) => item.id === compromissoId) : null;
    if (compromissoId && !event) return;
    if (novaData && !/^\d{4}-\d{2}-\d{2}$/.test(novaData)) return;

    const timer = window.setTimeout(() => {
      if (event) {
        setDetails(event);
        setFormOpen(false);
      } else {
        setDateKey(novaData);
        setEditing({ prefillDate: novaData });
        setDetails(null);
        setFormOpen(true);
      }

      handledIntent.current = intent;
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("compromisso");
      nextParams.delete("novo");
      setSearchParams(nextParams, { replace: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [events, searchParams, setSearchParams, status]);

  function openNew(prefillDate = dateKey) {
    setEditing({ prefillDate });
    setDetails(null);
    setFormOpen(true);
  }

  function openDetails(event) {
    setDetails(event);
    setFormOpen(false);
  }

  function openEdit(event) {
    setEditing(event);
    setDetails(null);
    setFormOpen(true);
  }

  function closeForm() {
    if (mutation) return;
    setFormOpen(false);
    setEditing(null);
  }

  async function save(form, scope) {
    if (mutation) return false;
    setMutation("save");
    try {
      if (editing?.id) await atualizarCompromissoAgenda(editing.id, scope, form);
      else await criarCompromissoAgenda(form);
      toast.sucesso(editing?.id ? "Compromisso atualizado" : "Compromisso criado", "A agenda já está atualizada.");
      setFormOpen(false);
      setEditing(null);
      await load();
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
      return true;
    } catch (saveError) {
      setError(saveError?.message || "Não foi possível salvar o compromisso.");
      toast.erro("Não foi possível salvar", saveError?.message || "Tente novamente.");
      return false;
    } finally {
      setMutation("");
    }
  }

  async function changeStatus(event, nextStatus) {
    if (mutation) return;
    setMutation(`status-${event.id}`);
    try {
      await atualizarStatusAgenda(event.id, nextStatus);
      setDetails(null);
      toast.sucesso("Status atualizado", "O atendimento foi atualizado.");
      await load();
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
    } catch (statusError) {
      toast.erro("Não foi possível atualizar", statusError?.message || "Tente novamente.");
    } finally {
      setMutation("");
    }
  }

  async function cancel(event, scope = "ocorrencia") {
    const confirmed = await confirm({
      titulo: scope === "serie" ? "Cancelar toda a série?" : "Cancelar este compromisso?",
      descricao: scope === "serie"
        ? "Todas as ocorrências da série serão canceladas."
        : "O horário ficará disponível novamente.",
      textoConfirmar: "Cancelar compromisso",
    });
    if (!confirmed || mutation) return;
    setMutation(`cancel-${event.id}`);
    try {
      await cancelarCompromissoAgenda(event.id, scope);
      setDetails(null);
      toast.sucesso("Compromisso cancelado", scope === "serie" ? "A série foi cancelada." : "A ocorrência foi cancelada.");
      await load();
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
    } catch (cancelError) {
      toast.erro("Não foi possível cancelar", cancelError?.message || "Tente novamente.");
    } finally {
      setMutation("");
    }
  }

  return {
    view, setView, dateKey, setDateKey, events, students, studentsStatus, studentsError, status, error, load, loadStudents,
    editing, details, formOpen, mutation, openNew, openDetails, openEdit, closeForm,
    closeDetails: () => setDetails(null), save, changeStatus, cancel,
    goToday: () => setDateKey(todayKey(new Date(), AGENDA_TIME_ZONE)),
    move: (direction) => setDateKey((current) => moveAgendaDate(current, view, direction)),
  };
}

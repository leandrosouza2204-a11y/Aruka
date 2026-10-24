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
import {
  applyAgendaCancellation,
  describeAgendaCancellationFailure,
  describeAgendaSaveFailure,
} from "../utils/agendaMutation";

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
  const [actionError, setActionError] = useState(null);
  const mutationRef = useRef("");
  const toast = useToast();
  const { confirmar } = useConfirm();

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
    setActionError(null);
    setEditing({ prefillDate });
    setDetails(null);
    setFormOpen(true);
  }

  function openDetails(event) {
    setActionError(null);
    setDetails(event);
    setFormOpen(false);
  }

  function openEdit(event) {
    setActionError(null);
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
    if (!beginMutation("save")) return { ok: false, ignored: true };
    try {
      if (editing?.id) await atualizarCompromissoAgenda(editing.id, scope, form);
      else await criarCompromissoAgenda(form);
      toast.sucesso(editing?.id ? "Compromisso atualizado" : "Compromisso criado", "A agenda já está atualizada.");
      setFormOpen(false);
      setEditing(null);
      await load();
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
      return { ok: true };
    } catch (saveError) {
      return { ok: false, error: describeAgendaSaveFailure(saveError) };
    } finally {
      finishMutation();
    }
  }

  async function changeStatus(event, nextStatus) {
    if (!beginMutation(`status-${event.id}`)) return;
    setActionError(null);
    try {
      await atualizarStatusAgenda(event.id, nextStatus);
      setDetails(null);
      toast.sucesso("Status atualizado", "O atendimento foi atualizado.");
      await load();
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
    } catch (statusError) {
      toast.erro("Não foi possível atualizar", statusError?.message || "Tente novamente.");
    } finally {
      finishMutation();
    }
  }

  async function cancel(event, scope = "ocorrencia") {
    if (!beginMutation(`confirm-cancel-${event.id}`)) return;
    setActionError(null);
    try {
      const confirmed = await confirmar({
        titulo: scope === "serie" ? "Cancelar toda a série?" : "Cancelar este compromisso?",
        descricao: scope === "serie"
          ? "Todas as ocorrências da série serão canceladas."
          : event.serieId
            ? "Somente esta ocorrência será cancelada. As demais datas da série serão preservadas."
            : "O horário ficará disponível novamente.",
        textoConfirmar: "Cancelar compromisso",
        testIdPrefix: "agenda-cancel",
      });
      if (!confirmed) return;
      setMutation(`cancel-${event.id}`);
      await cancelarCompromissoAgenda(event.id, scope);
      setEvents((current) => applyAgendaCancellation(current, event, scope));
      setDetails(null);
      toast.sucesso("Compromisso cancelado", scope === "serie" ? "A série foi cancelada." : "A ocorrência foi cancelada.");
      window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));
      await load();
    } catch (cancelError) {
      setActionError({ message: describeAgendaCancellationFailure(cancelError), scope });
    } finally {
      finishMutation();
    }
  }

  function beginMutation(key) {
    if (mutationRef.current) return false;
    mutationRef.current = key;
    setMutation(key);
    return true;
  }

  function finishMutation() {
    mutationRef.current = "";
    setMutation("");
  }

  return {
    view, setView, dateKey, setDateKey, events, students, studentsStatus, studentsError, status, error, load, loadStudents,
    editing, details, formOpen, mutation, actionError, openNew, openDetails, openEdit, closeForm,
    closeDetails: () => { setActionError(null); setDetails(null); }, save, changeStatus, cancel,
    goToday: () => setDateKey(todayKey(new Date(), AGENDA_TIME_ZONE)),
    move: (direction) => setDateKey((current) => moveAgendaDate(current, view, direction)),
  };
}

import { useEffect, useMemo, useState } from 'react';
import AccessibleModal from '../../../components/AccessibleModal';
import { buscarCompromissosAgenda } from '../../../services/agendaService';
import { AgendaStudentPicker } from './AgendaStudentPicker';
import { agendaMidnight, brazilPhone, calendarFilename, dateBR, eligibleWeeklyStudents, eventLabel, individualEvents, makeIcs, messageFor, weeklyRange } from '../utils/weeklySharing';

export function AgendaWeeklyShareModal({ students, studentsStatus, studentsError, onRetryStudents, onClose, loadEvents = buscarCompromissosAgenda }) {
  const [studentId, setStudentId] = useState('');
  const [next, setNext] = useState(false);
  const [events, setEvents] = useState([]);
  const [weekRows, setWeekRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [retry, setRetry] = useState(0);
  const range = useMemo(() => weeklyRange(next), [next]);
  const student = students.find(item => item.id === studentId);

  useEffect(() => {
    let active = true;
    loadEvents(agendaMidnight(range.start), agendaMidnight(range.end)).then(rows => {
      if (!active) return;
      setWeekRows(rows);
      const selected = individualEvents(rows, studentId, range);
      setEvents(selected); setStatus('ready');
      const selectedStudent = students.find(item => item.id === studentId);
      setMessage(selectedStudent && selected.length ? messageFor(selectedStudent, range, selected) : '');
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [studentId, range, students, retry, loadEvents]);

  const eligibleStudents = eligibleWeeklyStudents(students, weekRows, range);
  function selectStudent(ids) { setStudentId(ids.at(-1) || ''); setEvents([]); setMessage(''); setStatus('loading'); setFeedback(''); }
  function selectWeek(value) { if (value === next) return; if (student?.status === 'Inativo') setStudentId(''); setNext(value); setEvents([]); setWeekRows([]); setMessage(''); setStatus('loading'); setFeedback(''); }
  async function copy() { try { await navigator.clipboard.writeText(message); setFeedback('Mensagem copiada.'); } catch { setFeedback('Não foi possível copiar. Selecione e copie o texto.'); } }
  async function shareText() {
    try { await navigator.share({ text: message }); }
    catch (error) { if (error?.name !== 'AbortError') setFeedback('Não foi possível compartilhar. Copie a mensagem e escolha o destinatário.'); }
  }
  function whatsapp() {
    const phone = brazilPhone(student?.whatsapp);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    // Some browsers return null even when noopener opens successfully; do not claim delivery.
    if (!opened) setFeedback('Se o WhatsApp não abriu, permita pop-ups ou copie a mensagem. Confirme o destinatário e o envio no WhatsApp.');
    else setFeedback('Confirme o destinatário e o envio no WhatsApp.');
  }
  async function calendar() {
    const file = new File([makeIcs(events)], calendarFilename(student, range), { type: 'text/calendar;charset=utf-8' });
    let canShareFiles = false;
    try { canShareFiles = Boolean(navigator.share && navigator.canShare?.({ files: [file] })); } catch { /* Download remains available. */ }
    if (canShareFiles) {
      try { await navigator.share({ files: [file], title: 'Agenda de treinos' }); return; }
      catch (error) { if (error?.name === 'AbortError') return; setFeedback('Não foi possível compartilhar. O arquivo será baixado.'); }
    }
    const url = URL.createObjectURL(file); const link = document.createElement('a');
    link.href = url; link.download = file.name; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <AccessibleModal isOpen onClose={onClose} title="Compartilhar agenda semanal" description="Escolha um aluno e revise a agenda antes de compartilhar." size="lg" className="agenda-form-overlay" contentClassName="agenda-form-modal weekly-share-modal">
    <div className="weekly-share">
      <span>Aluno</span>
      <div id="weekly-student"><AgendaStudentPicker single students={eligibleStudents} selectedIds={studentId ? [studentId] : []} status={studentsStatus === 'ready' && status === 'loading' && !weekRows.length ? 'loading' : studentsStatus} error={studentsError} onRetry={onRetryStudents} onChange={selectStudent} /></div>
      <fieldset><legend>Semana</legend><div className="weekly-share-options"><button type="button" className="app-button app-button-secondary" aria-pressed={!next} onClick={() => selectWeek(false)}>Semana atual</button><button type="button" className="app-button app-button-secondary" aria-pressed={next} onClick={() => selectWeek(true)}>Próxima semana</button></div><p>{dateBR(range.start)} a {dateBR(range.last)}</p></fieldset>
      {status === 'loading' && <p role="status">Carregando compromissos...</p>}
      {status === 'error' && <p role="alert">Não foi possível carregar a agenda. <button type="button" onClick={() => { setStatus('loading'); setRetry(retry + 1); }}>Tentar novamente</button></p>}
      {status === 'ready' && studentId && !events.length && <p role="status">Nenhum atendimento agendado nesta semana. Escolha outro aluno ou semana.</p>}
      {status === 'ready' && events.length > 0 && <><h3>Compromissos</h3><ul>{events.map(e => <li key={e.id}>{eventLabel(e)}</li>)}</ul><label htmlFor="weekly-message">Mensagem para WhatsApp</label><textarea id="weekly-message" rows="10" value={message} onChange={e => setMessage(e.target.value)} /><div className="weekly-share-options"><button type="button" className="app-button app-button-secondary" onClick={copy}>Copiar mensagem</button>{!brazilPhone(student?.whatsapp) && typeof navigator.share === 'function' && <button type="button" className="app-button app-button-secondary" onClick={shareText}>Compartilhar mensagem</button>}<button type="button" className="app-button app-button-primary" onClick={whatsapp} disabled={!message.trim()}>Enviar pelo WhatsApp</button><button type="button" className="app-button app-button-secondary" onClick={calendar}>Compartilhar ou baixar calendário (.ics)</button></div>{!brazilPhone(student?.whatsapp) && <p>Selecione o destinatário no WhatsApp; o telefone cadastrado não é válido ou está incompleto.</p>}</>}
      {feedback && <p role="status">{feedback}</p>}
      <p>Baixe ou compartilhe o arquivo .ics para adicionar os horários ao calendário do seu celular. A importação depende do aplicativo; no Google Agenda pode exigir a versão web. O arquivo é um retrato da agenda e não sincroniza alterações posteriores.</p>
    </div>
  </AccessibleModal>;
}

import { useEffect, useMemo, useRef, useState } from 'react';
import AccessibleModal from '../../../components/AccessibleModal';
import { buscarCompromissosAgenda } from '../../../services/agendaService';
import { buscarApresentacaoEnviada, confirmarApresentacaoEnviada } from '../../../services/agendaIntroductionService';
import { AgendaStudentPicker } from './AgendaStudentPicker';
import { agendaMidnight, brazilPhone, calendarFilename, dateBR, eligibleWeeklyStudents, eventLabel, individualEvents, makeIcs, weeklyRange } from '../utils/weeklySharing';
import { abbreviateWeekday, introductionFor, personalizedWeeklyMessage } from '../utils/personalizedMessages';

export function AgendaWeeklyShareModal({ students, studentsStatus, studentsError, onRetryStudents, onClose, loadEvents = buscarCompromissosAgenda, loadIntroduction = buscarApresentacaoEnviada, confirmIntroduction = confirmarApresentacaoEnviada }) {
  const [studentId, setStudentId] = useState('');
  const [next, setNext] = useState(false);
  const [events, setEvents] = useState([]);
  const [weekRows, setWeekRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [drafts, setDrafts] = useState({});
  const [introductionDrafts, setIntroductionDrafts] = useState({});
  const [introductionStatus, setIntroductionStatus] = useState('idle');
  const [introductionOpen, setIntroductionOpen] = useState(false);
  const [introductionRetry, setIntroductionRetry] = useState(0);
  const selectedRef = useRef('');
  const [feedback, setFeedback] = useState('');
  const [retry, setRetry] = useState(0);
  const range = useMemo(() => weeklyRange(next), [next]);
  const student = students.find(item => item.id === studentId);
  const draftKey = `${studentId}:${range.start}`;
  const message = drafts[draftKey] ?? (student && events.length ? personalizedWeeklyMessage(student, events.map(event => abbreviateWeekday(eventLabel(event)))) : '');
  const introduction = introductionDrafts[studentId] ?? introductionFor(student);

  useEffect(() => {
    let active = true;
    loadEvents(agendaMidnight(range.start), agendaMidnight(range.end)).then(rows => {
      if (!active) return;
      setWeekRows(rows);
      const selected = individualEvents(rows, studentId, range);
      setEvents(selected); setStatus('ready');
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [studentId, range, students, retry, loadEvents]);

  useEffect(() => {
    let active = true;
    if (!studentId) return () => { active = false; };
    loadIntroduction(studentId).then(sent => {
      if (active) { setIntroductionStatus(sent ? 'sent' : 'pending'); setIntroductionOpen(!sent); }
    }).catch(() => { if (active) setIntroductionStatus('error'); });
    return () => { active = false; };
  }, [studentId, loadIntroduction, introductionRetry]);

  const eligibleStudents = eligibleWeeklyStudents(students, weekRows, range);
  function selectStudent(ids) { const id = ids.at(-1) || ''; selectedRef.current = id; setStudentId(id); setIntroductionStatus(id ? 'loading' : 'idle'); setIntroductionOpen(false); setEvents([]); setStatus('loading'); setFeedback(''); }
  function selectWeek(value) { if (value === next) return; if (student?.status === 'Inativo') { selectedRef.current = ''; setStudentId(''); setIntroductionStatus('idle'); } setNext(value); setEvents([]); setWeekRows([]); setStatus('loading'); setFeedback(''); }
  async function copy(text) { try { await navigator.clipboard.writeText(text); setFeedback('Mensagem copiada.'); } catch { setFeedback('Não foi possível copiar. Selecione e copie o texto.'); } }
  async function shareText() {
    try { await navigator.share({ text: message }); }
    catch (error) { if (error?.name !== 'AbortError') setFeedback('Não foi possível compartilhar. Copie a mensagem e escolha o destinatário.'); }
  }
  function whatsapp(text) {
    const phone = brazilPhone(student?.whatsapp);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    // Some browsers return null even when noopener opens successfully; do not claim delivery.
    if (!opened) setFeedback('Se o WhatsApp não abriu, permita pop-ups ou copie a mensagem. Confirme o destinatário e o envio no WhatsApp.');
    else setFeedback('Confirme o destinatário e o envio no WhatsApp.');
  }
  async function markSent() {
    const id = studentId;
    setIntroductionStatus('saving');
    try {
      await confirmIntroduction(id);
      if (selectedRef.current === id) { setIntroductionStatus('sent'); setIntroductionOpen(false); setFeedback('Apresentação marcada como enviada.'); }
    } catch {
      if (selectedRef.current === id) { setIntroductionStatus('pending'); setFeedback('Não foi possível salvar a confirmação. Tente novamente.'); }
    }
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
      {studentId && introductionStatus === 'loading' && <p role="status">Carregando apresentação...</p>}
      {studentId && introductionStatus === 'error' && <p role="alert">Não foi possível carregar a apresentação. <button type="button" onClick={() => { setIntroductionStatus('loading'); setIntroductionRetry(value => value + 1); }}>Tentar novamente</button></p>}
      {studentId && introductionStatus === 'sent' && !introductionOpen && <button type="button" className="app-button app-button-secondary" onClick={() => setIntroductionOpen(true)}>Ver mensagem de apresentação</button>}
      {studentId && introductionOpen && ['pending', 'sent', 'saving'].includes(introductionStatus) && <section aria-labelledby="introduction-title"><h3 id="introduction-title">Mensagem de apresentação</h3><label htmlFor="introduction-message">Mensagem de apresentação para WhatsApp</label><textarea id="introduction-message" rows="10" value={introduction} onChange={e => setIntroductionDrafts(previous => ({ ...previous, [studentId]: e.target.value }))} /><div className="weekly-share-options"><button type="button" className="app-button app-button-secondary" onClick={() => copy(introduction)}>Copiar apresentação</button><button type="button" className="app-button app-button-secondary" disabled={!introduction.trim()} onClick={() => whatsapp(introduction)}>Enviar apresentação pelo WhatsApp</button>{introductionStatus !== 'sent' && <button type="button" className="app-button app-button-primary" disabled={introductionStatus === 'saving'} onClick={markSent}>Marcar apresentação como enviada</button>}{introductionStatus === 'sent' && <button type="button" className="app-button app-button-secondary" onClick={() => setIntroductionOpen(false)}>Ocultar apresentação</button>}</div><p>A abertura do WhatsApp e a cópia não confirmam o envio.</p>{!brazilPhone(student?.whatsapp) && <p>Selecione o destinatário no WhatsApp; o telefone cadastrado não é válido ou está incompleto.</p>}</section>}
      {status === 'loading' && <p role="status">Carregando compromissos...</p>}
      {status === 'error' && <p role="alert">Não foi possível carregar a agenda. <button type="button" onClick={() => { setStatus('loading'); setRetry(retry + 1); }}>Tentar novamente</button></p>}
      {status === 'ready' && studentId && !events.length && <p role="status">Nenhum atendimento agendado nesta semana. Escolha outro aluno ou semana.</p>}
      {status === 'ready' && events.length > 0 && <><h3>Compromissos</h3><ul>{events.map(e => <li key={e.id}>{eventLabel(e)}</li>)}</ul><label htmlFor="weekly-message">Mensagem para WhatsApp</label><textarea id="weekly-message" rows="10" value={message} onChange={e => setDrafts(previous => ({ ...previous, [draftKey]: e.target.value }))} /><div className="weekly-share-options"><button type="button" className="app-button app-button-secondary" onClick={() => copy(message)}>Copiar mensagem</button>{!brazilPhone(student?.whatsapp) && typeof navigator.share === 'function' && <button type="button" className="app-button app-button-secondary" onClick={shareText}>Compartilhar mensagem</button>}<button type="button" className="app-button app-button-primary" onClick={() => whatsapp(message)} disabled={!message.trim()}>Enviar pelo WhatsApp</button><button type="button" className="app-button app-button-secondary" onClick={calendar}>Compartilhar ou baixar calendário (.ics)</button></div>{!brazilPhone(student?.whatsapp) && <p>Selecione o destinatário no WhatsApp; o telefone cadastrado não é válido ou está incompleto.</p>}</>}
      {feedback && <p role="status">{feedback}</p>}
      <p>Baixe ou compartilhe o arquivo .ics para adicionar os horários ao calendário do seu celular. A importação depende do aplicativo; no Google Agenda pode exigir a versão web. O arquivo é um retrato da agenda e não sincroniza alterações posteriores.</p>
    </div>
  </AccessibleModal>;
}

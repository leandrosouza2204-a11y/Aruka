import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgendaWeeklyShareModal } from '../../../src/features/agenda/components/AgendaWeeklyShareModal';
import '../../../src/index.css';
const students = [
  { id: 'ana', nome: 'Ana Silva', status: 'Ativo', whatsapp: '+55 (11) 99999-1234' },
  { id: 'bia', nome: 'Bia Costa', status: 'Ativo', whatsapp: '' },
  { id: 'clara', nome: 'Clara Inativa', status: 'Inativo', whatsapp: '' },
  { id: 'dora', nome: 'Dora Inativa', status: 'Inativo', whatsapp: '' },
  { id: 'eli', nome: 'Eli Exemplo', status: 'Ativo', whatsapp: '1234' },
  { id: 'fabi', nome: 'Fabi Vazia', status: 'Ativo', whatsapp: '' },
];
window.qa = { calls: [], mode: 'ok', share: 'ok', introductions: {}, introductionReadError: false, introductionWriteError: false };
Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.qa.copied = text; } } });
Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => { if (window.qa.share === 'canShareThrows') throw new Error('unsupported'); return window.qa.share !== 'unsupported'; } });
Object.defineProperty(navigator, 'share', { configurable: true, value: async value => { window.qa.shared = { name: value.files?.[0]?.name, type: value.files?.[0]?.type, content: value.files?.[0] ? await value.files[0].text() : value.text }; if (window.qa.share === 'cancel') throw new DOMException('cancel', 'AbortError'); if (window.qa.share === 'fail') throw new Error('failed'); } });
window.open = url => { window.qa.url = url; return window.qa.openFails ? null : {}; };
const originalCreate = URL.createObjectURL;
URL.createObjectURL = blob => { window.qa.download = { type: blob.type, content: blob.text() }; return originalCreate.call(URL, blob); };
HTMLAnchorElement.prototype.click = function () { window.qa.downloadName = this.download; };
const loadEvents = async (start, end) => {
  window.qa.calls.push({ start, end });
  await new Promise(resolve => setTimeout(resolve, 120));
  if (window.qa.mode === 'error') throw new Error('test failure');
  const t = Date.parse(start);
  return [{ id: 'event-one', inicio: new Date(t + 36e6).toISOString(), fim: new Date(t + 39.6e6).toISOString(), tipo: 'atendimento', status: 'agendado', alunos: [{ id: 'ana' }, { id: 'bia' }, { id: 'clara' }, { id: 'eli' }], observacoes: 'private fixture' }];
};
const loadIntroduction = async id => {
  if (window.qa.introductionReadError) throw new Error('read failed');
  return Boolean(window.qa.introductions[id]);
};
const confirmIntroduction = async id => {
  if (window.qa.introductionWriteError) throw new Error('write failed');
  window.qa.introductions[id] = true;
};
export function Harness() {
  const [open, setOpen] = useState(false);
  return <><button id="open" onClick={() => setOpen(true)}>Compartilhar agenda semanal</button>{open && <AgendaWeeklyShareModal students={students} studentsStatus="ready" onClose={() => setOpen(false)} loadEvents={loadEvents} loadIntroduction={loadIntroduction} confirmIntroduction={confirmIntroduction} />}</>;
}
createRoot(document.getElementById('root')).render(<Harness />);

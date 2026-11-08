import process from 'node:process';
import { Buffer } from 'node:buffer';
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { agendaMidnight, weeklyRange, individualEvents, messageFor, brazilPhone, escapeIcs, foldIcs, makeIcs } from './weeklySharing.js';

const range = weeklyRange(false, new Date('2026-11-11T12:00:00Z'));
const event = { id: '12345678-abcd', inicio: '2026-11-10T12:00:00Z', fim: '2026-11-10T13:00:00Z', tipo: 'atendimento', status: 'agendado', alunos: [{ id: 'a', nome: 'Ana' }, { id: 'b', nome: 'Segredo' }], observacoes: 'privado' };
test('semana e limites independem do fuso do processo', () => {
  assert.deepEqual(range, { start: '2026-11-09', end: '2026-11-16', last: '2026-11-15' });
  assert.equal(agendaMidnight(range.start), '2026-11-09T03:00:00.000Z');
  const script = "import {agendaMidnight,weeklyRange} from './src/features/agenda/utils/weeklySharing.js'; console.log(JSON.stringify([agendaMidnight('2026-11-09'),weeklyRange(false,new Date('2026-11-11T12:00:00Z'))]));";
  const outputs = ['UTC', 'America/Sao_Paulo', 'Asia/Tokyo'].map(TZ => execFileSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, TZ }, encoding: 'utf8' }));
  assert.equal(outputs[0], outputs[1]); assert.equal(outputs[1], outputs[2]);
});
test('projeção individual exclui cancelamentos, outros alunos e dados privados', () => {
  const selected = individualEvents([event, { ...event, id: 'cancel', status: 'cancelado' }, { ...event, id: 'other', alunos: [{ id: 'b' }] }, { ...event, id: 'personal', tipo: 'pessoal' }], 'a', range);
  assert.deepEqual(selected, [{ id: event.id, inicio: event.inicio, fim: event.fim }]);
  const msg = messageFor({ nome: 'Ana Silva' }, range, selected);
  assert.match(msg, /Olá, Ana!/); assert.match(msg, /09\/11\/2026 a 15\/11\/2026/); assert.match(msg, /09:00 às 10:00/); assert.match(msg, /pelo menos 24 horas/); assert.match(msg, /até 15 minutos/); assert.doesNotMatch(msg, /Segredo|privado|12345678/);
});
test('telefones exigem DDD e número brasileiro', () => {
  assert.equal(brazilPhone('(11) 99999-1234'), '5511999991234'); assert.equal(brazilPhone('+55 11 99999-1234'), '5511999991234'); assert.equal(brazilPhone('99999-1234'), ''); assert.equal(brazilPhone('+1 415 555 1234'), '');
});
test('ics usa UTC, CRLF, folding por octetos e lembrete', () => {
  assert.equal(escapeIcs('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
  assert.ok(foldIcs('á'.repeat(50)).split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  const ics = makeIcs([{ id: event.id, inicio: event.inicio, fim: event.fim }], new Date('2026-11-01T00:00:00Z'));
  assert.match(ics, /BEGIN:VCALENDAR\r\nVERSION:2.0/); assert.match(ics, /DTSTART:20261110T120000Z/); assert.match(ics, /DTEND:20261110T130000Z/); assert.match(ics, /UID:12345678-abcd@agenda.aruka/); assert.match(ics, /TRIGGER:-PT1H/); assert.doesNotMatch(ics, /Segredo|privado/); assert.doesNotMatch(ics, /(?<!\r)\n/);
});

test('ordena instantes e respeita cancelamento, remarcação, limites e troca de aluno', () => {
  const later = { ...event, id: 'later', inicio: '2026-11-11T09:00:00-03:00', fim: '2026-11-11T10:00:00-03:00', serieId: 'serie' };
  const moved = { ...event, id: 'moved', inicio: '2026-11-09T09:00:00-03:00', fim: '2026-11-09T10:00:00-03:00', isException: true, serieId: 'serie' };
  const outside = { ...event, id: 'outside', inicio: '2026-11-16T03:00:00Z', fim: '2026-11-16T04:00:00Z' };
  const cancelled = { ...event, id: 'cancel', status: 'cancelado' };
  assert.deepEqual(individualEvents([later, outside, cancelled, moved], 'a', range).map(x => x.id), ['moved', 'later']);
  assert.deepEqual(individualEvents([moved, moved], 'a', range).map(x => x.id), ['moved']);
  assert.deepEqual(individualEvents([later, moved], 'missing', range), []);
  assert.deepEqual(weeklyRange(true, new Date('2026-11-11T12:00:00Z')), { start: '2026-11-16', end: '2026-11-23', last: '2026-11-22' });
  assert.equal(individualEvents([outside], 'a', weeklyRange(true, new Date('2026-11-11T12:00:00Z'))).length, 1);
});
test('recusa prefixos internacionais não brasileiros mesmo se parecem DDD local', () => {
  assert.equal(brazilPhone('+1 199 999 9123'), '');
  assert.equal(brazilPhone('0011999999123'), '');
  assert.equal(brazilPhone('+55 11 99999-1234'), '5511999991234');
  assert.equal(brazilPhone('0055 11 99999-1234'), '5511999991234');
});

test('eventos que atravessam meia-noite exibem a data de término', async () => {
  const { eventLabel } = await import('./weeklySharing.js');
  assert.match(eventLabel({ inicio: '2026-11-10T02:30:00Z', fim: '2026-11-10T03:30:00Z' }), /09\/11\/2026 — 23:30 às 00:30, 10\/11\/2026/);
});

test('inclui alunos inativos apenas quando há atendimento agendado na semana', async () => {
  const { eligibleWeeklyStudents } = await import('./weeklySharing.js');
  const students = [{ id: 'active', status: 'Ativo' }, { id: 'a', status: 'Inativo' }, { id: 'none', status: 'Inativo' }, { id: 'cancel', status: 'Inativo' }];
  const cancelled = { ...event, status: 'cancelado', alunos: [{ id: 'cancel' }] };
  assert.deepEqual(eligibleWeeklyStudents(students, [event, cancelled], range).map(s => s.id), ['active', 'a']);
  assert.deepEqual(eligibleWeeklyStudents(students, [event], weeklyRange(true, new Date('2026-11-11T12:00:00Z'))).map(s => s.id), ['active']);
});

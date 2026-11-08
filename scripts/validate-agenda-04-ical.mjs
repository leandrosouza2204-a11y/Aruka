import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';
import { agendaMidnight, escapeIcs, foldIcs, individualEvents, makeIcs } from '../src/features/agenda/utils/weeklySharing.js';
const require = createRequire(import.meta.url);
const ICAL = require(resolve(process.argv[2] || 'tmp-responsive-screenshots/agenda04-parser/package/dist/ical.es5.cjs'));
const range = { start: '2026-11-09', end: '2026-11-16', last: '2026-11-15' };
const rows = [
  { id: 'recurring-moved', inicio: '2026-11-10T23:30:00-03:00', fim: '2026-11-11T00:30:00-03:00', status: 'agendado', tipo: 'atendimento', alunos: [{ id: 'a' }, { id: 'other' }], observacoes: 'privado' },
  { id: 'cancelled', inicio: '2026-11-12T13:00:00Z', fim: '2026-11-12T14:00:00Z', status: 'cancelado', tipo: 'atendimento', alunos: [{ id: 'a' }] },
  { id: 'other', inicio: '2026-11-12T15:00:00Z', fim: '2026-11-12T16:00:00Z', status: 'agendado', tipo: 'atendimento', alunos: [{ id: 'other' }] },
];
const text = makeIcs(individualEvents(rows, 'a', range), new Date('2026-11-01T00:00:00Z'));
const calendar = new ICAL.Component(ICAL.parse(text));
assert.equal(calendar.name, 'vcalendar'); assert.equal(calendar.getFirstPropertyValue('version'), '2.0');
const events = calendar.getAllSubcomponents('vevent'); assert.equal(events.length, 1);
const event = new ICAL.Event(events[0]);
assert.equal(event.uid, 'recurring-moved@agenda.aruka');
assert.equal(event.startDate.toJSDate().toISOString(), '2026-11-11T02:30:00.000Z');
assert.equal(event.endDate.toJSDate().toISOString(), '2026-11-11T03:30:00.000Z');
assert.ok(events[0].getFirstPropertyValue('dtstamp')); assert.equal(events[0].getAllSubcomponents('valarm').length, 1);
assert.doesNotMatch(text, /privado|cancelled|other/); assert.equal(agendaMidnight(range.start), '2026-11-09T03:00:00.000Z');
const original = 'á'.repeat(80) + ', linha; teste\\final\nmais';
const custom = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//test//EN\r\nBEGIN:VEVENT\r\nUID:test\r\nDTSTAMP:20261101T000000Z\r\nDTSTART:20261111T023000Z\r\n${foldIcs(`SUMMARY:${escapeIcs(original)}`)}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
assert.equal(new ICAL.Component(ICAL.parse(custom)).getFirstSubcomponent('vevent').getFirstPropertyValue('summary'), original);
console.log('AGENDA_04_ICAL_PARSER=PASS (ical.js 2.2.1)');

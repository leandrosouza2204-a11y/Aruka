import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abbreviateWeekday, introductionFor, personalizedWeeklyMessage } from './personalizedMessages.js';

test('personalização usa primeiro nome e preserva acentos e espaços', () => {
  for (const [input, expected] of [['Luiza', 'Luiza'], [' Luiza Abreu ', 'Luiza'], ['  Íris   Almeida ', 'Íris']]) {
    assert.match(introductionFor({ nome: input }), new RegExp(`^Oii, ${expected}!`));
  }
  assert.match(introductionFor({ nome: '   ' }), /^Oii! Tudo bem\?/);
  assert.match(introductionFor(), /^Oii! Tudo bem\?/);
});

test('abrevia dias úteis sem alterar datas e horários', () => {
  assert.equal(abbreviateWeekday('terça-feira, 10/11/2026 — 09:00 às 10:00'), 'terça, 10/11/2026 — 09:00 às 10:00');
  assert.equal(abbreviateWeekday('sábado, 14/11/2026 — 09:00 às 10:00'), 'sábado, 14/11/2026 — 09:00 às 10:00');
});

test('apresentação explica calendário e mensagem semanal mantém combinados e ordem', () => {
  assert.match(introductionFor({ nome: 'Luiza' }), /\.ics/);
  const message = personalizedWeeklyMessage({ nome: 'Luiza Abreu' }, ['segunda 09:00', 'terça 10:00']);
  assert.match(message, /^Oii, Luiza!/);
  assert.ok(message.indexOf('segunda 09:00') < message.indexOf('terça 10:00'));
  assert.match(message, /segunda 09:00\n📅 terça 10:00/);
  assert.match(message, /24 horas/);
  assert.match(message, /15 minutos/);
});

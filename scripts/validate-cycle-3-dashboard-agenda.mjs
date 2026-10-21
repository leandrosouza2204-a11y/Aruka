import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = read("src/features/dashboard/components/DashboardPage.jsx");
const component = read("src/features/dashboard/components/DashboardTodayAgenda.jsx");
const hook = read("src/features/dashboard/hooks/useDashboardAgenda.js");
const agendaHook = read("src/features/agenda/hooks/useAgendaPage.js");
const details = read("src/features/agenda/components/AgendaDetailsModal.jsx");
const service = read("src/services/agendaService.js");
const css = read("src/index.css");

assert.ok(page.indexOf("<DashboardHeader") < page.indexOf("<DashboardTodayAgenda"), "agenda must follow the Dashboard header");
assert.ok(page.indexOf("<DashboardTodayAgenda") < page.indexOf("dashboard-operational-section"), "today agenda must precede operational indicators");
assert.match(hook, /buscarPainelAgendaHoje/);
assert.match(hook, /window\.addEventListener\("focus"/);
assert.match(hook, /visibilitychange/);
assert.doesNotMatch(hook, /setInterval|poll/i, "dashboard agenda must not poll");
assert.match(service, /buscarCompromissosDoDia\(dateKey\)/);
assert.match(service, /buscarProximosAtendimentos\(startIso, limit, compromissos\)/);
assert.match(service, /buscarResumoAgenda\(dateKey, compromissos\)/);
assert.match(component, /agenda\.status === "loading"/);
assert.match(component, /agenda\.status === "error"/);
assert.match(component, /!agenda\.itens\.length/);
assert.match(component, /\/agenda\?compromisso=/);
assert.match(component, /\/agenda\?novo=/);
assert.match(component, /Ver agenda completa/);
assert.match(agendaHook, /searchParams\.get\("compromisso"\)/);
assert.match(agendaHook, /searchParams\.get\("novo"\)/);
assert.match(details, /\/alunos\?alunoId=/);
assert.match(css, /\.dashboard-today-agenda/);
assert.match(css, /@media \(max-width: 640px\)[\s\S]*?\.dashboard-agenda-item/);
assert.match(css, /\.dashboard-page > \.dashboard-today-agenda \{ order: 1; \}/);

console.log("CYCLE_3_DASHBOARD_AGENDA=PASS");
console.log("DASHBOARD_AGENDA_ISOLATED_FAILURE=PASS");
console.log("AGENDA_DEEP_LINKS=PASS");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

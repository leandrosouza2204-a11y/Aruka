import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = read("supabase/migrations/20261021001403_professional_agenda.sql");
const grantMigration = read("supabase/migrations/20261021153551_agenda_least_privilege_grants.sql");
const app = read("src/App.jsx");
const sidebar = read("src/components/Sidebar.jsx");
const mobileNav = read("src/components/MobileBottomNavigation.jsx");
const service = read("src/services/agendaService.js");
const page = read("src/features/agenda/components/AgendaPage.jsx");
const form = read("src/features/agenda/components/AgendaFormModal.jsx");
const css = read("src/index.css");

for (const table of ["agenda_series", "agenda_compromissos", "agenda_participantes", "agenda_excecoes"]) {
  assert.match(migration, new RegExp(`create table public\\.${table}`), `${table} must be versioned`);
  assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`), `${table} must enable RLS`);
  assert.match(migration, new RegExp(`grant select, insert, update, delete on table public\\.${table} to authenticated`), `${table} must opt into Data API access explicitly`);
  assert.match(migration, new RegExp(`revoke all on table public\\.${table} from anon`), `${table} must reject anon`);
  assert.match(
    grantMigration,
    new RegExp(`revoke truncate, references, trigger on table public\\.${table} from authenticated`),
    `${table} must deny privileges that bypass or alter the RLS boundary`,
  );
}

assert.match(migration, /exclude using gist[\s\S]*tstzrange\(inicio, fim, '\[\)'\)/, "database must prevent overlaps atomically");
assert.match(migration, /limite_ocorrencias between 1 and 366/, "series must have a hard occurrence limit");
assert.match(migration, /v_termina_em > v_data_inicial \+ 730/, "series must have a hard date horizon");
assert.match(migration, /AGENDA_STUDENT_OWNER_MISMATCH/, "student ownership must be server validated");
assert.match(migration, /security invoker/g, "agenda functions must retain caller RLS");
assert.doesNotMatch(migration, /security definer/i, "agenda must not add privileged functions");

for (const rpc of ["agenda_criar_compromisso", "agenda_atualizar_compromisso", "agenda_atualizar_status", "agenda_cancelar_compromisso"]) {
  assert.match(migration, new RegExp(`create or replace function public\\.${rpc}`), `${rpc} must exist`);
  assert.match(service, new RegExp(`rpc\\("${rpc}"`), `${rpc} must be used by the client service`);
}

assert.match(app, /path="\/agenda"[\s\S]*?<ProfessionalRoute>[\s\S]*?<Agenda \/>/, "agenda route must require professional access");
assert.match(sidebar, /to="\/agenda"[\s\S]*?label="Agenda"/, "desktop sidebar must expose Agenda");
assert.match(mobileNav, /mobile-more-list[\s\S]*?to="\/agenda"/, "mobile Agenda must live under Mais");
assert.doesNotMatch(mobileNav, /<BottomLink[\s\S]{0,120}to="\/agenda"/, "Agenda must not become a sixth fixed mobile tab");
assert.match(page, /\['dia', 'Dia'\],[\s\S]*\['semana', 'Semana'\],[\s\S]*\['mes', 'Mês'\]/, "day/week/month views must be available");
assert.match(form, /Somente esta ocorrência/);
assert.match(form, /Esta e as próximas da série/);
assert.match(css, /height: 100dvh/);
assert.match(css, /env\(safe-area-inset-bottom/);
assert.match(css, /@media \(max-width: 359px\)/);

for (const contract of ["buscarCompromissosDoDia", "buscarProximosAtendimentos", "buscarResumoAgenda"]) {
  assert.match(service, new RegExp(`export async function ${contract}`), `${contract} prepares Mission 3`);
}

console.log("CYCLE_2_PROFESSIONAL_AGENDA_STATIC=PASS");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

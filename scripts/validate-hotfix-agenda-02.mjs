import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const hook = read("src/features/agenda/hooks/useAgendaPage.js");
const form = read("src/features/agenda/components/AgendaFormModal.jsx");
const details = read("src/features/agenda/components/AgendaDetailsModal.jsx");
const page = read("src/features/agenda/components/AgendaPage.jsx");
const service = read("src/services/agendaService.js");
const mutation = read("src/features/agenda/utils/agendaMutation.js");
const dashboard = read("src/features/dashboard/hooks/useDashboardAgenda.js");
const migration = read("supabase/migrations/20261021001403_professional_agenda.sql");

assert.match(hook, /const \{ confirmar \} = useConfirm\(\)/, "Agenda must use the confirmation context API");
assert.match(hook, /await confirmar\(/, "cancellation must await explicit confirmation");
assert.doesNotMatch(hook, /const confirm = useConfirm\(\)/, "confirmation context object must not be called as a function");
assert.match(hook, /mutationRef\.current/, "mutations must use a synchronous duplicate guard");
assert.match(hook, /applyAgendaCancellation\(current, event, scope\)/, "Agenda must update immediately after cancellation");
assert.match(hook, /setActionError\(\{ message: describeAgendaCancellationFailure\(cancelError\), scope \}\)/, "cancellation failures must remain actionable");

const dispatchIndex = hook.indexOf("window.dispatchEvent(new Event(DASHBOARD_AGENDA_UPDATED_EVENT));", hook.indexOf("async function cancel"));
const reloadIndex = hook.indexOf("await load();", hook.indexOf("async function cancel"));
assert(dispatchIndex > 0 && reloadIndex > dispatchIndex, "Dashboard refresh must be dispatched before the background reload");

assert.match(form, /const saveResult = await onSave\(form, scope\)/, "modal must receive the backend result");
assert.match(form, /agenda-form-schedule-error/, "schedule errors must render beside date and time fields");
assert.match(form, /submitErrorRef\.current\?\.focus\(\)/, "submission error must receive accessible focus");
assert.match(form, /\["data", "inicio", "fim"\]\.includes\(field\)/, "schedule error must clear only when schedule fields change");
assert.match(details, /data-testid="agenda-cancel-error"/, "cancellation error must be visible inside the details modal");
assert.match(details, />Tentar novamente<\/button>/, "cancellation error must expose retry");
assert.match(page, /error=\{agenda\.actionError\?\.message \|\| ""\}/, "details modal must receive cancellation feedback");

assert.match(mutation, /Já existe um compromisso nesse horário\. Escolha outro intervalo\./, "conflict copy must match the acceptance text");
assert.doesNotMatch(mutation, /error\?\.message/, "unexpected backend details must not be shown by feedback helpers");
assert.match(service, /Number\(data\.cancelados\) < 1/, "service must reject an unconfirmed cancellation result");
assert.match(service, /AGENDA_COMMITMENT_NOT_FOUND/, "missing commitment must be normalized safely");

assert.match(migration, /language plpgsql\s+security invoker[\s\S]*?agenda_cancelar_compromisso/, "agenda functions must remain SECURITY INVOKER");
assert.match(migration, /where id = p_compromisso_id and profissional_id = v_actor/, "cancellation must retain ownership filtering");
assert.match(migration, /set status = 'cancelado', is_exception = \(serie_id is not null\)/, "cancellation must remain logical");
assert.match(migration, /agenda_excecoes[\s\S]*?'cancelada'/, "recurring occurrence cancellation must retain its exception");
assert.match(dashboard, /DASHBOARD_AGENDA_UPDATED_EVENT/, "Dashboard must retain the Agenda refresh contract");

const unexpectedMigration = readdirSync(new URL("../supabase/migrations", import.meta.url))
  .find((name) => /hotfix.*agenda.*02|agenda.*cancel.*conflict/i.test(name));
assert.equal(unexpectedMigration, undefined, "application-only hotfix must not add a migration without demonstrated need");

console.log("HOTFIX_AGENDA_02_STATIC=PASS");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

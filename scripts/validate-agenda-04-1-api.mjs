import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { readLocalSupabaseRuntime } from './lib/local-supabase-runtime.mjs';
import { runPsql, validateLocalGuard } from './supabase-cycle-8-lib.mjs';

// Runs only against the pre-existing local stack. Never logs credentials or tokens.
const root = process.cwd();
assert.equal(validateLocalGuard(root).ok, true, 'local-only guard failed');
const runtime = readLocalSupabaseRuntime();
assert.match(runtime.apiUrl, /^http:\/\/(127\.0\.0\.1|localhost):54321$/);
const marker = `agenda041-qa-${randomUUID()}`;
const schema = readFileSync('supabase/migrations/20261109002142_agenda_introduction_confirmation.sql', 'utf8');
const sql = statement => runPsql(root, statement);
const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const credentials = ['a', 'b'].map(letter => ({ email: `${marker}-${letter}@example.invalid`, password: randomBytes(24).toString('base64url') }));
const users = [];
const students = [randomUUID(), randomUUID(), randomUUID()];
let tableCreated = false;
const assertOk = result => { if (result.error) throw new Error(`local API failure: ${result.error.code || result.error.status || 'unknown'}`); return result.data; };
async function login(credential) {
  const client = createClient(runtime.apiUrl, runtime.anonKey, options);
  assertOk(await client.auth.signInWithPassword(credential));
  return client;
}
async function read(client, professional, student) {
  return client.from('agenda_apresentacoes').select('aluno_id').eq('profissional_id', professional).eq('aluno_id', student).maybeSingle();
}
async function confirm(client, professional, student) {
  return client.from('agenda_apresentacoes').upsert({ profissional_id: professional, aluno_id: student }, { onConflict: 'profissional_id,aluno_id', ignoreDuplicates: true });
}

try {
  // Atomic precondition ensures we never replace an existing table.
  sql(`begin; do $$ begin if to_regclass('public.agenda_apresentacoes') is not null then raise exception 'TEST_TABLE_ALREADY_EXISTS'; end if; end $$; ${schema}\ncomment on table public.agenda_apresentacoes is '${marker}'; notify pgrst, 'reload schema'; commit;`);
  tableCreated = true;
  for (const credential of credentials) {
    const data = assertOk(await admin.auth.admin.createUser({ ...credential, email_confirm: true }));
    users.push(data.user.id);
  }
  sql(`insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status) values
    ('${students[0]}','${users[0]}','Aluno A','11999990001',current_date,'QA',0,'Ativo'),
    ('${students[1]}','${users[1]}','Aluno B','11999990002',current_date,'QA',0,'Ativo'),
    ('${students[2]}','${users[0]}','Aluno C','11999990003',current_date,'QA',0,'Ativo');`);
  const a = await login(credentials[0]);
  const b = await login(credentials[1]);
  let initial;
  for (let attempt = 0; attempt < 30; attempt++) {
    initial = await read(a, users[0], students[0]);
    if (!initial.error) break;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert.equal(assertOk(initial), null, 'initial state must be pending');
  for (const result of await Promise.all([confirm(a, users[0], students[0]), confirm(a, users[0], students[0])])) assertOk(result);
  const freshSession = await login(credentials[0]);
  assert.equal(assertOk(await read(freshSession, users[0], students[0])).aluno_id, students[0]);
  assert.equal(assertOk(await read(a, users[0], students[2])), null, 'another student remains pending');
  assert.ok((await confirm(a, users[0], students[1])).error, 'cross-student write must fail');
  assert.equal(assertOk(await read(b, users[0], students[0])), null, 'cross-professional read must be hidden');
  const anonymous = createClient(runtime.apiUrl, runtime.anonKey, options);
  assert.ok((await read(anonymous, users[0], students[0])).error, 'anonymous read must fail');
  const offline = createClient(runtime.apiUrl, runtime.anonKey, { ...options, global: { fetch: async () => { throw new Error('synthetic network failure'); } } });
  assert.ok((await confirm(offline, users[0], students[2])).error, 'network failure must not report success');
  console.log('AGENDA_04_1_API=PASS: real local Auth, REST, sessions, RLS, concurrency and network failure');
} finally {
  // Only exact synthetic IDs are removed. Drop the table only when the marker
  // matches and it has no rows other than those created by this test.
  if (tableCreated) {
    sql(`begin; do $$ begin
      if obj_description('public.agenda_apresentacoes'::regclass) is distinct from '${marker}' then raise exception 'TEST_TABLE_MARKER_MISMATCH'; end if;
      if exists (select 1 from public.agenda_apresentacoes where profissional_id not in (${users.length ? users.map(id => `'${id}'`).join(',') : "'00000000-0000-0000-0000-000000000000'"})) then raise exception 'TEST_TABLE_HAS_UNOWNED_ROWS'; end if;
    end $$; delete from public.agenda_apresentacoes where profissional_id in (${users.length ? users.map(id => `'${id}'`).join(',') : "'00000000-0000-0000-0000-000000000000'"});
    delete from public.alunos where id in (${students.map(id => `'${id}'`).join(',')});
    drop table public.agenda_apresentacoes; notify pgrst, 'reload schema'; commit;`);
  }
  for (const user of users) assertOk(await admin.auth.admin.deleteUser(user));
}

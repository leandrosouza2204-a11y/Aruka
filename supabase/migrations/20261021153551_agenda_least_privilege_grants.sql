begin;

revoke truncate, references, trigger on table public.agenda_series from authenticated;
revoke truncate, references, trigger on table public.agenda_compromissos from authenticated;
revoke truncate, references, trigger on table public.agenda_participantes from authenticated;
revoke truncate, references, trigger on table public.agenda_excecoes from authenticated;

commit;

revoke all on function public.claim_pending_student_invite() from public;
revoke all on function public.claim_pending_student_invite() from anon;
grant execute on function public.claim_pending_student_invite() to authenticated;

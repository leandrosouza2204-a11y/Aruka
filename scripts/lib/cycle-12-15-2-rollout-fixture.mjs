import { runPsql } from "../supabase-cycle-8-lib.mjs";

export function enableLocalStudentV2Rollout(studentId) {
  runPsql(process.cwd(), `
    update private.student_experience_rollout_config
    set global_enabled=true, emergency_blocked=false, config_version=config_version+1, reason='LOCAL_QA_ONLY';
    insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason)
    values('student','${studentId}'::uuid,true,'LOCAL_QA_ONLY')
    on conflict(target_type,target_id) do update set enabled=true,reason=excluded.reason,updated_at=now();
  `);
}

export function disableLocalStudentV2Rollout(studentId) {
  runPsql(process.cwd(), `
    delete from private.student_experience_rollout_targets where target_type='student' and target_id='${studentId}'::uuid;
    update private.student_experience_rollout_config
    set global_enabled=false, emergency_blocked=false, config_version=config_version+1, reason='DEFAULT_OFF';
  `, { throwOnError: false });
}

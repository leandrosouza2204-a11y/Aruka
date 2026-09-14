import { normalizeStudentAccessState, STUDENT_ACCESS_STATUS } from "../../studentAccess/utils/studentAccessLifecycle.js";

export const STUDENT_V2_ACCESS = Object.freeze({ ALLOWED: "allowed", UNLINKED: "unlinked", INACTIVE: "inactive" });

export function resolveStudentExperienceV2Access(payload = {}) {
  const access = normalizeStudentAccessState(payload.studentAccess || payload.student_access || {});
  if (!payload.student) return { state: STUDENT_V2_ACCESS.UNLINKED, access };
  if (access.status !== STUDENT_ACCESS_STATUS.ACTIVE) return { state: STUDENT_V2_ACCESS.INACTIVE, access };
  return { state: STUDENT_V2_ACCESS.ALLOWED, access };
}

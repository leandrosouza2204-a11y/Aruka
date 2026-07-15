import { PublicActorRole } from "../public/public-enums.js";

export const AuthorizationAction = Object.freeze({
  REQUEST_DECISION: "REQUEST_DECISION",
  READ_DECISION: "READ_DECISION",
  READ_TRACE: "READ_TRACE",
  SUBMIT_REVIEW: "SUBMIT_REVIEW",
  READ_REVIEW: "READ_REVIEW",
  ADMIN_AUDIT: "ADMIN_AUDIT",
});

function sameOrganization(actor, resource) {
  if (!resource?.organizationId) return true;
  return actor?.organizationId === resource.organizationId;
}

export function createAuthorizationPolicy() {
  return {
    authorize({ actor, action, resource = {} }) {
      if (!actor?.actorId || !actor?.role) return { allowed: false, reason: "missing actor" };
      if (actor.role === PublicActorRole.ADMIN) return { allowed: true };
      if (actor.role === PublicActorRole.SYSTEM) {
        return { allowed: [AuthorizationAction.REQUEST_DECISION, AuthorizationAction.READ_DECISION, AuthorizationAction.READ_REVIEW].includes(action) };
      }
      if (actor.role === PublicActorRole.PROFESSIONAL) {
        if (!sameOrganization(actor, resource)) return { allowed: false, reason: "organization mismatch" };
        return { allowed: [AuthorizationAction.REQUEST_DECISION, AuthorizationAction.READ_DECISION, AuthorizationAction.READ_TRACE, AuthorizationAction.SUBMIT_REVIEW, AuthorizationAction.READ_REVIEW].includes(action) };
      }
      if (actor.role === PublicActorRole.STUDENT_READ_ONLY) {
        return { allowed: action === AuthorizationAction.READ_DECISION && resource.studentId === actor.actorId && sameOrganization(actor, resource) };
      }
      return { allowed: false, reason: "unsupported role" };
    },
  };
}

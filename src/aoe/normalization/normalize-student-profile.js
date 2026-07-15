import { validateStudentProfileInput } from "../contracts/input-contract.js";
import { deepFreeze } from "../utils/deep-freeze.js";

export function normalizeStudentProfile(profile) {
  validateStudentProfileInput(profile);
  const critical = ["goal", "experienceLevel", "availableDaysPerWeek", "availableMinutesPerSession", "equipmentProfile", "constraints", "recovery"];
  const missingCritical = critical.filter((key) => profile[key] === undefined || profile[key] === null);
  const normalized = {
    studentId: profile.studentId,
    sex: profile.sex,
    goal: profile.goal,
    experienceLevel: profile.experienceLevel,
    frequency: profile.availableDaysPerWeek,
    sessionDuration: profile.availableMinutesPerSession,
    equipment: {
      profile: profile.equipmentProfile,
      available: [...(profile.availableEquipment ?? [])].sort(),
    },
    constraints: [...profile.constraints],
    preferences: { ...(profile.preferences ?? {}) },
    recoveryCapacity: profile.recovery.capacity ?? "MEDIUM",
    adherenceCapacity: profile.adherence?.capacity ?? "MEDIUM",
    specialization: profile.specializationInterest ?? null,
    completeness: {
      missingCritical,
      criticalComplete: missingCritical.length === 0,
    },
    warnings: [],
    metadata: { ...(profile.metadata ?? {}) },
  };
  return deepFreeze(normalized);
}

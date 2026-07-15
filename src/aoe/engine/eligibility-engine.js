import { ExperienceLevel, Goal, ReasonCodes, RuleOutcome, Strategy } from "../domain/enums.js";

const levelRank = { [ExperienceLevel.BEGINNER]: 1, [ExperienceLevel.INTERMEDIATE]: 2, [ExperienceLevel.ADVANCED]: 3 };
const demandRank = { LOW: 1, MEDIUM: 2, HIGH: 3 };

function frequencyValue(model) {
  return typeof model.frequency === "object" ? model.frequency.minimum : model.frequency;
}

function push(result, id, pass, reasonCode, message) {
  result.rules.push({ id, outcome: pass ? RuleOutcome.PASS : RuleOutcome.FAIL, reasonCode, message });
  if (!pass && reasonCode) result.reasonCodes.push(reasonCode);
}

export function evaluateEligibility(profile, models) {
  return models.map((model) => {
    const result = { model, eligible: true, reasonCodes: [], warnings: [], rules: [] };
    const fail = (id, code, message) => {
      push(result, id, false, code, message);
      result.eligible = false;
    };
    const pass = (id, message) => push(result, id, true, null, message);

    if (model.goal === profile.goal || profile.goal === Goal.HEALTH) pass("AOE-ELG-001", "Goal compatible");
    else fail("AOE-ELG-001", ReasonCodes.GOAL_MISMATCH, "Goal mismatch");

    const studentLevel = levelRank[profile.experienceLevel] ?? 0;
    const modelLevel = levelRank[model.experienceLevel] ?? 9;
    if (modelLevel <= studentLevel) pass("AOE-ELG-002", "Experience compatible");
    else fail("AOE-ELG-002", ReasonCodes.LEVEL_TOO_LOW, "Model requires higher level");

    if (profile.frequency >= frequencyValue(model)) pass("AOE-ELG-003", "Frequency compatible");
    else fail("AOE-ELG-003", ReasonCodes.FREQUENCY_INSUFFICIENT, "Insufficient weekly frequency");

    if (profile.sessionDuration >= model.minimumSessionDuration) pass("AOE-ELG-004", "Duration compatible");
    else fail("AOE-ELG-004", ReasonCodes.DURATION_INSUFFICIENT, "Insufficient session duration");

    if (profile.equipment.profile === "FULL_GYM" || model.adaptableEquipment.length > 0) {
      pass("AOE-ELG-005", "Equipment compatible or adaptable");
      if (profile.equipment.profile !== "FULL_GYM") result.warnings.push(ReasonCodes.EQUIPMENT_ADAPTATION_REQUIRED);
    } else fail("AOE-ELG-005", ReasonCodes.EQUIPMENT_MISSING, "Essential equipment missing");

    if ((demandRank[profile.recoveryCapacity] ?? 0) >= (demandRank[model.recoveryDemand] ?? 9)) pass("AOE-ELG-006", "Recovery compatible");
    else fail("AOE-ELG-006", ReasonCodes.RECOVERY_INSUFFICIENT, "Insufficient recovery capacity");

    if (model.aplRelease === "SPRINT_01" || model.aplRelease === "SPRINT_02") pass("AOE-ELG-007", "Release active");
    else fail("AOE-ELG-007", ReasonCodes.MODEL_RELEASE_INACTIVE, "Inactive release");

    if (model.homologated === true) pass("AOE-ELG-008", "Model homologated");
    else fail("AOE-ELG-008", ReasonCodes.MODEL_NOT_HOMOLOGATED, "Model not homologated");

    if (model.sex === "NOT_INFORMED" || profile.sex === "NOT_INFORMED" || model.sex === profile.sex) pass("AOE-ELG-009", "Sex scope compatible");
    else fail("AOE-ELG-009", ReasonCodes.CRITICAL_CONSTRAINT, "Sex scope mismatch");

    if (model.strategy !== Strategy.SPECIALIZATION) pass("AOE-ELG-010", "No specialization prerequisite");
    else if (profile.specialization?.target === model.specializationTarget && profile.specialization?.readiness === "READY") pass("AOE-ELG-010", "Specialization prerequisite met");
    else fail("AOE-ELG-010", ReasonCodes.SPECIALIZATION_PREREQUISITE_MISSING, "Specialization prerequisite missing");

    return result;
  });
}

import { EquipmentProfile, ExperienceLevel, Goal, Sex } from "../domain/enums.js";
import { AOEInputError } from "../domain/errors.js";

const allowed = (source, value) => Object.values(source).includes(value);

export function validateStudentProfileInput(profile) {
  if (!profile || typeof profile !== "object") throw new AOEInputError("Profile must be an object.");
  const errors = [];
  if (!profile.studentId || typeof profile.studentId !== "string") errors.push("studentId is required.");
  if (!allowed(Sex, profile.sex)) errors.push("sex is invalid.");
  if (!allowed(Goal, profile.goal)) errors.push("goal is invalid.");
  if (!allowed(ExperienceLevel, profile.experienceLevel)) errors.push("experienceLevel is invalid.");
  if (!Number.isInteger(profile.availableDaysPerWeek) || profile.availableDaysPerWeek < 1 || profile.availableDaysPerWeek > 7) errors.push("availableDaysPerWeek must be 1-7.");
  if (!Number.isFinite(profile.availableMinutesPerSession) || profile.availableMinutesPerSession < 1) errors.push("availableMinutesPerSession must be positive.");
  if (!allowed(EquipmentProfile, profile.equipmentProfile)) errors.push("equipmentProfile is invalid.");
  if (!Array.isArray(profile.constraints)) errors.push("constraints must be an array.");
  if (!profile.recovery || typeof profile.recovery !== "object") errors.push("recovery is required.");
  if (errors.length) throw new AOEInputError(errors.join(" "));
  return true;
}

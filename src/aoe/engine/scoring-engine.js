import { PENALTIES, MAX_PENALTY_TOTAL } from "../config/penalties.js";
import { SCORE_WEIGHTS } from "../config/weights.js";
import { ExperienceLevel, ReasonCodes, Strategy } from "../domain/enums.js";
import { clamp, roundTo } from "../utils/number.js";

const levelRank = { [ExperienceLevel.BEGINNER]: 1, [ExperienceLevel.INTERMEDIATE]: 2, [ExperienceLevel.ADVANCED]: 3 };
const demandRank = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const complexityRank = { LOW: 1, MODERATE: 3, MEDIUM: 3, HIGH: 5 };

function weighted(dimensions) {
  return Object.entries(SCORE_WEIGHTS).reduce((sum, [key, weight]) => sum + ((dimensions[key] ?? 0) * weight) / 100, 0);
}

function preferenceScore(value, preferred) {
  if (!preferred) return 70;
  return value === preferred ? 100 : 40;
}

function frequencyValue(model) {
  return typeof model.frequency === "object" ? (model.frequency.recommended ?? model.frequency.minimum) : model.frequency;
}

function buildPenalties(profile, model, inheritedWarnings) {
  const penalties = [];
  if (profile.sessionDuration <= model.minimumSessionDuration + 5) penalties.push({ code: ReasonCodes.TIME_AT_LIMIT, value: PENALTIES.TIME_AT_LIMIT });
  if (profile.recoveryCapacity === model.recoveryDemand && profile.recoveryCapacity !== "HIGH") {
    penalties.push({ code: ReasonCodes.RECOVERY_AT_LIMIT, value: PENALTIES.RECOVERY_AT_LIMIT });
  }
  if (profile.adherenceCapacity === "LOW") penalties.push({ code: ReasonCodes.ADHERENCE_RISK, value: PENALTIES.ADHERENCE_RISK });
  if (profile.preferences.split && profile.preferences.split !== model.split) penalties.push({ code: ReasonCodes.PREFERENCE_MISMATCH, value: PENALTIES.PREFERENCE_MISMATCH });
  if (profile.preferences.strategy && profile.preferences.strategy !== model.strategy) penalties.push({ code: ReasonCodes.PREFERENCE_MISMATCH, value: PENALTIES.PREFERENCE_MISMATCH });
  if (inheritedWarnings.includes(ReasonCodes.EQUIPMENT_ADAPTATION_REQUIRED)) penalties.push({ code: ReasonCodes.EQUIPMENT_ADAPTATION_REQUIRED, value: PENALTIES.EQUIPMENT_ADAPTATION_REQUIRED });
  if (profile.specialization?.readiness === "PARTIAL" && model.strategy === Strategy.SPECIALIZATION) {
    penalties.push({ code: ReasonCodes.SPECIALIZATION_PARTIAL_READINESS, value: PENALTIES.SPECIALIZATION_PARTIAL_READINESS });
  }
  if (penalties.length >= 2) penalties.push({ code: ReasonCodes.MULTIPLE_WARNINGS, value: PENALTIES.MULTIPLE_WARNINGS });
  const total = Math.max(MAX_PENALTY_TOTAL, penalties.reduce((sum, penalty) => sum + penalty.value, 0));
  return { items: penalties, total };
}

export function scoreCandidates(profile, candidates) {
  return candidates.map((candidate) => {
    const model = candidate.model;
    const complexity = typeof model.complexity === "number" ? model.complexity : (complexityRank[model.complexity] ?? 3);
    const durationHeadroom = profile.sessionDuration - model.minimumSessionDuration;
    const dimensions = {
      goalFit: model.goal === profile.goal ? 100 : 80,
      levelFit: levelRank[model.experienceLevel] === levelRank[profile.experienceLevel] ? 100 : 20,
      frequencyFit: profile.frequency === frequencyValue(model) ? 100 : profile.frequency === frequencyValue(model) + 1 ? 85 : 70,
      durationFit: profile.sessionDuration >= model.maximumSessionDuration ? 100 : durationHeadroom >= 10 ? 85 : 65,
      equipmentFit: profile.equipment.profile === "FULL_GYM" ? 100 : 75,
      recoveryFit: (demandRank[profile.recoveryCapacity] ?? 0) > (demandRank[model.recoveryDemand] ?? 0) ? 100 : 80,
      adherenceFit: profile.adherenceCapacity === "HIGH" ? 100 : profile.adherenceCapacity === "MEDIUM" ? 80 : 55,
      splitPreference: preferenceScore(model.split, profile.preferences.split),
      strategyPreference: profile.preferences.strategy === Strategy.SPECIALIZATION && model.strategy !== Strategy.SPECIALIZATION
        ? 0
        : preferenceScore(model.strategy, profile.preferences.strategy),
      specializationFit: model.specializationTarget
        ? (model.specializationTarget === profile.specialization?.target ? 100 : 30)
        : (profile.specialization?.target ? 20 : 70),
      operationalSimplicity: complexity <= 2 ? 100 : complexity === 3 ? 80 : complexity === 4 ? 60 : 45,
    };
    const rawScore = roundTo(weighted(dimensions), 2);
    const penalties = buildPenalties(profile, model, candidate.warnings);
    const finalScore = roundTo(clamp(rawScore + penalties.total, 0, 100), 2);
    const warnings = [...new Set([...candidate.warnings, ...penalties.items.map((penalty) => penalty.code)])];
    return {
      model,
      dimensions,
      rawScore,
      finalScore,
      penalties,
      warnings,
      reasonCodes: [...new Set([...candidate.reasonCodes, ...warnings])],
      eligibilityRules: candidate.rules,
    };
  });
}

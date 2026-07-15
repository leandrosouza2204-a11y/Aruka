import { EquipmentProfile, ExperienceLevel, Goal, Sex, Strategy, TrainingSplit } from "../../domain/enums.js";

const base = {
  sex: Sex.NOT_INFORMED,
  goal: Goal.HYPERTROPHY,
  constraints: [],
  recovery: { capacity: "MEDIUM" },
  adherence: { capacity: "MEDIUM" },
  availableEquipment: ["barbell", "dumbbells", "machines", "cables"],
};

function profile(id, overrides) {
  return { ...base, studentId: id, ...overrides };
}

export const goldenScenarios = [
  {
    id: "beginner-3d-60-full-gym",
    profile: profile("golden-001", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: { split: TrainingSplit.ABC, strategy: Strategy.BASE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABC-BASE-01" },
  },
  {
    id: "beginner-4d-high-adherence",
    profile: profile("golden-002", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 4,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      adherence: { capacity: "HIGH" },
      preferences: { split: TrainingSplit.ABCD, strategy: Strategy.BASE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABCD-BASE-01" },
  },
  {
    id: "beginner-5d-low-adherence",
    profile: profile("golden-003", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 5,
      availableMinutesPerSession: 45,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      adherence: { capacity: "LOW" },
      preferences: { split: TrainingSplit.ABCDE, strategy: Strategy.EFFICIENCY },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABCDE-EFI-01" },
  },
  {
    id: "intermediate-3d-performance",
    profile: profile("golden-004", {
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 70,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: { split: TrainingSplit.ABC, strategy: Strategy.PERFORMANCE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-M-ABC-PERF-01" },
  },
  {
    id: "intermediate-5d-delts-specialization",
    profile: profile("golden-005", {
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      availableDaysPerWeek: 5,
      availableMinutesPerSession: 70,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      recovery: { capacity: "HIGH" },
      adherence: { capacity: "HIGH" },
      specializationInterest: { target: "DELTOIDES", readiness: "READY" },
      preferences: { split: TrainingSplit.ABCDE, strategy: Strategy.SPECIALIZATION },
    }),
    expected: { selectedModelCode: "APL-M-HIP-M-ABCDE-ESP-DELTS-01" },
  },
  {
    id: "intermediate-4d-costas-specialization",
    profile: profile("golden-006", {
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      availableDaysPerWeek: 4,
      availableMinutesPerSession: 70,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      recovery: { capacity: "HIGH" },
      specializationInterest: { target: "COSTAS", readiness: "READY" },
      preferences: { split: TrainingSplit.UPPER_LOWER, strategy: Strategy.SPECIALIZATION },
    }),
    expected: { selectedModelCode: "APL-M-HIP-M-UL-ESP-COSTAS-01" },
  },
  {
    id: "intermediate-40-min",
    profile: profile("golden-007", {
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 40,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: { strategy: Strategy.EFFICIENCY },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABC-EFI-01" },
  },
  {
    id: "limited-equipment",
    profile: profile("golden-008", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.LIMITED_GYM,
      preferences: { split: TrainingSplit.ABC },
    }),
    expected: { status: "HUMAN_REVIEW_REQUIRED" },
  },
  {
    id: "full-body-preference",
    profile: profile("golden-009", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: { split: TrainingSplit.FULL_BODY, strategy: Strategy.BASE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-FB-BASE-01" },
  },
  {
    id: "preference-incompatible-frequency",
    profile: profile("golden-010", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 3,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: { split: TrainingSplit.ABCDE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABC-EFI-01" },
  },
  {
    id: "low-recovery",
    profile: profile("golden-011", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 5,
      availableMinutesPerSession: 55,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      recovery: { capacity: "LOW" },
      preferences: { split: TrainingSplit.ABCDE },
    }),
    expected: { selectedModelCode: "APL-M-HIP-I-ABCD-EFI-01" },
  },
  {
    id: "missing-critical-data",
    profile: {
      studentId: "golden-012",
      sex: Sex.NOT_INFORMED,
      goal: Goal.HYPERTROPHY,
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 3,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      constraints: [],
      recovery: { capacity: "MEDIUM" },
    },
    expected: { status: "INVALID_INPUT" },
  },
  {
    id: "technical-tie",
    profile: profile("golden-013", {
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 4,
      availableMinutesPerSession: 60,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      preferences: {},
    }),
    expected: { reasonCode: "TIE_UNRESOLVED" },
  },
  {
    id: "no-eligible-model",
    profile: profile("golden-014", {
      goal: Goal.REHABILITATION,
      experienceLevel: ExperienceLevel.BEGINNER,
      availableDaysPerWeek: 1,
      availableMinutesPerSession: 20,
      equipmentProfile: EquipmentProfile.BODYWEIGHT_ONLY,
      recovery: { capacity: "LOW" },
    }),
    expected: { status: "NO_ELIGIBLE_MODEL" },
  },
  {
    id: "specialization-without-readiness",
    profile: profile("golden-015", {
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      availableDaysPerWeek: 5,
      availableMinutesPerSession: 70,
      equipmentProfile: EquipmentProfile.FULL_GYM,
      recovery: { capacity: "HIGH" },
      specializationInterest: { target: "DELTOIDES", readiness: "PARTIAL" },
      preferences: { split: TrainingSplit.ABCDE, strategy: Strategy.SPECIALIZATION },
    }),
    expected: { reasonCode: "SPECIALIZATION_PREREQUISITE_MISSING" },
  },
];

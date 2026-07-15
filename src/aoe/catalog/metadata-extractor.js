import { EquipmentProfile, ExperienceLevel, Goal, Sex, Strategy, TrainingSplit } from "../domain/enums.js";

function ascii(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ÃÂ]/g, "")
    .toLowerCase()
    .trim();
}

export function normalizeSex(value) {
  const text = ascii(value);
  if (text.includes("fem")) return Sex.FEMALE;
  if (text.includes("masc") || text.includes("homem")) return Sex.MALE;
  return Sex.NOT_INFORMED;
}

export function normalizeLevel(value, code = "") {
  const text = `${ascii(value)} ${code}`;
  if (text.includes("-m-") || text.includes("intermedi")) return ExperienceLevel.INTERMEDIATE;
  if (text.includes("avanc")) return ExperienceLevel.ADVANCED;
  if (text.includes("-i-") || text.includes("inician")) return ExperienceLevel.BEGINNER;
  return ExperienceLevel.UNKNOWN;
}

export function normalizeGoal(value) {
  const text = ascii(value);
  if (text.includes("hip")) return Goal.HYPERTROPHY;
  if (text.includes("emag")) return Goal.WEIGHT_LOSS;
  if (text.includes("forc")) return Goal.STRENGTH;
  if (text.includes("cond")) return Goal.CONDITIONING;
  return Goal.HYPERTROPHY;
}

export function normalizeSplit(value, code = "") {
  const text = `${ascii(value)} ${code}`;
  if (text.includes("upper") || text.includes("-ul-")) return TrainingSplit.UPPER_LOWER;
  if (text.includes("full") || text.includes("-fb-")) return TrainingSplit.FULL_BODY;
  if (text.includes("abcde")) return TrainingSplit.ABCDE;
  if (text.includes("abcd")) return TrainingSplit.ABCD;
  return TrainingSplit.ABC;
}

export function normalizeStrategy(value, code = "") {
  const text = `${ascii(value)} ${code}`;
  if (text.includes("esp-") || text.includes("especial")) return Strategy.SPECIALIZATION;
  if (text.includes("perf")) return Strategy.PERFORMANCE;
  if (text.includes("efi") || text.includes("eficien")) return Strategy.EFFICIENCY;
  return Strategy.BASE;
}

export function normalizeEquipmentProfile(value) {
  const text = ascii(value);
  if (text.includes("casa")) return EquipmentProfile.HOME_BASIC;
  if (text.includes("peso corporal")) return EquipmentProfile.BODYWEIGHT_ONLY;
  if (text.includes("limit")) return EquipmentProfile.LIMITED_GYM;
  if (text.includes("maquina") || text.includes("halter") || text.includes("barra") || text.includes("cabo")) return EquipmentProfile.FULL_GYM;
  return EquipmentProfile.FULL_GYM;
}

export function normalizeDemand(value) {
  const text = ascii(value);
  if (text.includes("alta") || text.includes("high")) return "HIGH";
  if (text.includes("moder") || text.includes("media") || text.includes("medium")) return "MEDIUM";
  return "LOW";
}

export function specializationFrom(value, code = "", title = "") {
  const text = `${ascii(value)} ${ascii(code)} ${ascii(title)}`;
  if (text.includes("peito") || text.includes("chest")) return "PEITORAL";
  if (text.includes("delt")) return "DELTOIDES";
  if (text.includes("costa") || text.includes("back")) return "COSTAS";
  return null;
}

export function parseFrequency(value, split) {
  const numbers = String(value ?? "").match(/\d+/g)?.map(Number) ?? [];
  const fallback = split === TrainingSplit.ABCDE ? 5 : split === TrainingSplit.ABCD || split === TrainingSplit.UPPER_LOWER ? 4 : 3;
  const minimum = numbers[0] ?? fallback;
  const maximum = numbers[1] ?? minimum;
  const recommended = numbers[1] ?? maximum;
  return { minimum, maximum, recommended };
}

export function parseDuration(value) {
  const numbers = String(value ?? "").match(/\d+/g)?.map(Number) ?? [];
  if (!numbers.length) return null;
  const minimumMinutes = numbers[0];
  const maximumMinutes = numbers[1] ?? numbers[0];
  return {
    minimumMinutes,
    maximumMinutes,
    recommendedMinutes: Math.round((minimumMinutes + maximumMinutes) / 2),
    original: String(value),
  };
}

export function equipmentList(value) {
  const text = ascii(value);
  const items = [];
  if (text.includes("maquina")) items.push("machines");
  if (text.includes("cabo")) items.push("cables");
  if (text.includes("halter")) items.push("dumbbells");
  if (text.includes("barra")) items.push("barbell");
  return [...new Set(items)].sort();
}

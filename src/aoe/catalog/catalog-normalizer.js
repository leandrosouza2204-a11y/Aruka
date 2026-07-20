import {
  equipmentList,
  normalizeDemand,
  normalizeEquipmentProfile,
  normalizeGoal,
  normalizeLevel,
  normalizeSex,
  normalizeSplit,
  normalizeStrategy,
  parseDuration,
  parseFrequency,
  specializationFrom,
} from "./metadata-extractor.js";
import { Strategy } from "../domain/enums.js";

function pick(document, names) {
  for (const name of names) {
    if (document.metadata[name] || document.header[name]) return document.metadata[name] ?? document.header[name];
  }
  return "";
}

function derive(model, raw) {
  const derivations = [];
  let complexity = normalizeDemand(pick(raw, ["Complexidade"]));
  let recoveryDemand = normalizeDemand(pick(raw, ["Demanda de recuperacao", "Demanda de recuperação"]));
  let adherenceDemand = model.frequency.recommended >= 5 ? "HIGH" : "MEDIUM";
  let operationalComplexity = complexity;

  derivations.push({ source: "derived", rule: "CAT-DER-001", reason: "Adherence demand derived from weekly frequency." });
  if (model.strategy === Strategy.PERFORMANCE && complexity === "LOW") {
    complexity = "MEDIUM";
    derivations.push({ source: "derived", rule: "CAT-DER-002", reason: "Performance strategy requires at least moderate complexity." });
  }
  if (model.strategy === Strategy.SPECIALIZATION && recoveryDemand === "LOW") {
    recoveryDemand = "MEDIUM";
    derivations.push({ source: "derived", rule: "CAT-DER-003", reason: "Specialization requires at least moderate recovery demand." });
  }
  if (model.specializationTarget) {
    derivations.push({ source: "derived", rule: "CAT-DER-004", reason: "Specialization target derived from metadata/code/title." });
  }
  derivations.push({ source: "derived", rule: "CAT-DER-005", reason: "Equipment profile normalized from metadata." });
  if (model.strategy === Strategy.EFFICIENCY && operationalComplexity === "LOW") {
    operationalComplexity = "MEDIUM";
    derivations.push({ source: "derived", rule: "CAT-DER-006", reason: "Efficiency may require swaps or supersets." });
  }
  const progressionReadiness = model.experienceLevel === "INTERMEDIATE" ? "MEDIUM" : "LOW";
  derivations.push({ source: "derived", rule: "CAT-DER-007", reason: "Progression readiness derived from level." });
  derivations.push({ source: "derived", rule: "CAT-DER-008", reason: "Minimum experience derived from level." });
  return { complexity, recoveryDemand, adherenceDemand, operationalComplexity, progressionReadiness, derivations };
}

export function normalizeCatalogModel({ release, manifestItem, document, checksum, now }) {
  const metadata = { ...document.header, ...document.metadata };
  const modelCode = manifestItem.modelCode;
  const strategy = normalizeStrategy(pick(document, ["Estrategia", "EstratÃ©gia", "Estratégia"]) || manifestItem.strategyLabel, modelCode);
  const split = normalizeSplit(pick(document, ["Divisao", "DivisÃ£o", "Divisão"]) || manifestItem.block, modelCode);
  const frequency = parseFrequency(pick(document, ["Frequencia", "FrequÃªncia", "Frequência", "Frequencia semanal", "FrequÃªncia semanal", "Frequência semanal"]), split);
  const duration = parseDuration(pick(document, ["Duracao media", "DuraÃ§Ã£o mÃ©dia", "Duração média", "Duracao por sessao", "DuraÃ§Ã£o por sessÃ£o", "Duração por sessão"]));
  const equipmentText = pick(document, ["Equipamentos"]);
  const base = {
    modelCode,
    modelVersion: pick(document, ["Versao", "VersÃ£o", "Versão"]) || "1.0.0",
    aplRelease: release.releaseId,
    status: "HOMOLOGATED",
    homologated: true,
    frozen: true,
    checksum: checksum.actual,
    sex: normalizeSex(pick(document, ["Sexo", "Publico", "PÃºblico", "Público"])),
    goal: normalizeGoal(pick(document, ["Objetivo"])),
    experienceLevel: normalizeLevel(pick(document, ["Nivel", "NÃ­vel", "Nível", "Publico", "PÃºblico", "Público"]), modelCode),
    split,
    strategy,
    specializationTarget: strategy === Strategy.SPECIALIZATION ? specializationFrom(metadata.Especializacao, modelCode, document.title) : null,
    frequency,
    minimumSessionDuration: duration?.minimumMinutes,
    maximumSessionDuration: duration?.maximumMinutes,
    recommendedSessionDuration: duration?.recommendedMinutes,
    equipmentProfile: normalizeEquipmentProfile(equipmentText),
    essentialEquipment: equipmentList(equipmentText),
    adaptableEquipment: equipmentList(equipmentText),
    methods: [pick(document, ["Metodo principal", "MÃ©todo principal", "Método principal", "Metodos", "MÃ©todos", "Métodos"])].filter(Boolean),
    tags: document.tags,
    source: {
      releaseManifest: release.manifestRelativePath,
      modelDocument: manifestItem.file,
      checksumValidatedAt: now,
    },
    metadata: {
      original: metadata,
      title: document.title,
      manifest: {
        block: manifestItem.block,
        strategy: manifestItem.strategyLabel,
        status: manifestItem.statusLabel,
      },
    },
  };
  const derived = derive(base, document);
  return {
    ...base,
    complexity: derived.complexity,
    recoveryDemand: derived.recoveryDemand,
    adherenceDemand: derived.adherenceDemand,
    operationalComplexity: derived.operationalComplexity,
    progressionReadiness: derived.progressionReadiness,
    metadata: { ...base.metadata, derivations: derived.derivations },
  };
}

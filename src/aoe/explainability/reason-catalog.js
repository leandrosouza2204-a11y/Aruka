import { ReasonCodes } from "../domain/enums.js";

const entries = [
  ["GOAL_MISMATCH", "eligibility", "critical", "Objetivo incompatível", "O objetivo do perfil não é compatível com o modelo.", "O objetivo informado não combina com este modelo.", "Escolher modelo compatível com o objetivo.", true, true],
  ["LEVEL_TOO_LOW", "eligibility", "critical", "Nível insuficiente", "O modelo exige nível acima do perfil.", "O nível informado ainda não sustenta este modelo.", "Selecionar modelo de nível adequado.", true, true],
  ["LEVEL_MISMATCH", "scoring", "warning", "Nível diferente", "O nível do modelo não é o encaixe ideal.", "O modelo não é o encaixe mais direto de nível.", "Revisar aderência do nível.", false, false],
  ["FREQUENCY_INSUFFICIENT", "eligibility", "critical", "Frequência insuficiente", "A disponibilidade semanal é menor que o mínimo do modelo.", "A frequência semanal informada não sustenta este modelo.", "Ajustar frequência ou escolher modelo menor.", true, true],
  ["DURATION_INSUFFICIENT", "eligibility", "critical", "Duração insuficiente", "O tempo por sessão é menor que o mínimo do modelo.", "O tempo disponível por sessão não sustenta este modelo.", "Ajustar duração ou escolher modelo eficiente.", true, true],
  ["EQUIPMENT_MISSING", "eligibility", "critical", "Equipamento ausente", "O perfil de equipamento não cobre o essencial do modelo.", "Faltam equipamentos importantes para este modelo.", "Revisar equipamentos ou adaptar com profissional.", true, true],
  ["MODEL_NOT_HOMOLOGATED", "catalog", "critical", "Modelo não homologado", "O modelo não está homologado.", "O modelo não pode ser recomendado automaticamente.", "Usar apenas modelos homologados.", true, true],
  ["MODEL_RELEASE_INACTIVE", "catalog", "critical", "Release inativa", "A release do modelo não está ativa.", "A fonte do modelo não está ativa.", "Usar release ativa.", true, true],
  ["RECOVERY_INSUFFICIENT", "eligibility", "critical", "Recuperação insuficiente", "A recuperação declarada é menor que a demanda do modelo.", "A recuperação informada não sustenta este modelo.", "Escolher modelo com menor demanda.", true, true],
  ["SPECIALIZATION_PREREQUISITE_MISSING", "review", "critical", "Pré-requisito de especialização ausente", "Especialização exige alvo e prontidão explícitos.", "A especialização precisa ser revisada antes de aplicar.", "Confirmar prontidão e alvo da especialização.", true, true],
  ["ADHERENCE_RISK", "risk", "warning", "Risco de aderência", "A aderência declarada aumenta risco operacional.", "Pode haver dificuldade para sustentar o plano.", "Revisar agenda e aderência.", false, true],
  ["CRITICAL_CONSTRAINT", "validation", "critical", "Restrição crítica", "Há restrição crítica no perfil.", "Existe uma restrição que exige julgamento profissional.", "Revisar restrição antes da recomendação.", true, true],
  ["LOW_CONFIDENCE", "confidence", "critical", "Baixa confiança", "A evidência disponível não sustenta recomendação automática.", "A confiança da decisão está baixa.", "Solicitar revisão humana.", true, true],
  ["MISSING_DATA", "validation", "critical", "Dados ausentes", "Campos críticos estão ausentes.", "Faltam dados importantes para decidir.", "Solicitar informação adicional.", true, true],
  ["TIE_UNRESOLVED", "review", "warning", "Empate técnico", "O gap entre candidatos é pequeno.", "Há modelos muito próximos na decisão.", "Revisar escolha e alternativas.", false, true],
  ["AMBIGUOUS_SELECTION", "risk", "warning", "Seleção ambígua", "A decisão possui ambiguidade operacional.", "A escolha não é suficientemente clara.", "Revisar alternativas.", false, true],
  ["CONFLICTING_INPUTS", "validation", "critical", "Entradas conflitantes", "Preferências ou restrições entram em conflito.", "Há conflito entre o que foi informado e o modelo desejado.", "Resolver conflito antes de automatizar.", true, true],
  ["HIGH_DECISION_RISK", "risk", "critical", "Risco alto", "O risco decisório impede recomendação automática.", "A decisão exige revisão humana.", "Aplicar gate de revisão.", true, true],
  ["HUMAN_REVIEW_REQUIRED", "review", "warning", "Revisão humana obrigatória", "A política exige revisão humana.", "A recomendação precisa de revisão profissional.", "Executar checklist de revisão.", false, true],
  ["CATALOG_UNAVAILABLE", "catalog", "critical", "Catálogo indisponível", "O catálogo não está disponível ou válido.", "A fonte de modelos não está disponível.", "Validar catálogo.", true, true],
  ["CATALOG_INVALID", "catalog", "critical", "Catálogo inválido", "O catálogo falhou validação.", "A fonte de modelos está inválida.", "Corrigir integridade do catálogo.", true, true],
  ["CHECKSUM_MISMATCH", "catalog", "critical", "Checksum divergente", "O checksum do arquivo não confere.", "Um modelo congelado foi alterado ou não confere.", "Bloquear release/modelo.", true, true],
  ["SELECTED_MODEL_MISSING", "validation", "critical", "Modelo selecionado ausente", "A saída não possui modelo selecionado quando deveria.", "A decisão está incompleta.", "Invalidar recomendação.", true, true],
  ["INVALID_SCORE", "validation", "critical", "Score inválido", "Score fora da faixa esperada.", "A pontuação está inválida.", "Invalidar recomendação.", true, true],
  ["DECISION_TRACE_INCOMPLETE", "validation", "critical", "Trace incompleto", "O decision trace não cobre etapas obrigatórias.", "A decisão não está auditável.", "Completar trace.", true, true],
  ["VERSION_REGISTRY_INCOMPLETE", "validation", "critical", "Versões incompletas", "Registro de versões incompleto.", "A decisão não informa todas as versões.", "Invalidar recomendação.", true, true],
  ["SELECTION_RANKING_MISMATCH", "validation", "critical", "Seleção fora do ranking", "Selecionado não corresponde ao líder do ranking.", "A seleção contradiz o ranking.", "Invalidar recomendação.", true, true],
  ["TIME_AT_LIMIT", "penalty", "warning", "Tempo no limite", "A duração disponível está próxima do mínimo.", "O tempo disponível está no limite do modelo.", "Revisar duração real da sessão.", false, true],
  ["RECOVERY_AT_LIMIT", "penalty", "warning", "Recuperação no limite", "Recuperação igual à demanda do modelo.", "A recuperação está no limite.", "Monitorar fadiga.", false, true],
  ["EQUIPMENT_ADAPTATION_REQUIRED", "penalty", "warning", "Adaptação de equipamento", "O equipamento exige adaptação.", "O treino precisa de adaptação de equipamento.", "Revisar substituições.", false, true],
  ["PREFERENCE_MISMATCH", "scoring", "info", "Preferência diferente", "O modelo não corresponde a uma preferência.", "Uma preferência não pôde ser atendida.", "Priorizar segurança e elegibilidade.", false, false],
  ["MULTIPLE_WARNINGS", "risk", "warning", "Múltiplos avisos", "A recomendação acumula warnings.", "Há vários pontos de atenção.", "Revisar conjunto dos avisos.", false, true],
  ["SPECIALIZATION_PARTIAL_READINESS", "risk", "warning", "Prontidão parcial", "A prontidão para especialização é parcial.", "A especialização ainda precisa ser confirmada.", "Validar prontidão.", false, true],
  ["EXPLANATION_INCOMPLETE", "validation", "critical", "Explicação incompleta", "A explicação não cobre os campos obrigatórios.", "A decisão não está suficientemente explicada.", "Invalidar recomendação.", true, true],
];

export const REASON_CATALOG = Object.freeze(entries.map(([code, category, severity, title, technicalDescription, userDescription, defaultAction, blocksAutomaticRecommendation, requiresHumanReview]) => Object.freeze({
  code,
  category,
  severity,
  title,
  technicalDescription,
  userDescription,
  defaultAction,
  blocksAutomaticRecommendation,
  requiresHumanReview,
})));

export const REASON_BY_CODE = Object.freeze(Object.fromEntries(REASON_CATALOG.map((reason) => [reason.code, reason])));

export function validateReasonCatalog(catalog = REASON_CATALOG) {
  const codes = new Set();
  const errors = [];
  for (const reason of catalog) {
    if (codes.has(reason.code)) errors.push(`Duplicate reason code: ${reason.code}`);
    codes.add(reason.code);
    for (const key of ["code", "category", "severity", "title", "technicalDescription", "userDescription", "defaultAction"]) {
      if (!reason[key]) errors.push(`${reason.code} missing ${key}`);
    }
    if (typeof reason.blocksAutomaticRecommendation !== "boolean") errors.push(`${reason.code} invalid blocksAutomaticRecommendation`);
    if (typeof reason.requiresHumanReview !== "boolean") errors.push(`${reason.code} invalid requiresHumanReview`);
  }
  for (const code of Object.values(ReasonCodes)) {
    if (!codes.has(code)) errors.push(`Reason enum missing from catalog: ${code}`);
  }
  return { valid: errors.length === 0, errors };
}

export function listReasonCodes() {
  return REASON_CATALOG.map(({ code, category, severity, title, blocksAutomaticRecommendation, requiresHumanReview }) => ({
    code,
    category,
    severity,
    title,
    blocksAutomaticRecommendation,
    requiresHumanReview,
  }));
}

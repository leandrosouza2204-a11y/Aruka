export const STUDENT_EXPERIENCE_V2_ENV_KEY = "VITE_STUDENT_EXPERIENCE_V2_ENABLED";

export function isStudentExperienceV2Enabled(value) {
  const configuredValue = value === undefined
    ? import.meta.env?.[STUDENT_EXPERIENCE_V2_ENV_KEY]
    : value;
  return String(configuredValue || "").trim().toLowerCase() === "true";
}

import { StudentExperienceV2Context } from "./studentExperienceV2Context.js";

export function StudentExperienceV2Provider({ children, value }) {
  return <StudentExperienceV2Context.Provider value={value}>{children}</StudentExperienceV2Context.Provider>;
}

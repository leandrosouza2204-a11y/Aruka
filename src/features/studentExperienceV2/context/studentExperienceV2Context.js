import { createContext, useContext } from "react";

export const StudentExperienceV2Context = createContext(null);

export function useStudentExperienceV2() {
  const context = useContext(StudentExperienceV2Context);
  if (!context) throw new Error("StudentExperienceV2Provider ausente.");
  return context;
}

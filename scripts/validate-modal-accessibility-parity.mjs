import { readFile } from "node:fs/promises";

const files = {
  "AccessibleModal": "src/components/AccessibleModal.jsx",
  "AlunoModal": "src/features/alunos/components/AlunosList.jsx",
  "TreinoModal": "src/components/TreinoModal.jsx",
  "TreinoTemplatesModal": "src/features/treinos/components/TreinoTemplatesModal.jsx",
  "WorkoutLifecycleConfirmationModal":
    "src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx",
  "modalAccessibility": "src/utils/modalAccessibility.js",
};

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([name, file]) => [name, await readFile(file, "utf8")])
  )
);

const checks = [
  ["shared focus trap helper exists", /export function trapModalFocus/.test(source.modalAccessibility)],
  ["AccessibleModal uses shared focus trap", /trapModalFocus\(event, dialogRef\.current\)/.test(source.AccessibleModal)],
  ["AlunoModal role dialog", /data-testid="aluno-form-modal"[\s\S]*role="dialog"/.test(source.AlunoModal)],
  ["AlunoModal aria-modal true", /aria-modal="true"/.test(source.AlunoModal)],
  ["AlunoModal accessible label", /aria-labelledby=\{tituloId\}/.test(source.AlunoModal)],
  ["AlunoModal Escape closes", /event\.key === "Escape"[\s\S]*fecharModal\(\)/.test(source.AlunoModal)],
  ["AlunoModal focus trap", /trapModalFocus\(event, dialogRef\.current\)/.test(source.AlunoModal)],
  ["AlunoModal focus return", /previouslyFocusedRef\.current\?\.focus\?\.\(\)/.test(source.AlunoModal)],
  ["TreinoModal role dialog", /role="dialog"/.test(source.TreinoModal)],
  ["TreinoModal focus trap", /trapModalFocus\(event, modalRef\.current\)/.test(source.TreinoModal)],
  ["TreinoModal focus return", /previouslyFocusedRef\.current\?\.focus\?\.\(\)/.test(source.TreinoModal)],
  ["TreinoTemplatesModal role dialog", /role="dialog"/.test(source.TreinoTemplatesModal)],
  ["TreinoTemplatesModal focus trap", /trapModalFocus\(event, modalRef\.current\)/.test(source.TreinoTemplatesModal)],
  ["TreinoTemplatesModal focus return", /previouslyFocusedRef\.current\?\.focus\?\.\(\)/.test(source.TreinoTemplatesModal)],
  ["Workout confirmation alertdialog", /role="alertdialog"/.test(source.WorkoutLifecycleConfirmationModal)],
  [
    "Workout confirmation focus trap",
    /trapModalFocus\(event, dialogRef\.current\)/.test(source.WorkoutLifecycleConfirmationModal),
  ],
  [
    "Workout confirmation focus return",
    /previouslyFocusedRef\.current\?\.focus\?\.\(\)/.test(source.WorkoutLifecycleConfirmationModal),
  ],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);

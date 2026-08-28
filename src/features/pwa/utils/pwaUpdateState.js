export function shouldShowUpdatePrompt({
  hasWaitingWorker,
  activeWorkout = false,
  updateDismissed = false,
} = {}) {
  if (!hasWaitingWorker) return false;
  if (activeWorkout) return false;
  if (updateDismissed) return false;
  return true;
}

export function getUpdatePromptCopy() {
  return {
    title: "Nova versão disponível",
    description: "Atualize quando for conveniente para usar a versão mais recente do Aruka.",
    actionLabel: "Atualizar",
    laterLabel: "Depois",
  };
}

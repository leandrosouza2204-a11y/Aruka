export function classeStatusAluno(status, { incluirBase = true } = {}) {
  const classes = [classeStatusAlunoTom(status)];

  if (incluirBase) {
    classes.unshift("status-badge");
  }

  return classes.join(" ");
}

export function classeStatusAlunoTom(status) {
  if (["Ativo"].includes(status)) return "status-badge-success";
  if (["Vencendo", "Vencendo parcela"].includes(status)) {
    return "status-badge-warning";
  }
  if (["Vencido", "Parcela vencida", "Atrasado", "Parcela atrasada"].includes(status)) {
    return "status-badge-danger";
  }

  return "status-badge-muted";
}

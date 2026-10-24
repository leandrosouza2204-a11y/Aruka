export const AGENDA_CONFLICT_MESSAGE = "Já existe um compromisso nesse horário. Escolha outro intervalo.";

export function describeAgendaSaveFailure(error) {
  if (error?.code === "AGENDA_CONFLICT") {
    return { field: "schedule", message: AGENDA_CONFLICT_MESSAGE };
  }
  return { field: "form", message: "Não foi possível salvar o compromisso. Tente novamente." };
}

export function describeAgendaCancellationFailure(error) {
  if (error?.code === "AGENDA_COMMITMENT_NOT_FOUND") {
    return "Este compromisso não está mais disponível. Atualize a agenda e tente novamente.";
  }
  return "Não foi possível cancelar o compromisso. Tente novamente.";
}

export function applyAgendaCancellation(events, event, scope) {
  return events.map((item) => {
    const selectedOccurrence = item.id === event.id;
    const selectedSeries = scope === "serie" && event.serieId && item.serieId === event.serieId;
    return selectedOccurrence || selectedSeries ? { ...item, status: "cancelado" } : item;
  });
}

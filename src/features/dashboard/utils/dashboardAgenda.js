const STATUS_ENCERRADOS = new Set(["cancelado", "concluido", "falta"]);

export function selecionarAgendaDeHoje(compromissos = [], now = new Date(), limit = 3) {
  const agora = now instanceof Date ? now.getTime() : new Date(now).getTime();
  return [...compromissos]
    .filter((item) => !STATUS_ENCERRADOS.has(item.status) && new Date(item.fim).getTime() >= agora)
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
    .slice(0, limit);
}

export function statusAgendaNoMomento(compromisso, now = new Date()) {
  const agora = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (compromisso.status !== "agendado") return compromisso.status;
  if (new Date(compromisso.inicio).getTime() <= agora && new Date(compromisso.fim).getTime() >= agora) {
    return "em_andamento";
  }
  return "agendado";
}

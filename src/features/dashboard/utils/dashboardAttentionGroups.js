const GROUP_DEFINITIONS = {
  NO_ACTIVE_WORKOUT: {
    id: "treinos",
    title: "Treinos pendentes",
    description: "Alunos que precisam de um treino ativo.",
  },
  FINANCE_ATTENTION: {
    id: "financeiro",
    title: "Financeiro",
    description: "Cobranças e vencimentos que precisam de revisão.",
  },
  STUDENT_ACCESS_ATTENTION: {
    id: "acessos",
    title: "Acesso dos alunos",
    description: "Cadastros com acesso que precisa de conferência.",
  },
};

const PRIORITY_RANK = {
  ACTION_REQUIRED: 0,
  REVIEW: 1,
  FOLLOW_UP: 2,
};

export function groupCoachAttentionQueue(queue = []) {
  const groups = new Map();

  queue.forEach((item) => {
    const signalCode = item.signals?.[0]?.code;
    const definition = GROUP_DEFINITIONS[signalCode] || {
      id: `outros-${signalCode || "geral"}`.toLowerCase(),
      title: item.title || "Outras pendências",
      description: "Itens operacionais que precisam de acompanhamento.",
    };
    const current = groups.get(definition.id) || { ...definition, items: [] };
    current.items.push(item);
    groups.set(definition.id, current);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      priority: group.items.reduce((highest, item) =>
        (PRIORITY_RANK[item.priority] ?? 9) < (PRIORITY_RANK[highest] ?? 9)
          ? item.priority
          : highest, "FOLLOW_UP"),
    }))
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9));
}

export function getVisibleAttentionItems(group, expandedAll = false, limit = 3) {
  if (expandedAll) return group.items;
  return group.items.slice(0, limit);
}

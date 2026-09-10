export const SMART_MANAGEMENT_DASHBOARD_STATE = {
  EMPTY: "empty",
  LOCATIONS_ONLY: "locations_only",
  SERVICES_ONLY: "services_only",
  READY: "ready",
};

export function buildSmartManagementDashboardSummary({ activeLocationsCount = 0, activeServicesCount = 0 } = {}) {
  const locations = toCount(activeLocationsCount);
  const services = toCount(activeServicesCount);

  if (locations > 0 && services > 0) {
    return {
      activeLocationsCount: locations,
      activeServicesCount: services,
      state: SMART_MANAGEMENT_DASHBOARD_STATE.READY,
      message: "Gestão Inteligente pronta para simulações e comparações.",
    };
  }

  if (locations > 0) {
    return {
      activeLocationsCount: locations,
      activeServicesCount: services,
      state: SMART_MANAGEMENT_DASHBOARD_STATE.LOCATIONS_ONLY,
      message: "Você já cadastrou locais. Falta adicionar seus serviços.",
    };
  }

  if (services > 0) {
    return {
      activeLocationsCount: locations,
      activeServicesCount: services,
      state: SMART_MANAGEMENT_DASHBOARD_STATE.SERVICES_ONLY,
      message: "Você já cadastrou serviços. Adicione seus locais para usar os comparativos.",
    };
  }

  return {
    activeLocationsCount: locations,
    activeServicesCount: services,
    state: SMART_MANAGEMENT_DASHBOARD_STATE.EMPTY,
    message: "Configure seus locais e serviços para começar a usar a Gestão Inteligente.",
  };
}

function toCount(value) {
  return Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0);
}

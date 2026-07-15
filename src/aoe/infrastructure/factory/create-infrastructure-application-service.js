import { createAOEApplicationService } from "../../application/index.js";
import { createInfrastructureDependencies } from "./infrastructure-dependencies.js";

export function createInfrastructureAOEApplicationService({ supabaseClient, config, logger, metrics, auditRecorder, clock, idGenerator }) {
  const deps = createInfrastructureDependencies({ supabaseClient, logger, metrics, auditRecorder });
  return createAOEApplicationService({ ...deps, clock, idGenerator, catalogProvider: config?.catalogProvider });
}

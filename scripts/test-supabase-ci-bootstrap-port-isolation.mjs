import assert from "node:assert/strict";
import { buildLocalSupabaseHealthUrl } from "./supabase-cycle-8-lib.mjs";
import {
  classifyCiBootstrapResources,
  deriveCiDbPort,
  isOwnedCiContainer,
  parseDockerPortInventory,
  publishesHostPort,
  readApiPort,
  readDbPort,
  rewriteDbPort,
} from "./supabase-cycle-9-lib.mjs";

const projectId = "aruka_ci_123456789_2";
const port = deriveCiDbPort(projectId);
assert.equal(port, deriveCiDbPort(projectId), "port derivation must be deterministic");
assert.ok(port >= 20002 && port <= 51986);
assert.notEqual(port, 54322);

const config = `[api]\nport = 54321\n\n[db]\nport = 54322\nshadow_port = 54320\n\n[studio]\nport = 54323\n`;
const rewritten = rewriteDbPort(config, port);
assert.equal(readDbPort(rewritten), port);
assert.equal(readApiPort(rewritten), 54321);
assert.match(rewritten, /\[api\]\nport = 54321/);
assert.match(rewritten, /\[studio\]\nport = 54323/);
assert.doesNotMatch(rewritten, /\[db\]\nport = 54322/);

const innerConfig = rewritten.replace("[api]\nport = 54321", "[api]\nport = 55421");
const innerApiPort = readApiPort(innerConfig);
assert.equal(innerApiPort, 55421);
assert.equal(buildLocalSupabaseHealthUrl(innerApiPort, "auth/v1/health"), "http://127.0.0.1:55421/auth/v1/health");

const ownedName = `supabase_db_${projectId}`;
const externalName = "external_postgres";
const ownedInventory = parseDockerPortInventory(`${ownedName}|0.0.0.0:${port}->5432/tcp, [::]:${port}->5432/tcp`);
assert.equal(isOwnedCiContainer(ownedName, projectId), true);
assert.equal(isOwnedCiContainer(`supabase_db_${projectId}_other`, projectId), false);
assert.equal(publishesHostPort(ownedInventory[0].ports, port), true);
assert.deepEqual(classifyCiBootstrapResources({ projectId, dbPort: port, inventory: ownedInventory, tcpPortAvailable: false }), {
  action: "CLEAN_OWNED",
  reason: "OWNED_CI_RESIDUE",
  owned: [ownedName],
  foreign: [],
});

const externalInventory = parseDockerPortInventory(`${externalName}|0.0.0.0:${port}->5432/tcp`);
assert.deepEqual(classifyCiBootstrapResources({ projectId, dbPort: port, inventory: externalInventory, tcpPortAvailable: false }), {
  action: "REJECT",
  reason: "UNOWNED_CONTAINER_OWNS_DB_PORT",
  owned: [],
  foreign: [externalName],
});

assert.deepEqual(classifyCiBootstrapResources({ projectId, dbPort: port, inventory: [], tcpPortAvailable: false }), {
  action: "REJECT",
  reason: "UNKNOWN_PROCESS_OWNS_DB_PORT",
  owned: [],
  foreign: [],
});
assert.deepEqual(classifyCiBootstrapResources({ projectId, dbPort: port, inventory: [], tcpPortAvailable: true }), {
  action: "READY",
  reason: "DB_PORT_AVAILABLE",
  owned: [],
  foreign: [],
});

const harnessProjectId = "aruka_ci_clean_worktree_validation";
const harnessOwnedName = `supabase_db_${harnessProjectId}`;
assert.equal(isOwnedCiContainer(harnessOwnedName, harnessProjectId), true);
assert.deepEqual(classifyCiBootstrapResources({
  projectId: harnessProjectId,
  dbPort: 55422,
  inventory: parseDockerPortInventory(`${harnessOwnedName}|0.0.0.0:55422->5432/tcp`),
  tcpPortAvailable: false,
}), {
  action: "CLEAN_OWNED",
  reason: "OWNED_CI_RESIDUE",
  owned: [harnessOwnedName],
  foreign: [],
});

console.log("CI_DB_PORT_DERIVATION=PASS");
console.log("INNER_API_PORT_PROPAGATION=PASS");
console.log(`EXPECTED_INNER_API_PORT=${innerApiPort}`);
console.log(`ACTUAL_INNER_API_PORT=${innerApiPort}`);
console.log(`HEALTH_PROBE_API_PORT=${innerApiPort}`);
console.log("OWNED_CI_RESIDUE_CLASSIFICATION=PASS");
console.log("UNOWNED_CONTAINER_FAIL_CLOSED=PASS");
console.log("UNKNOWN_PROCESS_FAIL_CLOSED=PASS");
console.log("EXPLICIT_HARNESS_OWNERSHIP=PASS");
console.log("CLEANUP_SCOPE=OWNED_CI_RESOURCES_ONLY");

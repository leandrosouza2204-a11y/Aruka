#!/usr/bin/env node
import fs from "node:fs";

if (!fs.existsSync(".aoe-environment.local.json")) {
  process.stderr.write("Staging nao confirmado. Smoke runtime bloqueado.\n");
  process.exit(1);
}

const confirmation = JSON.parse(fs.readFileSync(".aoe-environment.local.json", "utf8"));
if (confirmation.environment !== "staging" || confirmation.confirmedNonProduction !== true || process.env.AOE_INFRA_TEST_ENV !== "staging") {
  process.stderr.write("Ambiente staging nao confirmado para smoke runtime.\n");
  process.exit(1);
}

process.stderr.write("Smoke runtime requer Edge Function implantada e fixtures autenticadas. Nenhuma chamada remota executada.\n");
process.exit(1);

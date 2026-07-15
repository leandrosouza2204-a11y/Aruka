#!/usr/bin/env node
import fs from "node:fs";

const confirmationPath = ".aoe-environment.local.json";
const manifestPath = ".aoe-staging-fixtures.local.json";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(confirmationPath)) fail("Confirmacao local de staging ausente. Fixtures nao criadas.");
const confirmation = JSON.parse(fs.readFileSync(confirmationPath, "utf8"));
if (confirmation.environment !== "staging" || confirmation.confirmedNonProduction !== true) fail("Ambiente nao confirmado como staging nao produtivo.");
if (!process.env.AOE_INFRA_TEST_ENV || process.env.AOE_INFRA_TEST_ENV !== "staging") fail("AOE_INFRA_TEST_ENV=staging e obrigatorio.");

const manifest = {
  status: "PREPARED_ONLY",
  prefix: "aoe_test_",
  createdAt: new Date().toISOString(),
  ids: [],
  note: "Este script bloqueia criacao remota ate existir credencial server-side segura e fluxo de staging aprovado.",
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write("AOE staging fixtures prepared only; no remote writes executed.\n");

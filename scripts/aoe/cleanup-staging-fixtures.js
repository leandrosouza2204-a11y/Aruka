#!/usr/bin/env node
import fs from "node:fs";

const confirmationPath = ".aoe-environment.local.json";
const manifestPath = ".aoe-staging-fixtures.local.json";
const args = new Set(process.argv.slice(2));

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(confirmationPath)) fail("Confirmacao local de staging ausente. Cleanup bloqueado.");
if (!fs.existsSync(manifestPath)) fail("Manifesto local de fixtures ausente. Cleanup bloqueado.");
const confirmation = JSON.parse(fs.readFileSync(confirmationPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (confirmation.environment !== "staging" || confirmation.confirmedNonProduction !== true) fail("Ambiente nao confirmado como staging nao produtivo.");
if (!Array.isArray(manifest.ids)) fail("Manifesto de fixtures invalido.");

const report = {
  mode: args.has("--confirm") ? "confirm" : "dry-run",
  idsRegistered: manifest.ids.length,
  remoteDeletesExecuted: false,
  reason: "Delete remoto requer implementacao especifica por IDs registrados e credencial server-side segura.",
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

import path from "node:path";
import { AOEManifestParseError } from "./catalog-errors.js";

function strip(value) {
  return String(value ?? "").replace(/`/g, "").trim();
}

function parseTables(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tables = [];
  let current = [];
  for (const line of lines) {
    if (/^\s*\|/.test(line)) current.push(line);
    else if (current.length) {
      tables.push(current);
      current = [];
    }
  }
  if (current.length) tables.push(current);
  return tables;
}

function rowsFromTable(table) {
  const rows = table
    .filter((line) => !/^\s*\|?\s*:?-{3,}/.test(line.replace(/\|/g, "|")))
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(strip));
  const header = rows.shift() ?? [];
  return rows.map((cells) => Object.fromEntries(header.map((key, index) => [strip(key), cells[index] ?? ""])));
}

function findValue(rows, field) {
  const row = rows.find((item) => strip(item.Campo).toLowerCase().includes(field));
  return row?.Valor ? strip(row.Valor) : null;
}

function normalizeInventoryRow(row) {
  const code = strip(row.Codigo ?? row["CÃ³digo"] ?? row["Código"]);
  const file = strip(row.Arquivo);
  if (!code || !file) return null;
  return {
    number: Number(strip(row["NÂº"] ?? row["Nº"] ?? row.No ?? 0)),
    block: strip(row.Bloco),
    modelCode: code,
    file,
    strategyLabel: strip(row.Estrategia ?? row["EstratÃ©gia"] ?? row["Estratégia"]),
    statusLabel: strip(row.Status),
  };
}

export function parseManifest(markdown, { manifestPath, projectRoot }) {
  const tables = parseTables(markdown).map(rowsFromTable);
  const identity = tables.find((rows) => rows.some((row) => strip(row.Campo).toLowerCase().includes("vers"))) ?? [];
  const inventory = (tables.find((rows) => rows.some((row) => row.Arquivo) && rows.some((row) => row.Bloco)) ?? [])
    .map(normalizeInventoryRow)
    .filter(Boolean);
  const checksumRows = tables.find((rows) => rows.some((row) => row["SHA-256"])) ?? [];
  const checksums = new Map(checksumRows.map((row) => [
    strip(row.Codigo ?? row["CÃ³digo"] ?? row["Código"]),
    strip(row["SHA-256"]),
  ]));

  if (!inventory.length) throw new AOEManifestParseError("Manifest inventory table not found.", { manifestPath });

  const models = inventory.map((item) => {
    const manifestDir = path.dirname(manifestPath);
    const absolutePath = item.file.startsWith("docs/")
      ? path.resolve(projectRoot, item.file)
      : path.resolve(manifestDir, item.file);
    const projectRelative = path.relative(projectRoot, absolutePath).replace(/\\/g, "/");
    return {
      ...item,
      manifestFile: item.file,
      file: projectRelative,
      absolutePath,
      checksum: checksums.get(item.modelCode) ?? "",
    };
  });

  return {
    releaseVersion: findValue(identity, "vers") ?? null,
    status: findValue(identity, "status") ?? null,
    frozenAt: findValue(identity, "data") ?? null,
    models,
  };
}

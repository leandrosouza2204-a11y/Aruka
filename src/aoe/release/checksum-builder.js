import crypto from "node:crypto";
import fs from "node:fs";

export function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function sha256File(filePath) {
  return sha256Text(fs.readFileSync(filePath, "utf8"));
}

export function buildChecksums(files) {
  return files.map((file) => ({ file, sha256: sha256File(file) }));
}

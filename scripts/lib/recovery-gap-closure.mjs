import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function sha256Buffer(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  const handle = fs.openSync(filePath, "r");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    let read = 0;
    while ((read = fs.readSync(handle, buffer, 0, buffer.length, null)) > 0) {
      hash.update(buffer.subarray(0, read));
    }
  } finally {
    fs.closeSync(handle);
  }
  return hash.digest("hex");
}

export function objectIdentity(bucketId, objectName) {
  return `${bucketId}\u0000${objectName}`;
}

export function objectRelativePath(bucketId, objectName) {
  const digest = sha256Buffer(Buffer.from(objectIdentity(bucketId, objectName), "utf8"));
  return path.posix.join("objects", digest.slice(0, 2), `${digest}.blob`);
}

export function readJsonLines(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return text
    .split(/\r?\n/u)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`INVALID_JSONL_AT_LINE_${index + 1}`);
      }
    });
}

export function assertOutsideRepository(targetPath, repositoryRoot) {
  const target = path.resolve(targetPath);
  const root = path.resolve(repositoryRoot);
  const relative = path.relative(root, target);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    throw new Error("OUTPUT_MUST_BE_OUTSIDE_GIT");
  }
}

export function metadataSize(row) {
  const value = row?.metadata?.size ?? row?.metadata?.contentLength ?? null;
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw new Error("INVALID_METADATA_SIZE");
  return number;
}

export function validateMetadataRows(rows) {
  const seen = new Set();
  for (const row of rows) {
    if (!row || typeof row.bucket_id !== "string" || !row.bucket_id || typeof row.name !== "string" || !row.name) {
      throw new Error("INVALID_STORAGE_METADATA_ROW");
    }
    const identity = objectIdentity(row.bucket_id, row.name);
    if (seen.has(identity)) throw new Error("DUPLICATE_STORAGE_METADATA_OBJECT");
    seen.add(identity);
    metadataSize(row);
  }
  return seen;
}

export function buildStorageManifest({ metadataRows, journalRows, objectRoot }) {
  const expected = validateMetadataRows(metadataRows);
  const journal = new Map();
  for (const row of journalRows) {
    if (!row || typeof row.bucket_id !== "string" || typeof row.name !== "string") {
      throw new Error("INVALID_STORAGE_DOWNLOAD_JOURNAL_ROW");
    }
    const identity = objectIdentity(row.bucket_id, row.name);
    if (journal.has(identity)) throw new Error("DUPLICATE_STORAGE_DOWNLOAD_OBJECT");
    journal.set(identity, row);
  }

  const entries = [];
  const problems = [];
  for (const metadata of metadataRows) {
    const identity = objectIdentity(metadata.bucket_id, metadata.name);
    const download = journal.get(identity);
    if (!download || download.status !== "PASS") {
      problems.push("MISSING_OR_FAILED_DOWNLOAD");
      continue;
    }
    const expectedRelative = objectRelativePath(metadata.bucket_id, metadata.name);
    if (download.relative_path !== expectedRelative) {
      problems.push("DOWNLOAD_PATH_MISMATCH");
      continue;
    }
    const fullPath = path.resolve(objectRoot, ...expectedRelative.split("/"));
    const relativeCheck = path.relative(path.resolve(objectRoot), fullPath);
    if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
      problems.push("UNSAFE_DOWNLOAD_PATH");
      continue;
    }
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      problems.push("DOWNLOADED_FILE_MISSING");
      continue;
    }
    const size = fs.statSync(fullPath).size;
    const dbSize = metadataSize(metadata);
    const remoteSize = Number(download.remote_content_length);
    const journalLocalSize = Number(download.local_size_bytes);
    if (
      !Number.isSafeInteger(remoteSize) ||
      remoteSize < 0 ||
      !Number.isSafeInteger(journalLocalSize) ||
      journalLocalSize < 0 ||
      size !== remoteSize ||
      size !== journalLocalSize
    ) {
      problems.push("REMOTE_SIZE_MISMATCH");
      continue;
    }
    if (dbSize !== null && size !== dbSize) {
      problems.push("DATABASE_METADATA_SIZE_MISMATCH");
      continue;
    }
    entries.push({
      object_id: metadata.id ?? "",
      bucket_id: metadata.bucket_id,
      object_name: metadata.name,
      relative_path: expectedRelative,
      size_bytes: size,
      sha256: sha256File(fullPath),
      etag: typeof download.etag === "string" ? download.etag : "",
      status: "PASS",
    });
  }

  for (const identity of journal.keys()) {
    if (!expected.has(identity)) problems.push("REMOTE_OBJECT_NOT_IN_DATABASE_INVENTORY");
  }
  const expectedFiles = new Set([...journal.values()].filter((row) => row.status === "PASS").map((row) => row.relative_path));
  const objectsDirectory = path.join(objectRoot, "objects");
  if (fs.existsSync(objectsDirectory)) {
    const pending = [objectsDirectory];
    while (pending.length > 0) {
      const directory = pending.pop();
      for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, item.name);
        if (item.isDirectory()) pending.push(fullPath);
        if (item.isFile()) {
          const relative = path.relative(objectRoot, fullPath).split(path.sep).join("/");
          if (!expectedFiles.has(relative)) problems.push("LOCAL_FILE_NOT_IN_DOWNLOAD_JOURNAL");
        }
      }
    }
  }
  if (problems.length > 0) {
    const counts = Object.fromEntries([...new Set(problems)].sort().map((problem) => [problem, problems.filter((item) => item === problem).length]));
    const error = new Error("STORAGE_RECONCILIATION_FAILED");
    error.problemCounts = counts;
    throw error;
  }
  return entries.sort((a, b) => objectIdentity(a.bucket_id, a.object_name).localeCompare(objectIdentity(b.bucket_id, b.object_name)));
}

export function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows, columns) {
  return [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
}

export function containsSecretMaterial(value) {
  const text = JSON.stringify(value);
  return (
    /postgres(?:ql)?:\/\/[^\s"']+@/iu.test(text) ||
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/u.test(text) ||
    /sb_secret_[A-Za-z0-9_-]+/u.test(text) ||
    /"(?:password|secret|token|connection_string)"\s*:/iu.test(text)
  );
}

export function parseTimestamp(value, code) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(code);
  return timestamp;
}

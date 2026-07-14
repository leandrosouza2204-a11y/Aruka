import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_ENCODING, SUPPORTED_EXTENSIONS } from "../config.mjs";

export async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (err) {
    if (err?.code === "ENOENT") return false;
    throw new Error(`Nao foi possivel acessar ${targetPath}: ${err.message}`);
  }
}

export async function read(filePath, encoding = DEFAULT_ENCODING) {
  try {
    return await fs.readFile(filePath, encoding);
  } catch (err) {
    throw new Error(`Nao foi possivel ler ${filePath}: ${err.message}`);
  }
}

export async function write(filePath, content, encoding = DEFAULT_ENCODING) {
  try {
    await mkdir(path.dirname(filePath));
    await fs.writeFile(filePath, content, encoding);
  } catch (err) {
    throw new Error(`Nao foi possivel escrever ${filePath}: ${err.message}`);
  }
}

export async function mkdir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    throw new Error(`Nao foi possivel criar ${dirPath}: ${err.message}`);
  }
}

export async function walk(rootPath) {
  const found = [];

  async function visit(currentPath) {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch (err) {
      if (err?.code === "ENOENT") return;
      throw new Error(`Nao foi possivel listar ${currentPath}: ${err.message}`);
    }

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile()) {
        found.push(entryPath);
      }
    }
  }

  await visit(rootPath);
  return found.sort();
}

export async function listMarkdown(rootPath) {
  const files = await walk(rootPath);
  return files.filter((file) => SUPPORTED_EXTENSIONS.includes(path.extname(file)));
}

export async function listDirectories(rootPath) {
  try {
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(rootPath, entry.name))
      .sort();
  } catch (err) {
    if (err?.code === "ENOENT") return [];
    throw new Error(`Nao foi possivel listar diretorios em ${rootPath}: ${err.message}`);
  }
}

import path from "node:path";
import { ROOT_DOCS } from "./config.mjs";
import { listDirectories, listMarkdown } from "./utils/files.mjs";

function sprintDirName(sprint) {
  return `SPRINT_${String(sprint).padStart(2, "0")}`;
}

function blockNameFromPath(filePath, sprintPath) {
  const relative = path.relative(sprintPath, filePath);
  const [firstSegment] = relative.split(path.sep);
  return path.extname(firstSegment) ? "_ROOT" : firstSegment;
}

function createBlock(name, files) {
  return {
    name,
    files: files.sort(),
  };
}

export async function scanBlock({ sprint, block, rootDocs = ROOT_DOCS }) {
  const sprintPath = path.resolve(rootDocs, sprintDirName(sprint));
  const blockPath = path.resolve(sprintPath, block);
  const files = await listMarkdown(blockPath);

  return {
    sprint: sprintDirName(sprint),
    path: sprintPath,
    blocks: [createBlock(block, files)],
  };
}

export async function scanSprint({ sprint, rootDocs = ROOT_DOCS }) {
  const sprintPath = path.resolve(rootDocs, sprintDirName(sprint));
  const files = await listMarkdown(sprintPath);
  const grouped = new Map();

  for (const file of files) {
    const blockName = blockNameFromPath(file, sprintPath);
    grouped.set(blockName, [...(grouped.get(blockName) ?? []), file]);
  }

  return {
    sprint: sprintDirName(sprint),
    path: sprintPath,
    blocks: [...grouped.entries()].map(([name, blockFiles]) => createBlock(name, blockFiles)),
  };
}

export async function scanAll({ rootDocs = ROOT_DOCS } = {}) {
  const directories = await listDirectories(rootDocs);
  const sprintNumbers = directories
    .map((dirPath) => /SPRINT_(\d+)/.exec(path.basename(dirPath))?.[1])
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => a - b);

  const sprints = [];
  for (const sprint of sprintNumbers) {
    sprints.push(await scanSprint({ sprint, rootDocs }));
  }

  return { root: rootDocs, sprints };
}

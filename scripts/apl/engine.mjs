import { scanAll, scanBlock, scanSprint } from "./scanner.mjs";
import { parseMarkdown } from "./parser.mjs";

function flattenFiles(scanResult) {
  return scanResult.sprints.flatMap((sprint) =>
    sprint.blocks.flatMap((block) =>
      block.files.map((file) => ({
        sprint: sprint.sprint,
        block: block.name,
        file,
      })),
    ),
  );
}

async function createScanResult(options) {
  if (options.block) {
    const sprint = await scanBlock(options);
    return { root: options.rootDocs, sprints: [sprint] };
  }

  if (options.sprint) {
    const sprint = await scanSprint(options);
    return { root: options.rootDocs, sprints: [sprint] };
  }

  return scanAll(options);
}

export async function runAudit(options = {}) {
  const startedAt = new Date();
  const scanResult = await createScanResult(options);
  const fileRefs = flattenFiles(scanResult);
  const parsedFiles = [];

  for (const fileRef of fileRefs) {
    parsedFiles.push({
      ...fileRef,
      document: await parseMarkdown(fileRef.file),
    });
  }

  const context = {
    version: options.version,
    scope: options.scope ?? "all",
    startedAt,
    scanResult,
    files: parsedFiles,
    rules: [],
  };

  return {
    context,
    result: {
      ok: true,
      rulesLoaded: 0,
      rulesExecuted: 0,
      findings: [],
      fileCount: parsedFiles.length,
      sprintCount: scanResult.sprints.length,
      finishedAt: new Date(),
    },
  };
}

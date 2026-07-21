import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
for (const script of ["qa:local:user", "qa:local:data", "qa:local:environment-check"]) {
  const result = spawnSync(npm, ["run", script], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log("LOCAL_QA_SETUP_READY");

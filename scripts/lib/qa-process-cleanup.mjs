import { spawnSync } from "node:child_process";

export function stopOwnedProcessTree(child) {
  if (!child?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { encoding: "utf8", shell: false, windowsHide: true });
    return;
  }
  try { child.kill("SIGTERM"); } catch { /* process already stopped */ }
}

import { readFileSync } from "node:fs";

const player = readFileSync("src/features/workoutExecution/components/ExerciseVideoPlayer.jsx", "utf8");

const checks = [
  ["toggle exposes expanded state", /aria-expanded=\{open\}/.test(player)],
  ["iframe has title", /<iframe[\s\S]*title=\{`Demonstração de \$\{title\}`\}/.test(player)],
  ["native video controls exist", /<video[\s\S]*controls/i.test(player)],
  ["loading is announced", /aria-live="polite"[\s\S]*exercise-media-loading/i.test(player)],
  ["error is announced", /aria-live="assertive"[\s\S]*exercise-media-error/i.test(player)],
  ["retry is a button", /<button[\s\S]*data-testid="exercise-media-retry"/i.test(player)],
  ["icons are hidden or accompanied by text", /Tentar novamente/i.test(player) && /Ver demonstração/i.test(player)],
];

const failed = checks.filter(([, pass]) => !pass);
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}
if (failed.length) process.exit(1);

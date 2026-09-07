import { readFileSync } from "node:fs";

const player = readFileSync("src/features/workoutExecution/components/ExerciseVideoPlayer.jsx", "utf8");
const page = readFileSync("src/pages/MinhaArea.jsx", "utf8");

const checks = [
  ["player keeps 16:9 frame", /aspectRatio:\s*"16 \/ 9"/.test(player)],
  ["player fills available width", /width:\s*"100%"/.test(player)],
  ["video iframe fills frame", /height:\s*"100%"[\s\S]*width:\s*"100%"/.test(player)],
  ["student page uses responsive padding", /padding:\s*"24px clamp\(16px, 4vw, 40px\) 88px"/.test(page)],
  ["exercise lists use grid gap", /exerciseList:\s*\{ display:\s*"grid", gap:\s*8/i.test(page)],
  ["buttons can wrap", /actionsRow:\s*\{ display:\s*"flex", flexWrap:\s*"wrap"/i.test(page)],
];

const failed = checks.filter(([, pass]) => !pass);
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}
if (failed.length) process.exit(1);

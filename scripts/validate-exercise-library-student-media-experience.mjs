import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260907120000_student_exercise_media_experience_v1.sql", "utf8");
const player = readFileSync("src/features/workoutExecution/components/ExerciseVideoPlayer.jsx", "utf8");
const provider = readFileSync("src/features/workoutExecution/utils/exerciseVideoProvider.js", "utf8");
const daily = readFileSync("src/features/studentDailyExperience/utils/studentDailyExperience.js", "utf8");
const service = readFileSync("src/services/studentDailyExperienceService.js", "utf8");

const checks = [
  ["student workout RPC projects media", /create or replace function public\.get_my_student_workouts\(\)[\s\S]*'media'/i.test(migration)],
  ["delivered gate is active completed only", /t\.lifecycle_status in \('active', 'completed'\)/i.test(migration) && !/lifecycle_status in \('active', 'completed', 'archived'\)/i.test(migration)],
  ["snapshot media is prioritized", /exercise_media_snapshot #>> '\{media,type\}'/i.test(migration)],
  ["YouTube uses nocookie provider", /youtube-nocookie\.com\/embed/i.test(player + provider)],
  ["uploaded video uses native controls", /<video[\s\S]*controls[\s\S]*preload="metadata"/i.test(player)],
  ["signed access is on demand", /getStudentExerciseMediaSignedUrl/i.test(player) && /createSignedUrl/i.test(service)],
  ["no public URL helper", !/getPublicUrl/i.test(player + service + daily)],
  ["student route receives media", /media=\{exercise\.media\}/i.test(readFileSync("src/pages/MinhaArea.jsx", "utf8"))],
  ["no service role in frontend", !/service_role|SERVICE_ROLE/i.test(player + service + daily)],
];

const failed = checks.filter(([, pass]) => !pass);
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}
if (failed.length) process.exit(1);

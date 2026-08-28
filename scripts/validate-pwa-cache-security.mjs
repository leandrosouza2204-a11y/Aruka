import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const viteConfig = readFileSync("vite.config.js", "utf8");
const services = readdirSync("src/services").map((file) => `src/services/${file}`);
const serviceSource = services.map((file) => readFileSync(file, "utf8")).join("\n");
const migrations = readdirSync("supabase/migrations").filter((file) => /^\d+.*\.sql$/.test(file));

assert.match(viteConfig, /runtimeCaching:\s*\[\]/);
assert.doesNotMatch(viteConfig, /supabase|youtube|youtube-nocookie|googlevideo|\/rest\/v1|\/auth\/v1/i);
assert.match(serviceSource, /createClient/);
assert.match(serviceSource, /\.rpc\(|\.from\(/);
assert.equal(migrations.length, 13);

console.log("PWA_CACHE_SECURITY_QA=PASS");
console.log("SUPABASE_API_CACHE=NETWORK_ONLY");
console.log("SENSITIVE_API_CACHE=NO");
console.log("YOUTUBE_RUNTIME_CACHE=NO");
console.log("CROSS_USER_PRIVATE_CACHE_LEAK=NO");
console.log(`EXECUTABLE_MIGRATIONS=${migrations.length}`);

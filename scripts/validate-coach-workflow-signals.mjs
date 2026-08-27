import { readFileSync, existsSync } from "node:fs";

const files = {
  domain: "src/features/alunos/utils/coachWorkflowSignals.js",
  tests: "src/features/alunos/utils/coachWorkflowSignals.test.js",
  list: "src/features/alunos/components/AlunosList.jsx",
  mobile: "src/features/alunos/components/AlunoCardMobile.jsx",
  progression: "src/features/alunos/components/StudentProgressionSnapshot.jsx",
  docs: "docs/product-roadmap-v4/11-cycle-07-coach-workflow-signals.md",
};

for (const [name, file] of Object.entries(files)) {
  if (!existsSync(file)) fail(`MISSING_${name.toUpperCase()}`);
}

const domain = read(files.domain);
const tests = read(files.tests);
const list = read(files.list);
const implementation = [domain, list, read(files.mobile), read(files.progression)].join("\n");
const visibleImplementation = [list, read(files.mobile), read(files.progression)].join("\n");

check(domain.includes("buildCoachWorkflowSignals"), "DOMAIN_BUILDER_PRESENT");
check(domain.includes("MAX_SIGNALS_PER_STUDENT"), "MAX_SIGNALS_PRESENT");
check(domain.includes("orderCoachWorkflowSignals"), "DETERMINISTIC_ORDER_PRESENT");
check(domain.includes("deduplicateSignals"), "DEDUP_PRESENT");
check(list.includes("coach-workflow-signals"), "DETAIL_UI_PRESENT");
check(list.includes("buildStudentListSignals"), "LIST_COMPACT_SIGNALS_PRESENT");
check(tests.includes("no active workout is high priority"), "NO_ACTIVE_WORKOUT_TEST_PRESENT");
check(tests.includes("active lifecycle workout does not get no-workout signal"), "ACTIVE_WORKOUT_CONSISTENCY_TEST_PRESENT");
check(tests.includes("only completed workout keeps real no-workout signal"), "REAL_NO_WORKOUT_TEST_PRESENT");
check(tests.includes("recent abandoned session is not treated as completed"), "ABANDONED_TEST_PRESENT");
check(!/ader[eê]ncia|adherence|percentual|percentage/i.test(implementation), "ADHERENCE_PERCENTAGE_IMPLEMENTED_NO");
check(!/create table\s+.*signals|from\(["']signals["']\)/i.test(implementation), "NEW_SIGNAL_TABLE_NO");
check(!/supabase\.rpc\(["'].*signal/i.test(implementation), "NEW_SIGNAL_RPC_NO");
check(!/recomend/i.test(domain), "AUTOMATIC_RECOMMENDATION_NO");
check(!/\bCue\b|\bcue\b/.test(visibleImplementation), "VISIBLE_CUE_COPY_NO");
check(!/\b(HIGH|MEDIUM|INFO)\b/.test(visibleImplementation), "VISIBLE_PRIORITY_ENUM_NO");
check(!/\b(NO_ACTIVE_WORKOUT|STUDENT_ACCESS_ATTENTION|FINANCE_ATTENTION|RECENT_ABANDONED_SESSION|EXECUTION_INACTIVITY|RECENT_EXECUTION_ACTIVITY)\b/.test(visibleImplementation), "VISIBLE_SIGNAL_ENUM_NO");

console.log("COACH_WORKFLOW_SIGNALS_QA=PASS");

function read(file) {
  return readFileSync(file, "utf8");
}

function check(condition, code) {
  if (!condition) fail(code);
}

function fail(code) {
  console.error(`COACH_WORKFLOW_SIGNALS_QA=FAIL:${code}`);
  process.exit(1);
}

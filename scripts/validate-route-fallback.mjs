import { readFile } from "node:fs/promises";

const app = await readFile("src/App.jsx", "utf8");
const notFound = await readFile("src/pages/NotFound.jsx", "utf8");

const checks = [
  ["App imports lazy NotFound", /const NotFound = lazy\(\(\) => import\("\.\/pages\/NotFound"\)\)/.test(app)],
  ["App declares catch-all route", /<Route path="\*" element=\{<NotFound \/>\} \/>/.test(app)],
  ["NotFound has semantic main", /<main className="not-found-page"/.test(notFound)],
  ["NotFound has heading", /<h1 id="not-found-title">Página não encontrada<\/h1>/.test(notFound)],
  ["NotFound has recovery CTA", /<Link className="app-button app-button-primary" to="\/dashboard">/.test(notFound)],
  ["NotFound has no Supabase dependency", !/supabase/i.test(notFound)],
  ["NotFound has no stack trace copy", !/stack|trace|erro técnico|exception/i.test(notFound)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);

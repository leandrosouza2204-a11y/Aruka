import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const sidebar = fs.readFileSync("src/components/Sidebar.jsx", "utf8");
const mobileNavigation = fs.readFileSync("src/components/MobileBottomNavigation.jsx", "utf8");
const loginRouting = fs.readFileSync("src/auth/loginRouting.js", "utf8");

const checks = [
  [app.match(/path="\/dashboard"[\s\S]*?<ProfessionalRoute>/), "dashboard professional guard"],
  [app.match(/path="\/gestao-inteligente"[\s\S]*?<ProfessionalRoute>/), "smart management professional guard"],
  [sidebar.includes("usuarioProfissional &&") && sidebar.includes('to="/gestao-inteligente"'), "desktop navigation role visibility"],
  [mobileNavigation.includes("usuarioProfissional &&") && mobileNavigation.includes('to="/gestao-inteligente"'), "mobile navigation role visibility"],
  [loginRouting.includes("isProfessionalProfile(await buscarPerfil())"), "professional login context priority"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_ACCESS_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_ACCESS_VALIDATED");

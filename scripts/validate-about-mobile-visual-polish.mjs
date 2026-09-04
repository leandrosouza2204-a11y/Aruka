import { readFileSync } from "node:fs";

const css = readFileSync("src/pages/LandingPage.css", "utf8");
const about = readFileSync("src/pages/Sobre.jsx", "utf8");

const requiredCopy = [
  "Nossa hist",
  "Aruka. Tecnologia para quem transforma vidas.",
  "Jornada, movimento e transforma",
  "Origem da marca",
  "O nome n",
  "Manifesto",
  "Nossa miss",
  "Nossa vis",
  "Evolu",
  "Come",
];

const requiredCss = [
  "@media (max-width: 767px)",
  ".about-hero",
  ".about-origin-mark",
  ".about-prose",
  ".about-manifest-inner",
  ".about-purpose-grid article",
  ".about-value-item",
  ".about-signature",
  ".about-page .landing-footer-inner",
  "text-align: center",
];

const forbiddenCss = [
  "text-align: justify",
  "text-justify:",
];

const missingCopy = requiredCopy.filter((item) => !about.includes(item));
const missingCss = requiredCss.filter((item) => !css.includes(item));
const forbidden = forbiddenCss.filter((item) => css.includes(item));

if (missingCopy.length || missingCss.length || forbidden.length) {
  console.error("ABOUT_MOBILE_VISUAL_POLISH_QA=FAIL");
  if (missingCopy.length) console.error(`MISSING_COPY=${missingCopy.join(",")}`);
  if (missingCss.length) console.error(`MISSING_CSS=${missingCss.join(",")}`);
  if (forbidden.length) console.error(`FORBIDDEN_CSS=${forbidden.join(",")}`);
  process.exit(1);
}

console.log("ABOUT_MOBILE_VISUAL_POLISH_QA=PASS");
console.log("QA_TYPE=STATIC_STRUCTURE_AND_CONTENT_GUARD");
console.log("CONTENT_PRESERVED=YES");
console.log("MOBILE_POLISH_RULES_PRESENT=YES");
console.log("TEXT_JUSTIFY_REMOVED=YES");

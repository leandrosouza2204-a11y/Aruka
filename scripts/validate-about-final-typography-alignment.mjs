import { readFileSync } from "node:fs";

const css = readFileSync("src/pages/LandingPage.css", "utf8");
const about = readFileSync("src/pages/Sobre.jsx", "utf8");

const mobileStart = css.indexOf("@media (max-width: 767px)");
const nextMobileOverride = css.indexOf("@media (max-width: 359px)", mobileStart);

const requiredStructure = [
  "about-manifest-section",
  "about-manifest-inner",
  "about-manifest-emphasis",
  "about-manifest-line",
  "about-purpose-grid",
  "about-purpose-number",
  "about-values-list",
  "about-value-item",
  "Toda evolu",
  "Mais do que um software",
  "Porque evoluir",
  "Significa percorrer",
  "Nossa miss",
  "Nossa vis",
  "Nossos valores",
];

const requiredMobileIntent = [
  ".about-manifest-inner",
  ".about-manifest-emphasis",
  ".about-manifest-line",
  ".about-purpose-grid article",
  "font-size: inherit",
  "justify-items: center",
  "text-align: center",
];

const valuesStructure = [
  ".about-value-item",
  "grid-template-columns: 48px 1fr",
  ".about-values-list",
];

const forbiddenGlobalChanges = [
  ".about-values-list {\n    justify-items: center",
  ".about-value-item {\n    text-align: center",
  ".about-value-item {\n    justify-items: center",
];

const mobileCss =
  mobileStart >= 0 && nextMobileOverride > mobileStart
    ? css.slice(mobileStart, nextMobileOverride)
    : "";
const missingStructure = requiredStructure.filter((item) => !about.includes(item) && !css.includes(item));
const missingMobileIntent = requiredMobileIntent.filter((item) => !mobileCss.includes(item));
const missingValuesStructure = valuesStructure.filter((item) => !css.includes(item));
const forbidden = forbiddenGlobalChanges.filter((item) => css.includes(item));

const emphasisRule = mobileCss.match(/\.about-manifest-emphasis \{[\s\S]*?\n  \}/)?.[0] ?? "";
const lineRule = mobileCss.match(/\.about-manifest-line \{[\s\S]*?\n  \}/)?.[0] ?? "";
const purposeRule = mobileCss.match(/\.about-purpose-grid article \{[\s\S]*?\n  \}/)?.[0] ?? "";

const hierarchyFamilyAligned =
  emphasisRule.includes("font-size: inherit") &&
  lineRule.includes("font-size: inherit") &&
  emphasisRule.includes("line-height:") &&
  lineRule.includes("line-height:");

const missionVisionCentered =
  purposeRule.includes("justify-items: center") &&
  purposeRule.includes("text-align: center");

const conclusionUsesBodyScale =
  emphasisRule.includes("font-size: inherit") &&
  lineRule.includes("font-size: inherit");

const conclusionUsesWeightForEmphasis =
  getFontWeight(emphasisRule) <= 600 &&
  getFontWeight(lineRule) <= 600 &&
  getFontWeight(emphasisRule) > 400 &&
  getFontWeight(lineRule) > 400;

const conclusionAvoidsHeadlineScale =
  !emphasisRule.includes("font-size: clamp(") &&
  !lineRule.includes("font-size: clamp(");

const conclusionAvoidsHeadlineWeight =
  !emphasisRule.includes("font-weight: 700") &&
  !lineRule.includes("font-weight: 700");

if (
  missingStructure.length ||
  missingMobileIntent.length ||
  missingValuesStructure.length ||
  forbidden.length ||
  !hierarchyFamilyAligned ||
  !missionVisionCentered ||
  !conclusionUsesBodyScale ||
  !conclusionUsesWeightForEmphasis ||
  !conclusionAvoidsHeadlineScale ||
  !conclusionAvoidsHeadlineWeight
) {
  console.error("ABOUT_FINAL_TYPOGRAPHY_ALIGNMENT_QA=FAIL");
  if (missingStructure.length) console.error(`MISSING_STRUCTURE=${missingStructure.join(",")}`);
  if (missingMobileIntent.length) console.error(`MISSING_MOBILE_INTENT=${missingMobileIntent.join(",")}`);
  if (missingValuesStructure.length) console.error(`MISSING_VALUES_STRUCTURE=${missingValuesStructure.join(",")}`);
  if (forbidden.length) console.error(`FORBIDDEN_VALUES_ALIGNMENT=${forbidden.join(",")}`);
  if (!hierarchyFamilyAligned) console.error("MANIFEST_CONCLUSION_FAMILY_ALIGNED=NO");
  if (!missionVisionCentered) console.error("MISSION_VISION_CENTERED=NO");
  if (!conclusionUsesBodyScale) console.error("MANIFEST_CONCLUSION_BODY_SCALE=NO");
  if (!conclusionUsesWeightForEmphasis) console.error("MANIFEST_CONCLUSION_WEIGHT_EMPHASIS=NO");
  if (!conclusionAvoidsHeadlineScale) console.error("MANIFEST_CONCLUSION_AVOIDS_HEADLINE_SCALE=NO");
  if (!conclusionAvoidsHeadlineWeight) console.error("MANIFEST_CONCLUSION_AVOIDS_HEADLINE_WEIGHT=NO");
  process.exit(1);
}

console.log("ABOUT_FINAL_TYPOGRAPHY_ALIGNMENT_QA=PASS");
console.log("QA_TYPE=STATIC_INTENT_AND_SCOPE_GUARD");
console.log("MANIFEST_CONCLUSION_FAMILY_ALIGNED=YES");
console.log("MANIFEST_CONCLUSION_BODY_SCALE=YES");
console.log("MANIFEST_CONCLUSION_WEIGHT_EMPHASIS=YES");
console.log("MANIFEST_CONCLUSION_AVOIDS_HEADLINE_SCALE=YES");
console.log("MANIFEST_CONCLUSION_AVOIDS_HEADLINE_WEIGHT=YES");
console.log("MISSION_VISION_CENTERED=YES");
console.log("VALUES_STRUCTURE_PRESERVED=YES");

function getFontWeight(rule) {
  const match = rule.match(/font-weight:\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

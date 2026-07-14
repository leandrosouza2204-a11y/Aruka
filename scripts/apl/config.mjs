import path from "node:path";

export const ROOT_DOCS = path.resolve("docs", "apl");
export const ROOT_REPORTS = path.resolve("reports", "apl");
export const SUPPORTED_SPRINTS = Object.freeze([1, 2]);
export const SUPPORTED_EXTENSIONS = Object.freeze([".md"]);
export const DEFAULT_ENCODING = "utf8";
export const REPORT_FORMAT = "markdown";
export const VERSION = "1.0.0";

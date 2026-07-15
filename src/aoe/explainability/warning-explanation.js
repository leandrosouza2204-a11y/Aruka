import { resolveReasons } from "./reason-resolver.js";

export function explainWarnings(warnings = []) {
  return resolveReasons(warnings).map((reason) => ({
    code: reason.code,
    title: reason.title,
    description: reason.userDescription,
    action: reason.defaultAction,
  }));
}

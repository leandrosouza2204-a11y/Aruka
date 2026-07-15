export function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

export function omitUndefined(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}

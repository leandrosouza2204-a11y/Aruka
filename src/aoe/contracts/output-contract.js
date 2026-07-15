export function toSerializableResult(result) {
  return JSON.parse(JSON.stringify(result));
}

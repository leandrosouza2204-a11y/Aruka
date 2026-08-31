import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("./AlunosList.jsx", import.meta.url),
  "utf8"
);

test("student edit modal does not rerun mount focus effect on form changes", () => {
  assert.match(source, /const fecharModalRef = useRef\(page\.fecharModal\);/);
  assert.match(source, /fecharModalRef\.current = page\.fecharModal;/);
  assert.match(source, /fecharModalRef\.current\?\.\(\);/);
  assert.doesNotMatch(source, /\}, \[fecharModal\]\);/);
});

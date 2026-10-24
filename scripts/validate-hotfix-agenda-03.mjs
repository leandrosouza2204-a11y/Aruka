import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const dialog = read("src/components/ConfirmDialog.jsx");
const hook = read("src/hooks/useConfirm.js");
const css = read("src/index.css");

assert.match(dialog, /className="confirm-dialog-overlay"/, "confirmation overlay must have a scoped class");
assert.match(dialog, /contentClassName="confirm-dialog-modal"/, "confirmation content must have a scoped class");
assert.match(dialog, /initialFocusRef=\{cancelarRef\}/, "cancel remains the safe initial focus");
assert.match(dialog, /onClose=\{\(\) => fechar\(false\)\}/, "close must still resolve false");
assert.match(dialog, /onClick=\{\(\) => fechar\(false\)\}/, "cancel must still resolve false");
assert.match(dialog, /onClick=\{\(\) => fechar\(true\)\}/, "confirm must still resolve true");
assert.match(hook, /return context;/, "useConfirm contract must remain unchanged");

assert.match(css, /\.accessible-modal-overlay\.confirm-dialog-overlay\s*\{[^}]*align-items:\s*center;/s, "confirmation overlay must override mobile stretching");
assert.match(css, /\.accessible-modal\.confirm-dialog-modal\s*\{[^}]*height:\s*auto;/s, "confirmation height must follow content");
assert.match(css, /\.accessible-modal\.confirm-dialog-modal\s*\{[^}]*max-height:\s*calc\(100dvh/s, "confirmation must respect dynamic viewport height");
assert.match(css, /confirm-dialog-overlay[^}]*safe-area-inset-top/s, "confirmation must respect top safe area");
assert.match(css, /confirm-dialog-overlay[^}]*safe-area-inset-bottom/s, "confirmation must respect bottom safe area");
assert.match(css, /\.confirm-dialog-modal \.accessible-modal-body:empty\s*\{[^}]*display:\s*none;/s, "empty confirmation body must not reserve space");

console.log("HOTFIX_AGENDA_03_STATIC=PASS");

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

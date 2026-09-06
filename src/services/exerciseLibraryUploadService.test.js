import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const service = readFileSync(new URL("./exerciseLibraryService.js", import.meta.url), "utf8");

test("service executa upload antes da mutation e limpa orfao em falha", () => {
  assert.match(service, /\.upload\(path,\s*formulario\.uploadFile/);
  assert.match(service, /\.insert\(resultado\.payload\)/);
  assert.match(service, /if \(error\) \{\s*await limparUploadOrfao\(formularioComMidia\.uploadedVideoPath\);/s);
});

test("service remove midia antiga somente apos update bem-sucedido", () => {
  assert.match(service, /\.update\(payload\)/);
  assert.match(service, /if \(error\) \{\s*await limparUploadOrfao\(formularioComMidia\.uploadedVideoPath, oldMediaPath\);/s);
  assert.match(service, /await limparMidiaAntiga\(oldMediaPath, data\?\.media_path\);/);
});

test("service cria signed URL temporaria sem public URL", () => {
  assert.match(service, /createSignedUrl\(path, EXERCISE_VIDEO_SIGNED_URL_TTL_SECONDS\)/);
  assert.doesNotMatch(service, /getPublicUrl|signedUrl\s*:/);
});

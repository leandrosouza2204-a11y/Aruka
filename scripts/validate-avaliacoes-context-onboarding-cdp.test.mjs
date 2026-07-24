import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DECISIONS,
  buildAuditRaw,
  classifyDecision,
  createFailureRecorder,
  createResolutionAttempt,
  isPngSignature,
  recordScenario,
  validateScreenshotMetadata,
} from "./avaliacoes-context-onboarding-runner-utils.mjs";

describe("avaliacoes context onboarding runner utils", () => {
  it("fallback esperado nao vira falha de produto", () => {
    const recorder = createFailureRecorder();
    const attempts = [
      createResolutionAttempt({
        url: "http://127.0.0.1:5173",
        result: "fetch-error",
        message: "connect ECONNREFUSED",
        selected: false,
      }),
      createResolutionAttempt({
        url: "http://localhost:5173",
        result: "ok",
        status: 200,
        selected: true,
      }),
    ];

    const decision = classifyDecision({
      scenarios: [{ name: "abrir /avaliacoes", status: "PASS" }],
      limitations: ["Autenticacao coberta pela regressao original."],
      ...recorder,
    });

    assert.equal(attempts.length, 2);
    assert.equal(recorder.networkFailures.length, 0);
    assert.equal(decision.decision, DECISIONS.READY_WITH_LIMITATIONS);
    assert.equal(decision.exitCode, 0);
  });

  it("falha real de rede vira FAIL_PRODUCT", () => {
    const recorder = createFailureRecorder();
    recorder.addNetworkFailure({
      stage: "Network.loadingFailed",
      url: "https://api.example.test/rest/v1/avaliacoes",
      method: "GET",
      errorText: "net::ERR_FAILED",
    });

    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(recorder.networkFailures.length, 1);
    assert.equal(decision.decision, DECISIONS.FAIL_PRODUCT);
    assert.equal(decision.exitCode, 1);
  });

  it("objeto vazio nao entra em colecao de falhas", () => {
    const recorder = createFailureRecorder();
    const inserted = recorder.addNetworkFailure({});

    assert.equal(inserted, null);
    assert.equal(recorder.networkFailures.length, 0);
  });

  it("falha de screenshot nao entra em networkFailures", () => {
    const recorder = createFailureRecorder();
    recorder.addScreenshotFailure({
      stage: "captureViewport",
      filename: "desktop-contexto-aluno.png",
      message: "Assinatura PNG invalida.",
    });

    assert.equal(recorder.screenshotFailures.length, 1);
    assert.equal(recorder.networkFailures.length, 0);
  });

  it("excecao do runner vira FAIL_TEST_INFRASTRUCTURE", () => {
    const recorder = createFailureRecorder();
    recorder.addRunnerFailure({
      stage: "writeEvidence",
      message: "disk full",
    });

    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
    assert.equal(decision.exitCode, 1);
  });

  it("READY_WITH_LIMITATIONS retorna exit code 0", () => {
    const decision = classifyDecision({
      scenarios: [{ name: "funcional", status: "PASS" }],
      limitations: ["Autenticacao coberta pela regressao original."],
    });

    assert.equal(decision.decision, DECISIONS.READY_WITH_LIMITATIONS);
    assert.equal(decision.exitCode, 0);
  });

  it("cenario FAIL_PRODUCT retorna exit code 1", () => {
    const scenarios = [];
    recordScenario(scenarios, "falha funcional", false, DECISIONS.FAIL_PRODUCT, "produto falhou");
    const decision = classifyDecision({ scenarios });

    assert.equal(decision.decision, DECISIONS.FAIL_PRODUCT);
    assert.equal(decision.exitCode, 1);
  });

  it("infraestrutura impeditiva retorna exit code 1", () => {
    const recorder = createFailureRecorder();
    recorder.addInfrastructureFailure({
      stage: "resolveBaseUrl",
      message: "Aplicacao indisponivel",
    });

    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
    assert.equal(decision.exitCode, 1);
  });

  it("audit raw serializa como JSON valido sem objetos vazios", () => {
    const raw = buildAuditRaw({
      scenarios: [{ name: "ok", status: "PASS" }],
      networkFailures: [],
      httpFailures: [],
      infrastructureFailures: [],
      screenshotFailures: [],
      runnerFailures: [],
    });

    const parsed = JSON.parse(JSON.stringify(raw));
    assert.equal(parsed.scenarios[0].status, "PASS");
    assert.equal(parsed.networkFailures.length, 0);
  });

  it("valida assinatura PNG", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const text = Buffer.from("screenshot-unavailable");

    assert.equal(isPngSignature(png), true);
    assert.equal(isPngSignature(text), false);
    assert.equal(
      validateScreenshotMetadata({
        name: "x.png",
        path: "x.png",
        size: text.length,
        signatureValid: isPngSignature(text),
      }).ok,
      false
    );
  });
});

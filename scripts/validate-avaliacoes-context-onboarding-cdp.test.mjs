import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DECISIONS,
  buildAuditRaw,
  captureScreenshotWithRetry,
  classifyDecision,
  countRecoveredScreenshotRetries,
  createScreenshotEvidenceAttempt,
  createFailureRecorder,
  createResolutionAttempt,
  evaluateScreenshotReadiness,
  getEvidenceCounts,
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

  it("primeira captura passa com uma tentativa e nenhuma falha terminal", async () => {
    const result = await captureScreenshotWithRetry({
      filename: "desktop-contexto-aluno.png",
      capture: async () => ({ path: "ok.png" }),
      validate: async () => ({ ok: true, screenshot: { name: "desktop-contexto-aluno.png" } }),
      sleep: async () => {},
      now: fixedClock(),
    });

    assert.equal(result.ok, true);
    assert.equal(result.attempts.length, 1);
    assert.equal(result.attempts[0].status, "PASS");
    assert.equal(result.recovered, false);
  });

  it("timeout na primeira captura e sucesso na segunda nao vira falha terminal", async () => {
    let calls = 0;
    const result = await captureScreenshotWithRetry({
      filename: "mobile-320-contexto.png",
      capture: async () => {
        calls += 1;
        return calls === 1 ? { timedOut: true } : { path: "ok.png" };
      },
      validate: async ({ result: captureResult }) =>
        captureResult.timedOut
          ? { ok: false, reason: "Timeout ao gerar screenshot." }
          : { ok: true, screenshot: { name: "mobile-320-contexto.png" } },
      sleep: async () => {},
      now: fixedClock(),
    });
    const decision = classifyDecision({
      scenarios: [{ name: "screenshots obrigatorias validas", status: "PASS" }],
      limitations: ["Autenticacao coberta pela regressao original."],
      screenshotFailures: [],
      screenshotAttempts: result.attempts,
    });

    assert.equal(result.ok, true);
    assert.equal(result.attempts.length, 2);
    assert.equal(result.attempts[0].status, "RETRY");
    assert.equal(result.attempts[1].status, "PASS");
    assert.equal(result.attempts[1].recovered, true);
    assert.equal(decision.decision, DECISIONS.READY_WITH_LIMITATIONS);
    assert.equal(decision.exitCode, 0);
  });

  it("duas capturas falham e geram uma screenshotFailure terminal", async () => {
    const recorder = createFailureRecorder();
    const result = await captureScreenshotWithRetry({
      filename: "mobile-320-contexto.png",
      capture: async () => ({ timedOut: true }),
      validate: async () => ({ ok: false, reason: "Timeout ao gerar screenshot." }),
      sleep: async () => {},
      now: fixedClock(),
    });
    recorder.addScreenshotFailure(result.failure);
    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(result.ok, false);
    assert.equal(result.attempts.length, 2);
    assert.equal(result.attempts[1].status, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
    assert.equal(recorder.screenshotFailures.length, 1);
    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
    assert.equal(decision.exitCode, 1);
  });

  it("PNG invalido na primeira tentativa e sucesso na segunda remove invalido e recupera", async () => {
    let calls = 0;
    let removed = 0;
    const result = await captureScreenshotWithRetry({
      filename: "desktop-vazio-contextual.png",
      capture: async () => {
        calls += 1;
        return { path: "capture.png" };
      },
      validate: async () =>
        calls === 1
          ? { ok: false, reason: "Assinatura PNG invalida." }
          : { ok: true, screenshot: { name: "desktop-vazio-contextual.png" } },
      removeInvalidFile: async () => {
        removed += 1;
      },
      sleep: async () => {},
      now: fixedClock(),
    });

    assert.equal(result.ok, true);
    assert.equal(result.recovered, true);
    assert.equal(removed, 1);
  });

  it("screenshot obrigatoria ausente gera falha terminal nominal", () => {
    const recorder = createFailureRecorder();
    recorder.addScreenshotFailure({
      stage: "validateRequiredScreenshots",
      filename: "mobile-320-contexto.png",
      message: "Screenshot obrigatoria ausente: mobile-320-contexto.png",
    });
    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(recorder.screenshotFailures[0].filename, "mobile-320-contexto.png");
    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
  });

  it("screenshotFailure nao duplica em infrastructureFailures", () => {
    const recorder = createFailureRecorder();
    recorder.addScreenshotFailure({
      stage: "capture",
      filename: "mobile-320-contexto.png",
      message: "Timeout ao gerar screenshot.",
    });
    const counts = getEvidenceCounts({ ...recorder });

    assert.equal(recorder.screenshotFailures.length, 1);
    assert.equal(recorder.infrastructureFailures.length, 0);
    assert.equal(counts.testInfrastructureFailuresTotal, 1);
  });

  it("executive summary pode usar contagens separadas e corretas", () => {
    const counts = getEvidenceCounts({
      scenarios: [
        { name: "ok", status: "PASS" },
        { name: "screenshots obrigatorias validas", status: DECISIONS.FAIL_TEST_INFRASTRUCTURE },
      ],
      screenshotFailures: [{ filename: "mobile-320-contexto.png" }],
      infrastructureFailures: [],
      runnerFailures: [],
      networkFailures: [],
      httpFailures: [],
      screenshotAttempts: [],
      limitations: ["auth"],
    });

    assert.equal(counts.scenariosPass, 1);
    assert.equal(counts.scenariosFailTestInfrastructure, 1);
    assert.equal(counts.screenshotFailures, 1);
    assert.equal(counts.infrastructureFailures, 0);
  });

  it("audit raw mantem screenshotAttempts sem dupla contagem", () => {
    const raw = buildAuditRaw({
      screenshotAttempts: [{ filename: "x.png", status: "RETRY" }],
      screenshotFailures: [{ filename: "x.png" }],
      infrastructureFailures: [],
      runnerFailures: [],
    });

    assert.equal(raw.screenshotAttempts.length, 1);
    assert.equal(raw.screenshotFailures.length, 1);
    assert.equal(raw.infrastructureFailures.length, 0);
    assert.equal(raw.runnerFailures.length, 0);
  });

  it("retry recuperado com limitacao de autenticacao retorna READY_WITH_LIMITATIONS", async () => {
    const result = await captureScreenshotWithRetry({
      filename: "x.png",
      capture: async ({ attempt }) => (attempt === 1 ? { timedOut: true } : { path: "ok.png" }),
      validate: async ({ result: captureResult }) =>
        captureResult.timedOut ? { ok: false, reason: "Timeout" } : { ok: true, screenshot: { name: "x.png" } },
      sleep: async () => {},
      now: fixedClock(),
    });
    const decision = classifyDecision({
      scenarios: [{ name: "ok", status: "PASS" }],
      limitations: ["auth"],
      screenshotAttempts: result.attempts,
    });

    assert.equal(countRecoveredScreenshotRetries(result.attempts), 1);
    assert.equal(decision.decision, DECISIONS.READY_WITH_LIMITATIONS);
    assert.equal(decision.exitCode, 0);
  });

  it("redirecionamento para login detectado gera FAIL_TEST_INFRASTRUCTURE", () => {
    const readiness = evaluateScreenshotReadiness({
      state: { pathname: "/login", hasLogin: true, hasAvaliacoesPage: false, authenticated: false },
      expectedPath: "/avaliacoes",
    });
    const decision = classifyDecision({
      scenarios: [{ name: "login inesperado", status: readiness.classification }],
    });

    assert.equal(readiness.ok, false);
    assert.equal(readiness.failures[0].code, "unexpected-login");
    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
  });

  it("loading persistente gera FAIL_TEST_INFRASTRUCTURE", () => {
    const readiness = evaluateScreenshotReadiness({
      state: { pathname: "/avaliacoes", hasLoading: true, hasAvaliacoesPage: true, authenticated: true },
      expectedPath: "/avaliacoes",
    });

    assert.equal(readiness.ok, false);
    assert.equal(readiness.classification, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
    assert.equal(readiness.failures.some((item) => item.code === "persistent-loading"), true);
  });

  it("rota incorreta gera FAIL_TEST_INFRASTRUCTURE", () => {
    const readiness = evaluateScreenshotReadiness({
      state: { pathname: "/alunos", hasAvaliacoesPage: false, authenticated: true },
      expectedPath: "/avaliacoes",
    });

    assert.equal(readiness.ok, false);
    assert.equal(readiness.failures.some((item) => item.code === "wrong-route"), true);
  });

  it("PNG valido com conteudo em estado invalido nao e aceito", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...Array(600).fill(1)]);
    const metadata = validateScreenshotMetadata({
      name: "login.png",
      path: "login.png",
      size: png.length,
      signatureValid: isPngSignature(png),
    });
    const readiness = evaluateScreenshotReadiness({
      state: { pathname: "/login", hasLogin: true, hasAvaliacoesPage: false, authenticated: false },
      expectedPath: "/avaliacoes",
    });

    assert.equal(metadata.ok, true);
    assert.equal(readiness.ok, false);
  });

  it("estado especifico ausente por falha funcional gera FAIL_PRODUCT quando aplicavel", () => {
    const readiness = evaluateScreenshotReadiness({
      state: { pathname: "/avaliacoes", hasAvaliacoesPage: true, authenticated: true },
      scenarioChecks: [
        {
          ok: false,
          selector: "[data-testid='avaliacao-student']",
          classification: DECISIONS.FAIL_PRODUCT,
          message: "Aluno contextual nao foi pre-selecionado.",
        },
      ],
    });
    const decision = classifyDecision({
      scenarios: [{ name: "pre-selecao produto", status: readiness.classification }],
    });

    assert.equal(readiness.classification, DECISIONS.FAIL_PRODUCT);
    assert.equal(decision.decision, DECISIONS.FAIL_PRODUCT);
  });

  it("autenticacao restaurada e cenario reconstruido registra recuperacao sem screenshotFailure", async () => {
    const recorder = createFailureRecorder();
    const recovery = createScreenshotEvidenceAttempt({
      filename: "desktop-contexto-aluno.png",
      attempt: 1,
      maxAttempts: 2,
      stage: "authentication-recovery",
      status: "PASS",
      message: "Autenticacao restaurada de forma controlada.",
      urlBeforeCapture: "http://127.0.0.1:5173/login",
      urlAfterPreparation: "http://127.0.0.1:5173/avaliacoes?alunoId=abc",
      authenticationState: { authenticated: true, recovered: true },
      recovered: true,
    });
    const result = await captureScreenshotWithRetry({
      filename: "desktop-contexto-aluno.png",
      capture: async () => ({ path: "ok.png", semanticValidated: true }),
      validate: async () => ({
        ok: true,
        screenshot: { name: "desktop-contexto-aluno.png" },
        attemptMetadata: { semanticValidated: true, authenticationRecovered: true },
      }),
      sleep: async () => {},
      now: fixedClock(),
    });

    assert.equal(recovery.recovered, true);
    assert.equal(result.ok, true);
    assert.equal(result.attempts[0].semanticValidated, true);
    assert.equal(recorder.screenshotFailures.length, 0);
  });

  it("login persistente apos tentativas gera FAIL_TEST_INFRASTRUCTURE", async () => {
    const recorder = createFailureRecorder();
    const result = await captureScreenshotWithRetry({
      filename: "desktop-contexto-aluno.png",
      capture: async () => ({ path: "login.png" }),
      validate: async () => ({
        ok: false,
        reason: "Pagina permaneceu em /login ou formulario de login visivel.",
        attemptMetadata: { semanticValidated: false },
      }),
      sleep: async () => {},
      now: fixedClock(),
    });
    recorder.addScreenshotFailure(result.failure);
    const decision = classifyDecision({ scenarios: [], ...recorder });

    assert.equal(result.ok, false);
    assert.equal(decision.decision, DECISIONS.FAIL_TEST_INFRASTRUCTURE);
  });

  it("falha semantica nao e contada duas vezes", () => {
    const recorder = createFailureRecorder();
    recorder.addScreenshotFailure({
      filename: "desktop-contexto-aluno.png",
      stage: "semantic-readiness",
      message: "Pagina permaneceu em /login.",
    });
    const counts = getEvidenceCounts({ ...recorder });

    assert.equal(recorder.infrastructureFailures.length, 0);
    assert.equal(counts.screenshotFailures, 1);
    assert.equal(counts.testInfrastructureFailuresTotal, 1);
  });
});

function fixedClock() {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 6, 24, 12, 0, tick++));
}

const cdpPort = process.env.CDP_PORT || "9222";
const appOrigin = (process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL || "http://127.0.0.1:5173").replace(/\/$/, "");
const appUrl = `${appOrigin}/alunos`;
const viewports = [
  ["360", 360, 800, true],
  ["390", 390, 844, true],
  ["430", 430, 932, true],
  ["1366", 1366, 768, false],
  ["1440", 1440, 900, false],
];

validateQaCredentials();

const ws = await getWebSocketUrl();
const client = createCdpClient(ws);
await client.ready;
await client.send("Page.enable");
await client.send("Runtime.enable");

try {
  const viewportResults = [];
  for (const [name, width, height, mobile] of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
    await openAlunos();
    if (name === "390") await openFirstDetails();
    viewportResults.push(await inspectRuntime(name));
  }

  const main = viewportResults.find((item) => item.viewport === "390") || viewportResults[0];
  const desktop1366 = viewportResults.find((item) => item.viewport === "1366");
  const desktop1440 = viewportResults.find((item) => item.viewport === "1440");
  check(viewportResults.every((item) => item.alunosPageVisible), "ALUNOS_PAGE_VISIBLE");
  check(main.coachSignalsVisible, "COACH_SIGNALS_VISIBLE");
  check(viewportResults.every((item) => item.horizontalOverflow === false), "NO_HORIZONTAL_OVERFLOW");
  check(main.listSignalCountBounded, "LIST_SIGNAL_COUNT_BOUNDED");
  check(main.signalOverloadGuard, "SIGNAL_OVERLOAD_GUARD");
  check(main.technicalPriorityEnumVisible === false, "TECHNICAL_PRIORITY_ENUM_VISIBLE_NO");
  check(main.technicalMetadataExposure === false, "TECHNICAL_METADATA_EXPOSURE_NO");
  check(main.cueVisible === false, "CUE_VISIBLE_NO");
  check(main.adherenceLanguageUsed === false, "ADHERENCE_LANGUAGE_USED_NO");
  check(main.runtimeDeduplication, "RUNTIME_DEDUPLICATION");
  check(main.quickActionsNavigationOnly, "QUICK_ACTIONS_NAVIGATION_ONLY");
  check(main.studentDetailVisible, "STUDENT_DETAIL_VISIBLE");
  check(main.blankScreen === false, "BLANK_SCREEN_NO");
  check(main.studentDetailSignalsVisible, "STUDENT_DETAIL_SIGNALS_VISIBLE");
  check(main.professionalExecutionHistoryVisible, "PROFESSIONAL_EXECUTION_HISTORY_VISIBLE");
  check(main.accessibility, "ACCESSIBILITY");
  check(desktop1366?.desktopInlineTop && desktop1366?.desktopInlineMiddle && desktop1366?.desktopInlineBottom, "DESKTOP_1366_INLINE_DETAIL");
  check(desktop1440?.desktopInlineTop && desktop1440?.desktopInlineMiddle && desktop1440?.desktopInlineBottom, "DESKTOP_1440_INLINE_DETAIL");
  check(main.mobileDetailAssociated, "MOBILE_DETAIL_ASSOCIATED");
  const studentQaDaily = await validateStudentQaDailyWorkoutSignal();
  check(studentQaDaily.hasStudent, "STUDENT_QA_DAILY_STUDENT_PRESENT");
  check(studentQaDaily.hasAvailableWorkout, "STUDENT_QA_DAILY_AVAILABLE_WORKOUT");
  check(studentQaDaily.noActiveWorkoutSignal === false, "STUDENT_QA_DAILY_NO_ACTIVE_WORKOUT_SIGNAL_NO");

  console.log("COACH_WORKFLOW_SIGNALS_RUNTIME_QA=PASS");
  console.log(`ALUNOS_PAGE_VISIBLE=YES`);
  console.log(`COACH_SIGNALS_VISIBLE=YES`);
  console.log(`LIST_SIGNAL_COUNT_BOUNDED=YES`);
  console.log(`MAX_SIGNALS_PER_STUDENT=3`);
  console.log(`SIGNAL_OVERLOAD_GUARD=PASS`);
  console.log(`TECHNICAL_PRIORITY_ENUM_VISIBLE=NO`);
  console.log(`RUNTIME_DEDUPLICATION=PASS`);
  console.log(`CUE_VISIBLE=NO`);
  console.log(`ADHERENCE_LANGUAGE_USED=NO`);
  console.log(`QUICK_ACTIONS_NAVIGATION_ONLY=YES`);
  console.log(`MOBILE_360=${statusFor(viewportResults, "360")}`);
  console.log(`MOBILE_390=${statusFor(viewportResults, "390")}`);
  console.log(`MOBILE_430=${statusFor(viewportResults, "430")}`);
  console.log(`DESKTOP_1366=${statusFor(viewportResults, "1366")}`);
  console.log(`DESKTOP_1440=${statusFor(viewportResults, "1440")}`);
  console.log(`STUDENT_QA_DAILY_HAS_AVAILABLE_WORKOUT=YES`);
  console.log(`PROFESSIONAL_NO_ACTIVE_WORKOUT_SIGNAL_FOR_STUDENT_QA_DAILY=NO`);
} finally {
  client.close();
}

async function openAlunos() {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"], .alunos-page, input[type=\"email\"], input[type=\"password\"]')", 25000);
  const state = await authState();
  if (state.path.includes("/login") || state.hasLoginForm) await login();
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"], .alunos-page')", 25000);
  await waitFor("!document.body.innerText.includes('Carregando alunos')", 25000);
}

async function login() {
  await evaluate(`(() => {
    const email = document.querySelector('input[type="email"], input[name="email"], #email');
    const password = document.querySelector('input[type="password"], input[name="password"], #password');
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
    setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});
    document.querySelector('button[type="submit"]')?.click();
    return true;
  })()`);
  await waitFor("!location.pathname.includes('/login')", 25000);
  await client.send("Page.navigate", { url: appUrl });
}

async function openFirstDetails() {
  await waitFor("document.querySelector('[data-testid=\"aluno-action-details\"]')", 25000);
  await evaluate(`document.querySelector('[data-testid="aluno-action-details"]')?.click(); true`);
  await waitFor("document.querySelector('[data-testid=\"aluno-details\"]')", 25000);
}

async function inspectRuntime(viewport) {
  const desktopInline = await validateDesktopInlinePlacement();
  const mobileAssociated = await validateMobileDetailAssociation();
  return evaluate(`(() => {
    const text = document.body.innerText || "";
    const width = document.documentElement.clientWidth;
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const listGroups = [...document.querySelectorAll('[data-testid="student-list-signals"]')].filter(visible);
    const listSignals = [...document.querySelectorAll('[data-testid="student-list-signals"] .coach-signal-pill')].filter(visible);
    const detailSignals = [...document.querySelectorAll('[data-testid="coach-workflow-signal"]')].filter(visible);
    const allSignalText = [...listSignals, ...detailSignals].map((item) => item.innerText).join("\\n");
    const priorityText = [...document.querySelectorAll('[data-testid="coach-workflow-signal"] span')].map((item) => item.innerText).join("\\n");
    const actionTargets = [...document.querySelectorAll('[data-testid^="coach-signal-action-"]')];
    const titles = detailSignals.map((item) => item.querySelector('strong')?.innerText || item.innerText.split("\\n")[0]);
    return {
      viewport: ${JSON.stringify(viewport)},
      alunosPageVisible: Boolean(document.querySelector('[data-testid="alunos-page"], .alunos-page')),
      coachSignalsVisible: Boolean(document.querySelector('[data-testid="coach-workflow-signals"]')),
      listSignalsVisible: listSignals.length > 0,
      listSignalCountBounded: listGroups.every((group) => group.querySelectorAll('.coach-signal-pill').length <= 2),
      signalOverloadGuard: detailSignals.length <= 3,
      horizontalOverflow: document.documentElement.scrollWidth > width + 1 || document.body.scrollWidth > width + 1,
      technicalPriorityEnumVisible: /\\b(HIGH|MEDIUM|INFO)\\b/.test(priorityText),
      technicalMetadataExposure: /\\b(UUID|RPC|database|COACH_SIGNAL|EXECUTION_INACTIVITY|NO_ACTIVE_WORKOUT|STUDENT_ACCESS_ATTENTION|FINANCE_ATTENTION|RECENT_ABANDONED_SESSION|RECENT_EXECUTION_ACTIVITY)\\b/i.test(text),
      cueVisible: /\\bCue\\b|\\bcue\\b/.test(text),
      adherenceLanguageUsed: /ader[eê]ncia|low adherence|percentual|percentage/i.test(text),
      runtimeDeduplication: !(titles.includes("Sem execucao recente") && titles.some((title) => /Ultima execucao/i.test(title))),
      quickActionsNavigationOnly: actionTargets.length > 0 && actionTargets.every((item) => item.tagName === "A" && item.getAttribute("href")),
      studentDetailVisible: Boolean(document.querySelector('[data-testid="aluno-details"]')),
      blankScreen: text.trim().length < 80,
      studentDetailSignalsVisible: detailSignals.length > 0,
      professionalExecutionHistoryVisible: Boolean(document.querySelector('[data-testid="student-execution-history"]')),
      noActiveWorkoutSignal: /Sem treino ativo/i.test(allSignalText),
      abandonedSignal: /Treino interrompido recentemente/i.test(allSignalText),
      executionInactivitySignal: /Sem execu[cç][aã]o recente/i.test(allSignalText),
      financeSignal: /Pagamento|Financeiro/i.test(allSignalText),
      studentAccessSignal: /Acesso|Convite/i.test(allSignalText),
      accessibility: Boolean(document.querySelector('[aria-labelledby="coach-workflow-signals-title"]')) && actionTargets.every((item) => item.innerText.trim().length > 0),
      desktopInlineTop: ${JSON.stringify(desktopInline.top)},
      desktopInlineMiddle: ${JSON.stringify(desktopInline.middle)},
      desktopInlineBottom: ${JSON.stringify(desktopInline.bottom)},
      mobileDetailAssociated: ${JSON.stringify(mobileAssociated)},
    };
  })()`);
}

async function validateDesktopInlinePlacement() {
  const isDesktop = await evaluate("Boolean(document.querySelector('.desktop-table')) && getComputedStyle(document.querySelector('.desktop-table')).display !== 'none'");
  if (!isDesktop) return { top: true, middle: true, bottom: true };
  const rowCount = await evaluate("document.querySelectorAll('.desktop-table tbody tr:not([data-testid=\"aluno-inline-details-row\"])').length");
  const indexes = [0, Math.max(0, Math.floor(rowCount / 2)), Math.max(0, rowCount - 1)];
  const labels = ["top", "middle", "bottom"];
  const result = {};
  for (let i = 0; i < indexes.length; i += 1) {
    await evaluate(`(() => {
      const rows = [...document.querySelectorAll('.desktop-table tbody tr:not([data-testid="aluno-inline-details-row"])')];
      const row = rows[${indexes[i]}];
      const button = row?.querySelector('[data-testid="aluno-action-details"]');
      button?.click();
      return Boolean(button);
    })()`);
    await waitFor(`(() => {
      const rows = [...document.querySelectorAll('.desktop-table tbody tr:not([data-testid="aluno-inline-details-row"])')];
      const row = rows[${indexes[i]}];
      const detailRow = row?.nextElementSibling;
      return detailRow?.dataset.testid === 'aluno-inline-details-row' && Boolean(detailRow?.querySelector('[data-testid="aluno-details"]'));
    })()`, 25000);
    result[labels[i]] = await evaluate(`(() => {
      const rows = [...document.querySelectorAll('.desktop-table tbody tr:not([data-testid="aluno-inline-details-row"])')];
      const row = rows[${indexes[i]}];
      const detailRow = row?.nextElementSibling;
      const detail = detailRow?.querySelector('[data-testid="aluno-details"]');
      return detailRow?.dataset.testid === 'aluno-inline-details-row' && Boolean(detail);
    })()`);
  }
  return result;
}

async function validateMobileDetailAssociation() {
  const isMobile = await evaluate("Boolean(document.querySelector('[data-testid=\"aluno-mobile-card\"]')) && getComputedStyle(document.querySelector('.desktop-table')).display === 'none'");
  if (!isMobile) return true;
  return evaluate(`(() => {
    const card = document.querySelector('[data-testid="aluno-mobile-card"]');
    if (!card?.querySelector('[data-testid="aluno-details"]')) {
      card?.querySelector('[data-testid="aluno-action-details"]')?.click();
    }
    return Boolean(card?.querySelector('[data-testid="aluno-details"]'));
  })()`);
}

async function validateStudentQaDailyWorkoutSignal() {
  await client.send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
  await openAlunos();
  const clicked = await evaluate(`(() => {
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const rows = [...document.querySelectorAll('.desktop-table tbody tr:not([data-testid="aluno-inline-details-row"])')];
    const row = rows.find((item) => visible(item) && /Student QA Daily Experience/i.test(item.innerText || ''));
    row?.querySelector('[data-testid="aluno-action-details"]')?.click();
    return Boolean(row);
  })()`);
  if (!clicked) return { hasStudent: false, hasAvailableWorkout: false, noActiveWorkoutSignal: true };
  await waitFor("document.querySelector('[data-testid=\"aluno-inline-details-row\"] [data-testid=\"aluno-details\"]')", 25000);
  await waitFor(`(() => {
    const training = document.querySelector('[data-testid="aluno-inline-details-row"] [data-testid="student-summary-training"]');
    return training && !/Carregando/i.test(training.innerText || '');
  })()`, 25000);
  return evaluate(`(() => {
    const detail = document.querySelector('[data-testid="aluno-inline-details-row"] [data-testid="aluno-details"]');
    const training = detail?.querySelector('[data-testid="student-summary-training"]');
    const text = detail?.innerText || "";
    const signalText = [...(detail?.querySelectorAll('[data-testid="coach-workflow-signal"]') || [])]
      .map((item) => item.innerText || "")
      .join("\\n");
    return {
      hasStudent: /Student QA Daily Experience/i.test(text),
      hasAvailableWorkout: /Treino ativo|Ficha atual QA Student|Treino dispon[ií]vel|Ativo para consulta|Revis[aã]o prevista/i.test(training?.innerText || text),
      noActiveWorkoutSignal: /Sem treino ativo/i.test(signalText),
    };
  })()`);
}

async function authState() {
  return evaluate(`(() => ({ path: window.location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function getWebSocketUrl() {
  const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (created.ok) {
    const target = await created.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const version = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!version.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  return (await version.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
  return result.result.value;
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

function validateQaCredentials() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    throw new Error("QA_USER_EMAIL e QA_USER_PASSWORD sao obrigatorios.");
  }
}

function check(condition, code) {
  if (!condition) {
    console.error(`COACH_WORKFLOW_SIGNALS_RUNTIME_QA=FAIL:${code}`);
    process.exit(1);
  }
}

function statusFor(results, viewport) {
  const item = results.find((result) => result.viewport === viewport);
  return item && item.alunosPageVisible && !item.horizontalOverflow ? "PASS" : "FAIL";
}

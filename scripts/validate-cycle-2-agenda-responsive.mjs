import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";

const evidenceDir = join("tmp-responsive-screenshots", "cycle-2-agenda");
const confirmModalPhase = process.env.CONFIRM_MODAL_PHASE || "after";
const cdpPort = String(9600 + Math.floor(Math.random() * 250));
const viewports = [
  { id: "mobile-320", width: 320, height: 700, mobile: true, expectedView: "Dia" },
  { id: "mobile-360", width: 360, height: 800, mobile: true, expectedView: "Dia" },
  { id: "mobile-375", width: 375, height: 812, mobile: true, expectedView: "Dia" },
  { id: "mobile-390", width: 390, height: 844, mobile: true, expectedView: "Dia" },
  { id: "mobile-412", width: 412, height: 915, mobile: true, expectedView: "Dia" },
  { id: "mobile-430", width: 430, height: 932, mobile: true, expectedView: "Dia" },
  { id: "desktop-1024", width: 1024, height: 768, mobile: false, expectedView: "Semana" },
  { id: "desktop-1366", width: 1366, height: 768, mobile: false, expectedView: "Semana" },
  { id: "desktop-1440", width: 1440, height: 900, mobile: false, expectedView: "Semana" },
];

loadQaEnvFile();
const runtime = {
  apiUrl: process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321",
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
};
if (!runtime.anonKey) throw new Error("AGENDA_LOCAL_ANON_KEY_MISSING");
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
mkdirSync(evidenceDir, { recursive: true });

let devServer;
let chrome;
const failures = [];
const results = [];
const confirmationDialogs = [];

try {
  await ensureFrontend();
  chrome = await startChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  try {
    await authenticate(client);
    await validateConflictAndCancellation(client);
    await validateSharedConfirmationConsumer(client);
    for (const viewport of viewports) {
      await setViewport(client, viewport);
      await navigateAgenda(client);
      const metrics = await inspectPage(client, viewport);
      results.push(metrics);
      assert(metrics.horizontalOverflow <= 1, `${viewport.id}:HORIZONTAL_OVERFLOW_${metrics.horizontalOverflow}`);
      assert(metrics.heroBeforeToolbar, `${viewport.id}:HERO_ORDER_INVALID`);
      assert(metrics.activeView === viewport.expectedView, `${viewport.id}:DEFAULT_VIEW_${metrics.activeView}`);
      assert(metrics.fatalText === false, `${viewport.id}:FATAL_TEXT`);
      if (viewport.mobile) {
        assert(metrics.bottomNavItems === 5, `${viewport.id}:BOTTOM_NAV_ITEM_COUNT_${metrics.bottomNavItems}`);
        assert(metrics.directAgendaTabs === 0, `${viewport.id}:AGENDA_BECAME_FIXED_TAB`);
        assert(metrics.hasFab, `${viewport.id}:FAB_MISSING`);
      } else {
        assert(metrics.desktopClearOfSidebar, `${viewport.id}:CONTENT_BEHIND_SIDEBAR`);
      }
      await captureScreenshot(client, join(evidenceDir, `${viewport.id}.png`));
    }

    await validateMobileNavigation(client);
    await validateViewSwitches(client);
    await validateStudentPicker(client);
    await validateTimeBehavior(client);
    await validateTimePickerResponsiveMatrix(client);
    await validateModal(client, { width: 320, height: 700, mobile: true }, "modal-mobile-320.png");
    await setViewport(client, { width: 320, height: 500, mobile: true });
    const keyboardMetrics = await inspectOpenModal(client);
    assert(keyboardMetrics.insideViewport, "KEYBOARD_MODAL_OUTSIDE_VIEWPORT");
    assert(keyboardMetrics.footerVisible, "KEYBOARD_MODAL_FOOTER_NOT_VISIBLE");
    assert(keyboardMetrics.bodyScrollable, "KEYBOARD_MODAL_BODY_NOT_SCROLLABLE");
    await captureScreenshot(client, join(evidenceDir, "modal-mobile-keyboard-320x500.png"));
    await closeModal(client);
    await validateModal(client, { width: 1024, height: 768, mobile: false }, "modal-desktop-1024.png");

    const report = {
      status: failures.length ? "FAIL" : "PASS",
      environment: "LOCAL_QA",
      browserQa: "DESKTOP_CHROME_CDP",
      mobileQa: "DEVICE_METRICS_EMULATION",
      realAndroidQa: "NOT_EXECUTED",
      viewportConfig: viewports,
      viewports: results,
      confirmationDialogs,
      failures,
    };
    writeFileSync(join(evidenceDir, "results.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (failures.length) process.exitCode = 1;
  } finally {
    client.close();
  }
} finally {
  chrome?.kill();
  devServer?.kill();
}

async function ensureFrontend() {
  if (await responds(qa.baseUrl)) return;
  const viteEntry = join(dirname(fileURLToPath(import.meta.resolve("vite"))), "..", "..", "bin", "vite.js");
  devServer = spawn(process.execPath, [viteEntry, "--host", "127.0.0.1"], {
    stdio: "pipe",
    shell: false,
    env: {
      ...process.env,
      VITE_SUPABASE_URL: runtime.apiUrl,
      VITE_SUPABASE_ANON_KEY: runtime.anonKey,
    },
  });
  for (let elapsed = 0; elapsed < 45000; elapsed += 500) {
    if (await responds(qa.baseUrl)) return;
    await sleep(500);
  }
  throw new Error("AGENDA_FRONTEND_LOCAL_UNAVAILABLE");
}

async function startChrome() {
  const chromePath = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  const userDataDir = join(process.env.TEMP || process.env.TMP || ".", `aruka-agenda-qa-${process.pid}-${Date.now()}`);
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: "ignore", shell: false });
  for (let elapsed = 0; elapsed < 15000; elapsed += 250) {
    if (await responds(`http://127.0.0.1:${cdpPort}/json/version`)) return child;
    await sleep(250);
  }
  throw new Error("AGENDA_CHROME_CDP_UNAVAILABLE");
}

async function authenticate(client) {
  await setViewport(client, { width: 1280, height: 800, mobile: false });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "!location.pathname.includes('/login') || (document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]'))", 20000);
  if (await evaluate(client, "!location.pathname.includes('/login')")) return;
  const filled = await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"]');
    const password = document.querySelector('input[type="password"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(email, ${JSON.stringify(process.env.QA_USER_EMAIL || "")});
    email.dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(password, ${JSON.stringify(process.env.QA_USER_PASSWORD || "")});
    password.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('button[type="submit"]')?.click();
    return Boolean(email && password);
  })()`);
  assert(filled, "AGENDA_LOGIN_FORM_UNAVAILABLE");
  await waitFor(client, "!location.pathname.includes('/login')", 20000);
}

async function navigateAgenda(client) {
  await evaluate(client, "document.documentElement.dataset.qaOldDocument = 'true'; true");
  await client.send("Page.navigate", { url: `${qa.baseUrl}/agenda` });
  await sleep(1000);
  await waitFor(client, "document.documentElement.dataset.qaOldDocument !== 'true'", 20000);
  await waitFor(client, "location.pathname === '/agenda' && document.querySelector('.agenda-page') && document.querySelector('.agenda-toolbar') && !/Verificando acesso|Verificando documentos/.test(document.body.innerText)", 20000);
  await waitFor(client, "!document.body.innerText.includes('Carregando agenda')", 20000);
  await sleep(750);
  await waitFor(client, "document.querySelector('.agenda-toolbar') && !/Verificando acesso|Verificando documentos/.test(document.body.innerText)", 20000);
}

async function inspectPage(client, viewport) {
  return evaluate(client, `(() => {
    const root = document.documentElement;
    const active = [...document.querySelectorAll('.agenda-view-switch button')].find((button) => button.getAttribute('aria-pressed') === 'true');
    const hero = document.querySelector('.page-hero');
    const toolbar = document.querySelector('.agenda-toolbar');
    const bottomItems = [...document.querySelectorAll('.mobile-bottom-nav-item')];
    const sidebar = document.querySelector('.app-sidebar');
    const page = document.querySelector('.agenda-page');
    return {
      id: ${JSON.stringify(viewport.id)},
      width: root.clientWidth,
      height: window.innerHeight,
      horizontalOverflow: root.scrollWidth - root.clientWidth,
      heroBeforeToolbar: Boolean(hero && toolbar && hero.getBoundingClientRect().top < toolbar.getBoundingClientRect().top),
      activeView: active?.textContent.trim() || '',
      bottomNavItems: bottomItems.filter((item) => item.getBoundingClientRect().width > 0).length,
      directAgendaTabs: bottomItems.filter((item) => /Agenda/i.test(item.textContent || '') && item.getBoundingClientRect().width > 0).length,
      hasFab: Boolean(document.querySelector('.agenda-mobile-fab')?.getBoundingClientRect().width),
      desktopClearOfSidebar: !sidebar || !page
        || page.getBoundingClientRect().left >= sidebar.getBoundingClientRect().right - 1
        || sidebar.getBoundingClientRect().bottom <= page.getBoundingClientRect().top + 1,
      fatalText: /erro fatal|failed to fetch|\\bundefined\\b|\\bNaN\\b|Invalid Date/i.test(document.body.innerText),
    };
  })()`);
}

async function validateMobileNavigation(client) {
  await setViewport(client, { width: 390, height: 844, mobile: true });
  await navigateAgenda(client);
  const opened = await evaluate(client, `(() => {
    const button = [...document.querySelectorAll('.mobile-bottom-nav-item')].find((item) => /Mais/i.test(item.textContent || ''));
    button?.click();
    return Boolean(button);
  })()`);
  assert(opened, "MOBILE_MORE_BUTTON_MISSING");
  await waitFor(client, "[...document.querySelectorAll('.mobile-more-item')].some((item) => /Agenda/i.test(item.textContent || ''))");
  const agendaLink = await evaluate(client, `[...document.querySelectorAll('.mobile-more-item')].find((item) => /Agenda/i.test(item.textContent || ''))?.getAttribute('href')`);
  assert(agendaLink === "/agenda", "MOBILE_MORE_AGENDA_LINK_INVALID");
}

async function validateViewSwitches(client) {
  await setViewport(client, { width: 320, height: 700, mobile: true });
  await navigateAgenda(client);
  for (const label of ["Semana", "Mês", "Dia"]) {
    await evaluate(client, `(() => {
      const button = [...document.querySelectorAll('.agenda-view-switch button')].find((item) => item.textContent.trim() === ${JSON.stringify(label)});
      button?.click();
      return Boolean(button);
    })()`);
    await waitFor(client, `[...document.querySelectorAll('.agenda-view-switch button')].some((item) => item.textContent.trim() === ${JSON.stringify(label)} && item.getAttribute('aria-pressed') === 'true')`);
    const overflow = await evaluate(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
    assert(overflow <= 1, `MOBILE_${label.toUpperCase()}_OVERFLOW_${overflow}`);
  }
}

async function validateModal(client, viewport, filename) {
  await setViewport(client, viewport);
  await navigateAgenda(client);
  const selector = viewport.mobile ? ".agenda-mobile-fab" : ".agenda-new-button";
  await evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.click(); true`);
  await waitFor(client, "document.querySelector('.agenda-form-modal')");
  await waitFor(client, "!document.querySelector('.agenda-student-search input')?.disabled");
  await evaluate(client, "document.querySelector('.agenda-student-search input')?.click(); true");
  await waitFor(client, "document.querySelectorAll('.agenda-student-option').length > 0");
  const metrics = await inspectOpenModal(client);
  assert(metrics.insideViewport, `${viewport.width}:MODAL_OUTSIDE_VIEWPORT`);
  assert(metrics.footerVisible, `${viewport.width}:MODAL_FOOTER_NOT_VISIBLE`);
  assert(metrics.fieldsInsideViewport, `${viewport.width}:MODAL_FIELD_OVERFLOW`);
  assert(metrics.closeNamed, `${viewport.width}:MODAL_CLOSE_UNNAMED`);
  assert(metrics.studentOptionCount > 0, `${viewport.width}:ELIGIBLE_STUDENTS_MISSING`);
  assert(!metrics.emptyStudentMessage, `${viewport.width}:INCORRECT_EMPTY_STUDENT_STATE`);
  await captureScreenshot(client, join(evidenceDir, filename));
  if (viewport.mobile) return;
  await closeModal(client);
}

async function validateStudentPicker(client) {
  await setViewport(client, { width: 390, height: 700, mobile: true });
  await navigateAgenda(client);
  await evaluate(client, "document.querySelector('.agenda-mobile-fab')?.click(); true");
  await waitFor(client, "document.querySelector('.agenda-student-search input') && !document.querySelector('.agenda-student-search input').disabled");
  await evaluate(client, "document.querySelector('.agenda-student-search input').click(); true");
  await waitFor(client, "document.querySelector('.agenda-student-search input')?.getAttribute('aria-expanded') === 'true'");
  await sleep(500);
  const initial = await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-student-search input');
    const first = document.querySelector('.agenda-student-option');
    return {
      expanded: input?.getAttribute('aria-expanded'),
      name: first?.textContent.trim() || '',
      options: document.querySelectorAll('.agenda-student-option').length,
      state: document.querySelector('.agenda-student-picker-state')?.textContent.trim() || '',
    };
  })()`);
  assert(initial.expanded === "true", "STUDENT_PICKER_NOT_EXPANDED");
  assert(Boolean(initial.name), `STUDENT_PICKER_OPTIONS_MISSING:${initial.state || "UNKNOWN"}`);
  if (!initial.name) return;

  const query = initial.name.slice(0, Math.min(3, initial.name.length));
  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-student-search input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(query)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await waitFor(client, "document.querySelectorAll('.agenda-student-option').length > 0");
  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-student-search input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return true;
  })()`);
  await waitFor(client, "document.querySelectorAll('.agenda-student-chip').length === 1");

  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-student-search input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'resultado-impossivel-ux04');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await waitFor(client, "/Nenhum aluno encontrado/.test(document.querySelector('.agenda-student-list')?.innerText || '')");
  const preserved = await evaluate(client, "document.querySelectorAll('.agenda-student-chip').length");
  assert(preserved === 1, "STUDENT_SELECTION_LOST_DURING_SEARCH");

  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-student-search input');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return true;
  })()`);
  const escaped = await evaluate(client, `(() => ({
    modalOpen: Boolean(document.querySelector('.agenda-form-modal')),
    expanded: document.querySelector('.agenda-student-search input')?.getAttribute('aria-expanded'),
    chips: document.querySelectorAll('.agenda-student-chip').length,
  }))()`);
  assert(escaped.modalOpen, "STUDENT_PICKER_ESCAPE_CLOSED_MODAL");
  assert(escaped.expanded === "false", "STUDENT_PICKER_ESCAPE_DID_NOT_CLOSE_LIST");
  assert(escaped.chips === 1, "STUDENT_SELECTION_LOST_ON_CLOSE");

  await evaluate(client, `(() => {
    document.querySelector('.agenda-student-search input')?.click();
    document.querySelector('.accessible-modal-header')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    return true;
  })()`);
  await waitFor(client, "document.querySelector('.agenda-student-search input')?.getAttribute('aria-expanded') === 'false'");
  const afterOutsideClick = await evaluate(client, "document.querySelectorAll('.agenda-student-chip').length");
  assert(afterOutsideClick === 1, "STUDENT_SELECTION_LOST_ON_OUTSIDE_CLICK");
  await closeModal(client);
}

async function validateTimeBehavior(client) {
  await setViewport(client, { width: 390, height: 844, mobile: true });
  await navigateAgenda(client);
  await evaluate(client, "document.querySelector('.agenda-mobile-fab')?.click(); true");
  await waitFor(client, "document.querySelectorAll('.agenda-time-picker').length === 2");

  const initial = await readTimePickerState(client);
  assert(initial.nativeTimeInputs === 0, "NATIVE_TIME_INPUT_STILL_PRESENT");
  assert(initial.start === "09:00", `INITIAL_START_${initial.start}`);
  assert(initial.end === "10:00", `INITIAL_END_${initial.end}`);
  assert(initial.selectCount === 4, `TIME_SELECT_COUNT_${initial.selectCount}`);

  await setTimePart(client, 0, 0, "18");
  await waitFor(client, "document.querySelectorAll('.agenda-time-picker')[1]?.querySelectorAll('select')[0]?.value === '19'");
  await setTimePart(client, 0, 1, "45");
  await waitFor(client, "document.querySelectorAll('.agenda-time-picker')[1]?.querySelectorAll('select')[1]?.value === '45'");
  const recalculated = await readTimePickerState(client);
  assert(recalculated.start === "18:45", `RECALCULATED_START_${recalculated.start}`);
  assert(recalculated.end === "19:45", `RECALCULATED_END_${recalculated.end}`);

  await setTimePart(client, 1, 0, "20");
  await setTimePart(client, 1, 1, "10");
  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-field input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'Consulta ajustada');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  const manualEnd = await readTimePickerState(client);
  assert(manualEnd.end === "20:10", `MANUAL_END_NOT_PRESERVED_${manualEnd.end}`);

  await setTimePart(client, 0, 0, "23");
  await setTimePart(client, 0, 1, "30");
  const midnight = await readTimePickerState(client);
  assert(midnight.start === "23:30", `MIDNIGHT_START_${midnight.start}`);
  assert(midnight.end === ":", `MIDNIGHT_END_SHOULD_BE_EMPTY_${midnight.end}`);
  assert(/meia-noite/i.test(midnight.error), `MIDNIGHT_ERROR_MISSING_${midnight.error}`);

  await setTimePart(client, 1, 0, "00");
  await setTimePart(client, 1, 1, "30");
  await evaluate(client, "document.querySelector('#agenda-form')?.requestSubmit(); true");
  await waitFor(client, "/mesmo dia/i.test(document.querySelector('.agenda-time-picker.has-error')?.innerText || '')");
  const invalid = await readTimePickerState(client);
  assert(invalid.modalOpen, "INVALID_INTERVAL_CLOSED_MODAL");
  assert(/mesmo dia/i.test(invalid.error), `INVALID_INTERVAL_ERROR_MISSING_${invalid.error}`);
  await captureScreenshot(client, join(evidenceDir, "time-validation-mobile-390.png"));
  await closeModal(client);
}

async function validateConflictAndCancellation(client) {
  const suffix = `${Date.now()}`;
  const firstTitle = `QA conflito base ${suffix}`;
  const secondTitle = `QA conflito inline ${suffix}`;

  await setViewport(client, { width: 390, height: 844, mobile: true });
  await navigateAgenda(client);
  await createAgendaCommitment(client, firstTitle);

  await openAgendaForm(client);
  await fillAgendaForm(client, secondTitle);
  await evaluate(client, "document.querySelector('#agenda-form')?.requestSubmit(); true");
  await waitFor(client, "document.querySelector('[data-testid=\"agenda-schedule-error\"]')");
  const conflict = await evaluate(client, `(() => {
    const alert = document.querySelector('[data-testid="agenda-schedule-error"]');
    const title = document.querySelector('.agenda-form-grid .agenda-field-span input');
    const submit = document.querySelector('button[form="agenda-form"][type="submit"]');
    return {
      modalOpen: Boolean(document.querySelector('.agenda-form-modal')),
      message: alert?.textContent.trim() || '',
      focused: document.activeElement === alert,
      title: title?.value || '',
      start: [...document.querySelectorAll('.agenda-time-picker')[0]?.querySelectorAll('select') || []].map((item) => item.value).join(':'),
      end: [...document.querySelectorAll('.agenda-time-picker')[1]?.querySelectorAll('select') || []].map((item) => item.value).join(':'),
      submitEnabled: Boolean(submit && !submit.disabled),
    };
  })()`);
  assert(conflict.modalOpen, "CONFLICT_CLOSED_MODAL");
  assert(conflict.message === "Já existe um compromisso nesse horário. Escolha outro intervalo.", `CONFLICT_MESSAGE_${conflict.message}`);
  assert(conflict.focused, "CONFLICT_ALERT_NOT_FOCUSED");
  assert(conflict.title === secondTitle, "CONFLICT_FORM_VALUES_LOST");
  assert(conflict.start === "09:00" && conflict.end === "10:00", `CONFLICT_TIME_VALUES_${conflict.start}_${conflict.end}`);
  assert(conflict.submitEnabled, "CONFLICT_SUBMIT_STILL_BUSY");
  await captureScreenshot(client, join(evidenceDir, "conflict-inline-mobile-390.png"));

  await setTimePart(client, 0, 0, "11");
  await waitFor(client, "!document.querySelector('[data-testid=\"agenda-schedule-error\"]')");
  await evaluate(client, "document.querySelector('#agenda-form')?.requestSubmit(); true");
  await waitFor(client, "!document.querySelector('.agenda-form-modal')", 20000);
  await waitFor(client, `[...document.querySelectorAll('.agenda-event')].some((item) => item.textContent.includes(${JSON.stringify(secondTitle)}))`, 20000);

  await evaluate(client, `(() => {
    window.__agendaDashboardEvents = 0;
    window.addEventListener('aruka:agenda-updated', () => { window.__agendaDashboardEvents += 1; });
    return true;
  })()`);
  await cancelAgendaCommitment(client, secondTitle, { validateDialog: true });
  await cancelAgendaCommitment(client, firstTitle);
  const refreshEvents = await evaluate(client, "window.__agendaDashboardEvents || 0");
  assert(refreshEvents === 2, `DASHBOARD_REFRESH_EVENT_COUNT_${refreshEvents}`);
}

async function openAgendaForm(client) {
  await evaluate(client, "document.querySelector('.agenda-mobile-fab')?.click(); true");
  await waitFor(client, "document.querySelector('.agenda-form-modal') && !document.querySelector('.agenda-student-search input')?.disabled");
}

async function fillAgendaForm(client, title) {
  await evaluate(client, `(() => {
    const input = document.querySelector('.agenda-form-grid .agenda-field-span input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(title)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.agenda-student-search input')?.click();
    return true;
  })()`);
  await waitFor(client, "document.querySelectorAll('.agenda-student-option').length > 0");
  await evaluate(client, "document.querySelector('.agenda-student-option')?.click(); true");
  await waitFor(client, "document.querySelectorAll('.agenda-student-chip').length === 1");
}

async function createAgendaCommitment(client, title) {
  await openAgendaForm(client);
  await fillAgendaForm(client, title);
  await evaluate(client, "document.querySelector('#agenda-form')?.requestSubmit(); true");
  await waitFor(client, "!document.querySelector('.agenda-form-modal')", 20000);
  await waitFor(client, `[...document.querySelectorAll('.agenda-event')].some((item) => item.textContent.includes(${JSON.stringify(title)}))`, 20000);
}

async function cancelAgendaCommitment(client, title, { validateDialog = false } = {}) {
  const opened = await evaluate(client, `(() => {
    const event = [...document.querySelectorAll('.agenda-event')].find((item) => item.textContent.includes(${JSON.stringify(title)}));
    event?.click();
    return Boolean(event);
  })()`);
  assert(opened, `CANCEL_EVENT_NOT_FOUND_${title}`);
  if (!opened) return;
  await waitFor(client, "document.querySelector('[data-testid=\"agenda-cancel-occurrence\"]')");
  await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-occurrence\"]')?.click(); true");
  await waitFor(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"]')");
  if (validateDialog) {
    await validateConfirmationDialogMatrix(client);
    await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"] button[aria-label=\"Fechar modal\"]')?.click(); true");
    await waitFor(client, "!document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"]')");
    assert(await evaluate(client, "Boolean(document.querySelector('.agenda-details-modal'))"), "CONFIRM_CLOSE_DISMISSED_DETAILS");

    await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-occurrence\"]')?.click(); true");
    await waitFor(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"]')");
    await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-cancel\"]')?.click(); true");
    await waitFor(client, "!document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"]')");
    assert(await evaluate(client, "Boolean(document.querySelector('.agenda-details-modal'))"), "CONFIRM_CANCEL_DISMISSED_DETAILS");

    await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-occurrence\"]')?.click(); true");
    await waitFor(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-dialog\"]')");
  }
  await evaluate(client, "document.querySelector('[data-testid=\"agenda-cancel-confirmation-confirm\"]')?.click(); true");
  await waitFor(client, "!document.querySelector('.agenda-details-modal')", 20000);
  await waitFor(client, `![...document.querySelectorAll('.agenda-event')].some((item) => item.textContent.includes(${JSON.stringify(title)}))`, 20000);
  await waitFor(client, "document.querySelector('.agenda-day-list') && !document.body.innerText.includes('Carregando agenda')", 20000);
}

async function validateConfirmationDialogMatrix(client) {
  const matrix = [
    { id: "mobile-320x568", width: 320, height: 568, mobile: true },
    { id: "mobile-360x640", width: 360, height: 640, mobile: true },
    { id: "mobile-375x667", width: 375, height: 667, mobile: true },
    { id: "mobile-390", width: 390, height: 844, mobile: true },
    { id: "mobile-412", width: 412, height: 915, mobile: true },
    { id: "mobile-430", width: 430, height: 932, mobile: true },
    { id: "desktop-1024", width: 1024, height: 768, mobile: false },
    { id: "desktop-1366", width: 1366, height: 768, mobile: false },
    { id: "desktop-1440", width: 1440, height: 900, mobile: false },
  ];

  for (const viewport of matrix) {
    await setViewport(client, viewport);
    const metrics = await evaluate(client, `(() => {
      const modal = document.querySelector('[data-testid="agenda-cancel-confirmation-dialog"]');
      const rect = modal?.getBoundingClientRect();
      const overlayRect = modal?.parentElement?.getBoundingClientRect();
      const buttons = [...(modal?.querySelectorAll('button') || [])].map((button) => button.getBoundingClientRect());
      const style = modal ? getComputedStyle(modal) : null;
      const overlayStyle = modal?.parentElement ? getComputedStyle(modal.parentElement) : null;
      return {
        id: ${JSON.stringify(viewport.id)},
        width: innerWidth,
        height: innerHeight,
        modalHeight: rect?.height || 0,
        heightRatio: rect ? Number((rect.height / innerHeight).toFixed(3)) : 0,
        centerDelta: rect && overlayRect ? Number(Math.abs((rect.top + rect.height / 2) - (overlayRect.top + overlayRect.height / 2)).toFixed(2)) : -1,
        insideViewport: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        buttonsVisible: buttons.length === 3 && buttons.every((button) => button.left >= -1 && button.right <= innerWidth + 1 && button.top >= -1 && button.bottom <= innerHeight + 1),
        overflowY: style?.overflowY || '',
        overlayAlignItems: overlayStyle?.alignItems || '',
        title: modal?.querySelector('h2')?.textContent.trim() || '',
        description: modal?.querySelector('.accessible-modal-title-block p')?.textContent.trim() || '',
        safeInitialFocus: document.activeElement?.getAttribute('data-testid') === 'agenda-cancel-confirmation-cancel',
      };
    })()`);
    confirmationDialogs.push(metrics);
    assert(metrics.insideViewport, `${viewport.id}:CONFIRM_OUTSIDE_VIEWPORT`);
    assert(metrics.horizontalOverflow <= 1, `${viewport.id}:CONFIRM_HORIZONTAL_OVERFLOW_${metrics.horizontalOverflow}`);
    assert(metrics.buttonsVisible, `${viewport.id}:CONFIRM_BUTTONS_CLIPPED`);
    assert(Boolean(metrics.title && metrics.description), `${viewport.id}:CONFIRM_COPY_MISSING`);
    if (confirmationDialogs.length === 1) assert(metrics.safeInitialFocus, `${viewport.id}:CONFIRM_INITIAL_FOCUS_UNSAFE`);
    if (confirmModalPhase === "after") {
      assert(metrics.overlayAlignItems === "center", `${viewport.id}:CONFIRM_NOT_CENTER_ALIGNED_${metrics.overlayAlignItems}`);
      assert(metrics.centerDelta <= 8, `${viewport.id}:CONFIRM_CENTER_DELTA_${metrics.centerDelta}`);
      assert(metrics.heightRatio < (viewport.mobile ? 0.72 : 0.55), `${viewport.id}:CONFIRM_EXCESS_HEIGHT_${metrics.heightRatio}`);
    }
    await captureScreenshot(client, join(evidenceDir, `${confirmModalPhase}-confirm-${viewport.id}.png`));
  }
  await validateLongConfirmationCopy(client);
  await setViewport(client, { width: 390, height: 844, mobile: true });
}

async function validateLongConfirmationCopy(client) {
  await setViewport(client, { width: 320, height: 568, mobile: true });
  const metrics = await evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="agenda-cancel-confirmation-dialog"]');
    const description = modal?.querySelector('.accessible-modal-title-block p');
    if (description) description.textContent = 'Esta confirmação possui uma explicação deliberadamente mais longa para validar quebra de linha, legibilidade, altura máxima, rolagem interna e acesso integral aos controles sem recorrer a uma altura fixa arbitrária.';
    const rect = modal?.getBoundingClientRect();
    const buttons = [...(modal?.querySelectorAll('button') || [])].map((button) => button.getBoundingClientRect());
    return {
      insideViewport: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      buttonsVisible: buttons.length === 3 && buttons.every((button) => button.left >= -1 && button.right <= innerWidth + 1 && button.top >= -1 && button.bottom <= innerHeight + 1),
      heightRatio: rect ? Number((rect.height / innerHeight).toFixed(3)) : 0,
    };
  })()`);
  assert(metrics.insideViewport, "LONG_CONFIRM_OUTSIDE_VIEWPORT");
  assert(metrics.horizontalOverflow <= 1, `LONG_CONFIRM_HORIZONTAL_OVERFLOW_${metrics.horizontalOverflow}`);
  assert(metrics.buttonsVisible, "LONG_CONFIRM_BUTTONS_CLIPPED");
  if (confirmModalPhase === "after") assert(metrics.heightRatio < 0.85, `LONG_CONFIRM_EXCESS_HEIGHT_${metrics.heightRatio}`);
  await captureScreenshot(client, join(evidenceDir, `${confirmModalPhase}-confirm-long-copy-320x568.png`));
}

async function validateSharedConfirmationConsumer(client) {
  await setViewport(client, { width: 320, height: 568, mobile: true });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/planos` });
  await waitFor(client, "location.pathname === '/planos' && document.querySelector('.planos-page')", 20000);
  await waitFor(client, "[...document.querySelectorAll('.planos-mobile-cards .table-button-danger')].some((button) => button.textContent.includes('Excluir'))", 20000);
  await evaluate(client, `[...document.querySelectorAll('.planos-mobile-cards .table-button-danger')].find((button) => button.textContent.includes('Excluir'))?.click(); true`);
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
  await sleep(300);
  const metrics = await evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="aluno-confirmation-dialog"]');
    const rect = modal?.getBoundingClientRect();
    const overlayRect = modal?.parentElement?.getBoundingClientRect();
    return {
      title: modal?.querySelector('h2')?.textContent.trim() || '',
      insideViewport: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
      heightRatio: rect ? Number((rect.height / innerHeight).toFixed(3)) : 0,
      centerDelta: rect && overlayRect
        ? Number(Math.abs((rect.top + rect.height / 2) - (overlayRect.top + overlayRect.height / 2)).toFixed(2))
        : -1,
      buttonsVisible: [...(modal?.querySelectorAll('button') || [])].every((button) => {
        const buttonRect = button.getBoundingClientRect();
        return buttonRect.left >= -1 && buttonRect.right <= innerWidth + 1 && buttonRect.top >= -1 && buttonRect.bottom <= innerHeight + 1;
      }),
    };
  })()`);
  assert(metrics.title === "Excluir plano?", `SHARED_CONFIRM_WRONG_CONSUMER_${metrics.title}`);
  assert(metrics.insideViewport, "SHARED_CONFIRM_OUTSIDE_VIEWPORT");
  assert(metrics.buttonsVisible, "SHARED_CONFIRM_BUTTONS_CLIPPED");
  if (confirmModalPhase === "after") {
    assert(metrics.centerDelta >= 0 && metrics.centerDelta <= 8, `SHARED_CONFIRM_NOT_CENTERED_${metrics.centerDelta}`);
    assert(metrics.heightRatio < 0.72, `SHARED_CONFIRM_EXCESS_HEIGHT_${metrics.heightRatio}`);
  }
  await captureScreenshot(client, join(evidenceDir, `${confirmModalPhase}-confirm-planos-mobile-320x568.png`));
  await evaluate(client, "document.querySelector('[data-testid=\"aluno-confirmation-cancel\"]')?.click(); true");
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
}

async function validateTimePickerResponsiveMatrix(client) {
  for (const viewport of viewports) {
    await setViewport(client, viewport);
    await navigateAgenda(client);
    const selector = viewport.mobile ? ".agenda-mobile-fab" : ".agenda-new-button";
    await evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.click(); true`);
    await waitFor(client, "document.querySelectorAll('.agenda-time-picker select').length === 4");
    const metrics = await evaluate(client, `(() => {
      const modal = document.querySelector('.agenda-form-modal');
      const fields = [...document.querySelectorAll('.agenda-time-picker select')];
      const rect = modal?.getBoundingClientRect();
      return {
        modalInside: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
        fieldsInside: fields.every((field) => {
          const fieldRect = field.getBoundingClientRect();
          return fieldRect.left >= -1 && fieldRect.right <= innerWidth + 1 && fieldRect.width >= 56 && fieldRect.height >= 43;
        }),
        nativeTimeInputs: document.querySelectorAll('input[type="time"]').length,
      };
    })()`);
    assert(metrics.modalInside, `${viewport.id}:TIME_MODAL_OUTSIDE_VIEWPORT`);
    assert(metrics.fieldsInside, `${viewport.id}:TIME_FIELDS_CLIPPED`);
    assert(metrics.nativeTimeInputs === 0, `${viewport.id}:NATIVE_TIME_INPUT_PRESENT`);
    await captureScreenshot(client, join(evidenceDir, `time-modal-${viewport.id}.png`));
    await closeModal(client);
  }
}

async function setTimePart(client, pickerIndex, selectIndex, value) {
  await evaluate(client, `(() => {
    const select = document.querySelectorAll('.agenda-time-picker')[${pickerIndex}]?.querySelectorAll('select')[${selectIndex}];
    if (!select) return false;
    select.value = ${JSON.stringify(value)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await sleep(100);
}

async function readTimePickerState(client) {
  return evaluate(client, `(() => {
    const pickers = [...document.querySelectorAll('.agenda-time-picker')];
    const value = (picker) => [...(picker?.querySelectorAll('select') || [])].map((select) => select.value).join(':');
    return {
      start: value(pickers[0]),
      end: value(pickers[1]),
      error: pickers[1]?.querySelector('.agenda-field-error')?.textContent.trim() || '',
      nativeTimeInputs: document.querySelectorAll('input[type="time"]').length,
      selectCount: document.querySelectorAll('.agenda-time-picker select').length,
      modalOpen: Boolean(document.querySelector('.agenda-form-modal')),
    };
  })()`);
}

async function inspectOpenModal(client) {
  return evaluate(client, `(() => {
    const modal = document.querySelector('.agenda-form-modal');
    const footer = modal?.querySelector('.accessible-modal-footer');
    const body = modal?.querySelector('.accessible-modal-body');
    const rect = modal?.getBoundingClientRect();
    const fieldRects = [...(modal?.querySelectorAll('input,select,textarea,button') || [])].map((item) => item.getBoundingClientRect()).filter((item) => item.width > 0);
    return {
      insideViewport: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
      footerVisible: Boolean(footer && footer.getBoundingClientRect().top >= 0 && footer.getBoundingClientRect().bottom <= innerHeight + 1),
      fieldsInsideViewport: fieldRects.every((item) => item.left >= -1 && item.right <= innerWidth + 1),
      bodyScrollable: Boolean(body && body.scrollHeight > body.clientHeight),
      closeNamed: Boolean(modal?.querySelector('button[aria-label="Fechar modal"]')),
      studentOptionCount: modal?.querySelectorAll('.agenda-student-option').length || 0,
      emptyStudentMessage: /Nenhum aluno ativo elegível/.test(modal?.innerText || ''),
    };
  })()`);
}

async function closeModal(client) {
  await evaluate(client, "document.querySelector('button[aria-label=\"Fechar modal\"]')?.click(); true");
  await waitFor(client, "!document.querySelector('.agenda-form-modal')");
}

function assert(condition, code) {
  if (!condition) failures.push(code);
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
}

async function captureScreenshot(client, path) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
}

async function getWebSocketUrl() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" });
  return (await response.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = ++nextId;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close: () => socket.close(),
  };
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "AGENDA_CDP_EVALUATION_FAILED");
  return response.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(200);
  }
  throw new Error(`AGENDA_CDP_TIMEOUT: ${expression}`);
}

async function responds(url) {
  try {
    return (await fetch(url, { redirect: "manual" })).status < 500;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

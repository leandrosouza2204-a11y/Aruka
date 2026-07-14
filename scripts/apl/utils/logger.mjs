const prefix = "[AQA]";

const colors = Object.freeze({
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
});

function format(level, message, color) {
  return `${colors[color]}${prefix} [${level}]${colors.reset} ${message}`;
}

export function info(message) {
  console.log(format("INFO", message, "blue"));
}

export function success(message) {
  console.log(format("SUCCESS", message, "green"));
}

export function warning(message) {
  console.warn(format("WARNING", message, "yellow"));
}

export function error(message) {
  console.error(format("ERROR", message, "red"));
}

export function section(message) {
  console.log(`\n${colors.bold}${colors.cyan}${prefix} ${message}${colors.reset}`);
}

export function summary(items) {
  section("Resumo");
  for (const [label, value] of Object.entries(items)) {
    console.log(`${colors.cyan}${label}:${colors.reset} ${value}`);
  }
}

export function ruleStart(rule) {
  info(`Executando regra ${rule.id}`);
}

export function ruleSuccess(rule, duration) {
  success(`Regra ${rule.id} concluida em ${duration}ms`);
}

export function ruleWarning(rule, findingCount) {
  warning(`Regra ${rule.id} gerou ${findingCount} ocorrencia(s)`);
}

export function ruleError(rule, err) {
  error(`Regra ${rule.id} falhou: ${err.message}`);
}

export function finding(item) {
  console.log(format(item.severity, `${item.ruleId}: ${item.message}`, "yellow"));
}

export function progress(current, total) {
  info(`Progresso ${current}/${total}`);
}

export function table(rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const widths = headers.map((header) =>
    Math.max(header.length, ...rows.map((row) => String(row[header] ?? "").length)),
  );
  const render = (values) => values.map((value, index) => String(value ?? "").padEnd(widths[index])).join("  ");

  console.log(render(headers));
  console.log(render(widths.map((width) => "-".repeat(width))));
  for (const row of rows) {
    console.log(render(headers.map((header) => row[header])));
  }
}

export function debug(message, enabled = false) {
  if (enabled) {
    console.log(format("DEBUG", message, "cyan"));
  }
}

export function blocker(message) {
  console.error(format("BLOCKER", message, "red"));
}

export function suggestion(message) {
  console.log(format("SUGGESTION", message, "cyan"));
}

export function confidence(value) {
  info(`Confidence medio: ${value}%`);
}

export function baseline(message) {
  info(`Baseline: ${message}`);
}

export function category(message) {
  info(`Categoria: ${message}`);
}

export function rootCause(message) {
  warning(`Root cause: ${message}`);
}

export function trend(message) {
  info(`Tendencia: ${message}`);
}

export function dedup(message) {
  info(`Dedup: ${message}`);
}

export function suppression(message) {
  info(`Suppression: ${message}`);
}

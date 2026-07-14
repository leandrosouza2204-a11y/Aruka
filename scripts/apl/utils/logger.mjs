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

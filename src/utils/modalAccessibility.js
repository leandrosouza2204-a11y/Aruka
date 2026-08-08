export const modalFocusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getModalFocusableElements(container) {
  return Array.from(container?.querySelectorAll(modalFocusableSelector) || []).filter(
    (element) => element.offsetParent !== null || element === document.activeElement
  );
}

export function trapModalFocus(event, container) {
  if (event.key !== "Tab") return false;

  const focusableElements = getModalFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    container?.focus?.();
    return true;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}

export const CYCLE_12_14_LANDSCAPE_VIEWPORTS = Object.freeze([
  { name: "landscape-640x320", width: 640, height: 320, mobile: true },
  { name: "landscape-812x375", width: 812, height: 375, mobile: true },
  { name: "landscape-844x390", width: 844, height: 390, mobile: true },
  { name: "landscape-1024x768", width: 1024, height: 768, mobile: true },
]);

export const CYCLE_12_14_KEYBOARD_RESIZE_VIEWPORTS = Object.freeze([
  { name: "keyboard-resize-390x360", width: 390, height: 360, mobile: true },
  { name: "keyboard-resize-640x320", width: 640, height: 320, mobile: true },
  { name: "keyboard-resize-844x390", width: 844, height: 390, mobile: true },
]);

export function resolveCycle1214Viewports(defaultViewports, profile = process.env.QA_CYCLE_12_14_VIEWPORT_PROFILE) {
  if (profile === "landscape") return CYCLE_12_14_LANDSCAPE_VIEWPORTS.map((viewport) => ({ ...viewport }));
  if (profile === "keyboard-resize") return CYCLE_12_14_KEYBOARD_RESIZE_VIEWPORTS.map((viewport) => ({ ...viewport }));
  return defaultViewports;
}

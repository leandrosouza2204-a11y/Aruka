import { createContext, useContext } from "react";

export const PwaInstallContext = createContext({
  showInstallOption: false,
  canNativePrompt: false,
  isStandalone: false,
  installGuidanceOpen: false,
  openInstallGuidance: () => {},
  closeInstallGuidance: () => {},
  requestInstall: async () => {},
});

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

import { getSettings, saveSettings } from "./settings";
import { createSettingsModal, injectSettingsButton } from "./ui";
// @ts-ignore - this file is generated at build time
import { patches } from "./registry";
import type { PatchModule } from "./types";

const registeredPatches = patches as PatchModule[];

console.log("[Patch] Initializing Volanta Patcher");

const settings = getSettings();

// Apply initial state
registeredPatches.forEach((patch) => {
  const enabled = settings[patch.manifest.id];
  patch.execute(!!enabled);
});

injectSettingsButton(() => {
  console.log("[Patch] Settings button clicked.");
  createSettingsModal(registeredPatches, getSettings(), (newSettings) => {
    saveSettings(newSettings);
    // Re-apply all patches
    registeredPatches.forEach((patch) => {
      patch.execute(!!newSettings[patch.manifest.id]);
    });
  });
});

const SETTINGS_KEY = "volanta_patcher_settings";

export interface Settings {
  [key: string]: boolean;
}

export const defaultPatchSettings: Settings = {
  minimalSidebar: true,
  minimalRightPanel: true,
  removeBrowser: true,
  removePremiumSpam: true,
  removeMapboxLogo: true,
  transparentSidebarBottom: true,
  unlockWeatherLayers: true,
};

export function getSettings(): Settings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultPatchSettings, ...JSON.parse(saved) } : defaultPatchSettings;
  } catch (e) {
    console.error("Failed to load settings", e);
    return defaultPatchSettings;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

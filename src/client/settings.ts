const SETTINGS_KEY = "volanta_patcher_settings";

export interface Settings {
  [key: string]: boolean;
}

const defaultSettings: Settings = {
  minimalSidebar: true,
  minimalRightPanel: true,
  removeBrowser: true,
  removePremiumSpam: true,
  removeMapboxLogo: true,
  transparentSidebarBottom: true,
};

export function getSettings(): Settings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch (e) {
    console.error("Failed to load settings", e);
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

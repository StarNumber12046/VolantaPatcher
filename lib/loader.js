// lib/loader.js

const SETTINGS_KEY = "volanta_patcher_settings";

const defaultSettings = {
  minimalSidebar: true,
  minimalRightPanel: true,
  removeBrowser: true,
  removePremiumSpam: true,
  removeMapboxLogo: true,
  transparentSidebarBottom: true,
};

function getSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch (e) {
    console.error("Failed to load settings", e);
    return defaultSettings;
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
}

function log(message) {
  console.log(`%c[Patch]%c ${message}`, "color: blue; font-weight: bold", "");
}

// CSS Injector
const styleElement = document.createElement("style");
styleElement.id = "volanta-patcher-styles";
document.head.appendChild(styleElement);

const patches = {
  minimalSidebar: {
    name: "Minimal Sidebar",
    css: `
      a[href='#/schedules'],
      a[href='#/events'],
      a[href='#/activities'],
      app-orbs-balance { display: none !important; }
    `
  },
  minimalRightPanel: {
    name: "Minimal Right Panel",
    css: `
      .map-filter-container > div:nth-child(2),
      .map-filter-container > div > div:nth-child(3) { display: none !important; }
    `
  },
  removeBrowser: {
    name: "Remove Browser Button",
    css: `.browser-panel-button { display: none !important; }`
  },
  removePremiumSpam: {
    name: "Remove Premium Spam",
    css: `
      img[alt='Customize profile'],
      .party-card-container { display: none !important; }
    `
  },
  removeMapboxLogo: {
    name: "Remove Mapbox Logo",
    css: `
      .mapboxgl-ctrl-logo,
      .mapboxgl-ctrl-bottom-right { display: none !important; }
    `
  },
  transparentSidebarBottom: {
    name: "Transparent Sidebar Bottom",
    css: `div.nav-alt-bottom-container { background-color: transparent !important; }`
  }
};

function applySettings(settings) {
  let css = "";
  for (const [key, enabled] of Object.entries(settings)) {
    if (enabled && patches[key]) {
      css += patches[key].css;
    }
  }
  styleElement.textContent = css;
}

// UI Components
function createToggle(key, label, initialValue, onChange) {
  const container = document.createElement("div");
  container.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;";
  
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  labelEl.style.color = "#e5e7eb";
  labelEl.style.fontSize = "14px";
  
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = initialValue;
  input.style.cursor = "pointer";
  input.style.accentColor = "#3b82f6";
  input.onchange = (e) => onChange(key, e.target.checked);
  
  container.appendChild(labelEl);
  container.appendChild(input);
  return container;
}

function createSettingsModal() {
  if (document.getElementById("vp-settings-modal")) return;

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "vp-settings-modal";
  modalOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(2px); z-index: 99999; display: flex; justify-content: center; align-items: center;";
  
  const modalContent = document.createElement("div");
  modalContent.style.cssText = "background: #1f2937; padding: 25px; border-radius: 12px; width: 350px; color: white; font-family: 'Inter', sans-serif; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);";
  
  const header = document.createElement("div");
  header.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;";

  const title = document.createElement("h3");
  title.textContent = "Volanta Patcher";
  title.style.margin = "0";
  title.style.fontSize = "18px";
  title.style.fontWeight = "600";
  
  const closeX = document.createElement("button");
  closeX.innerHTML = "&times;";
  closeX.style.cssText = "background: none; border: none; color: #9ca3af; font-size: 24px; cursor: pointer; padding: 0;";
  closeX.onclick = () => modalOverlay.remove();

  header.appendChild(title);
  header.appendChild(closeX);
  modalContent.appendChild(header);

  const settings = getSettings();

  for (const [key, patch] of Object.entries(patches)) {
    const toggle = createToggle(key, patch.name, settings[key], (k, val) => {
      settings[k] = val;
      saveSettings(settings);
    });
    modalContent.appendChild(toggle);
  }

  const footer = document.createElement("div");
  footer.style.cssText = "margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280;";
  footer.innerHTML = "Changes apply immediately.";
  modalContent.appendChild(footer);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Close on click outside
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  };
}

// Inject Settings Button
function injectSettingsButton() {
  const selector = ".settings-info";
  // Simple polling to handle SPA navigation
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      if (!el.querySelector("#vp-open-settings")) {
        const item = document.createElement("div");
        item.className = "settings-info-item";
        
        // Match existing style
        const link = document.createElement("a");
        link.href = "#";
        link.id = "vp-open-settings";
        link.textContent = "Volanta Patcher Settings";
        link.style.color = "#3b82f6"; // Volanta blue-ish
        link.style.fontWeight = "500";
        link.style.textDecoration = "none";
        
        link.onclick = (e) => {
          e.preventDefault();
          createSettingsModal();
        };

        item.innerHTML = "Config: ";
        item.appendChild(link);
        el.appendChild(item);
        log("Settings button injected");
      }
    }
  }, 2000);
}

// Initialize
log("Initializing Volanta Patcher v2.0...");
applySettings(getSettings());
injectSettingsButton();
// If you don't wanna go insane, don't try to touch this file :)

import type { Settings } from "./settings";
import type { PatchModule } from "./types";

function log(message: string) {
  console.log(`%c[Patch]%c ${message}`, "color: blue; font-weight: bold", "");
}

log("ui.ts loaded");

function createToggle(
  key: string,
  label: string,
  initialValue: boolean,
  onChange: (key: string, val: boolean) => void,
) {
  const container = document.createElement("div");
  container.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;";

  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  labelEl.style.color = "#e5e7eb";
  labelEl.style.fontSize = "14px";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = initialValue;
  input.style.cursor = "pointer";
  input.style.accentColor = "#3b82f6";
  input.onchange = (e) => onChange(key, (e.target as HTMLInputElement).checked);

  container.appendChild(labelEl);
  container.appendChild(input);
  return container;
}

export function createSettingsModal(
  patches: PatchModule[],
  settings: Settings,
  onSave: (settings: Settings) => void,
) {
  if (document.getElementById("vp-settings-modal")) return;

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "vp-settings-modal";
  modalOverlay.style.cssText =
    "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(2px); z-index: 99999; display: flex; justify-content: center; align-items: center;";

  const modalContent = document.createElement("div");
  modalContent.classList.add("settings-my-account");
  modalContent.style.cssText =
    "background-color: #1e1e1e !important; width: 500px !important;";

  const header = document.createElement("div");
  header.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;";

  const title = document.createElement("h3");
  title.textContent = "Volanta Patcher";
  title.style.margin = "0";
  title.style.fontSize = "18px";
  title.style.fontWeight = "600";

  const closeX = document.createElement("button");
  closeX.innerHTML = "&times;";
  closeX.style.cssText =
    "background: none; border: none; color: #9ca3af; font-size: 24px; cursor: pointer; padding: 0;";
  closeX.onclick = () => modalOverlay.remove();

  header.appendChild(title);
  header.appendChild(closeX);
  modalContent.appendChild(header);

  const currentSettings = { ...settings };

  patches.forEach((patch) => {
    const key = patch.manifest.id;
    const toggle = createToggle(
      key,
      patch.manifest.name,
      !!currentSettings[key],
      (k, val) => {
        currentSettings[k] = val;
        onSave(currentSettings);
      },
    );
    modalContent.appendChild(toggle);
  });

  const footer = document.createElement("div");
  footer.style.cssText =
    "margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280;";
  footer.innerHTML = "Changes apply immediately.";
  modalContent.appendChild(footer);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  };
}

function isSettingsInjected() {
  return !!document.getElementById("vp-patcher-nav");
}

function isOnSettingsRoute() {
  const path = `${location.pathname}${location.hash}`;
  return /\/settings(\/|$)/i.test(path) || path.includes("#/settings");
}

function normalizeText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function findElementBySelectorText(
  selector: string,
  text: string,
  exact = false,
) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).find((element) => {
    const content = normalizeText(element.textContent);
    return exact ? content === text : content.includes(text);
  });
}

function createNavItem(label: string, onClick: () => void) {
  const item = document.createElement("div");
  item.classList.add("settings-item");
  item.id = "vp-patcher-nav-item";
  item.textContent = label;
  item.tabIndex = 0;
  item.role = "button";
  item.onclick = onClick;
  item.onkeydown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };
  return item;
}

function tryInjectIntoSettingsSidebar(onClick: () => void): boolean {
  if (isSettingsInjected()) {
    return true;
  }

  if (!isOnSettingsRoute()) {
    return false;
  }

  const settingsSide =
    document.querySelector(".settings-side") ??
    document.querySelector(".settings-inner .settings-side");

  if (!settingsSide) {
    return false;
  }

  const anchorLabels = [
    "Changelog",
    "Support",
    "Screenshots",
    "General",
    "Account",
    "Premium",
    "Networking",
  ];

  let anchor: Element | undefined;
  for (const label of anchorLabels) {
    anchor = findElementBySelectorText(".settings-item", label);
    if (anchor) break;
  }

  const container = document.createElement("div");
  container.id = "vp-patcher-nav";

  const separator = document.createElement("div");
  separator.classList.add("settings-seperator");

  const header = document.createElement("div");
  header.classList.add("settings-header");
  header.textContent = "Volanta Patcher";

  const item = createNavItem("Patches", onClick);

  container.appendChild(separator);
  container.appendChild(header);
  container.appendChild(item);

  const settingsInfo = settingsSide.querySelector(".settings-info");
  if (settingsInfo) {
    settingsSide.insertBefore(container, settingsInfo);
  } else if (anchor?.parentElement) {
    anchor.parentElement.insertBefore(container, anchor.nextSibling);
  } else {
    settingsSide.appendChild(container);
  }

  log("Injected Volanta Patcher entry into settings sidebar.");
  return true;
}

function ensureFloatingButton(onClick: () => void) {
  if (document.getElementById("vp-patcher-fab")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "vp-patcher-fab";
  button.type = "button";
  button.title = "Volanta Patcher";
  button.textContent = "VP";
  button.style.cssText = [
    "position: fixed",
    "right: 18px",
    "bottom: 18px",
    "z-index: 99998",
    "width: 42px",
    "height: 42px",
    "border-radius: 999px",
    "border: 1px solid rgba(255,255,255,0.15)",
    "background: #1e1e1e",
    "color: #e5e7eb",
    "font-size: 12px",
    "font-weight: 700",
    "cursor: pointer",
    "box-shadow: 0 8px 24px rgba(0,0,0,0.35)",
  ].join(";");
  button.onclick = onClick;

  document.body.appendChild(button);
  log("Floating Volanta Patcher button ready.");
}

export function injectSettingsButton(onClick: () => void) {
  ensureFloatingButton(onClick);

  const attemptInjection = () => {
    tryInjectIntoSettingsSidebar(onClick);
  };

  attemptInjection();

  const observer = new MutationObserver(() => {
    attemptInjection();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("hashchange", attemptInjection);
  window.addEventListener("popstate", attemptInjection);

  const interval = window.setInterval(attemptInjection, 1000);

  window.setTimeout(() => {
    if (!isSettingsInjected()) {
      log(
        "Settings sidebar entry not found yet. Use the VP button (bottom-right) or open Settings first.",
      );
    }
    window.clearInterval(interval);
  }, 120_000);
}
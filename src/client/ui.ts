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
  // modalContent.style.cssText =
  // "background-color: #333334; padding: 25px; border-radius: 12px; width: 350px; color: white; font-family: 'Inter', sans-serif; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);";
  modalContent.classList.add("settings-my-account"); // Looks good
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

  // Clone settings to avoid applying immediately in UI state (optional, but good practice, though current requirement implies immediate)
  // Actually original logic applied immediately on toggle. Let's stick to that.
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

  // Close on click outside
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  };
}

function isSettingsInjected() {
  const settingHeaders = document.querySelectorAll(".settings-header");
  const settings = document.querySelectorAll(".settings-item");
  return (
    Array.from(settings)
      .map((s) => s.textContent)
      .includes("Patches") ||
    Array.from(settingHeaders)
      .map((s) => s.textContent)
      .includes("Volanta Patcher")
  );
}

function findElementBySelectorText(
  selector: string,
  text: string,
  exact = false,
) {
  const el = document.querySelectorAll(selector);
  return Array.from(el).find((e) =>
    exact ? e.textContent === text : e.textContent.includes(text),
  );
}

export function injectSettingsButton(onClick: () => void) {
  const selector = ".settings-info";
  const interval = setInterval(() => {
    log("Checking if settings button is injected...");
    if (isSettingsInjected()) {
      log("Settings button already injected.");
      clearInterval(interval);
      return;
    }
    const el = findElementBySelectorText(".settings-item", "Screenshots");
    log("Element: " + el);
    if (!el) return;

    log("Injecting settings button...");
    const separator = document.createElement("div");
    separator.classList.add("settings-seperator"); // not a typo on my end, Orbx can't type :)
    const patchesSettingsHeader = document.createElement("div");
    patchesSettingsHeader.classList.add("settings-header");
    patchesSettingsHeader.textContent = "Volanta Patcher";
    const patchesSettingsItem = document.createElement("div");
    patchesSettingsItem.classList.add("settings-item");
    patchesSettingsItem.textContent = "Patches";
    patchesSettingsItem.tabIndex = 0;
    patchesSettingsItem.role = "button";
    patchesSettingsItem.onclick = onClick;
    const injectedSeparator = el.parentElement?.insertBefore(
      separator,
      el.nextSibling,
    );
    const injectedPatchesSettingsHeader = el.parentElement?.insertBefore(
      patchesSettingsHeader,
      injectedSeparator?.nextSibling ?? el.nextSibling,
    );
    el.parentElement?.insertBefore(
      patchesSettingsItem,
      injectedPatchesSettingsHeader?.nextSibling ?? el.nextSibling,
    );
  }, 500);
}

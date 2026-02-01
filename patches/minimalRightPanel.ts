export const manifest = {
  id: "minimalRightPanel",
  name: "Minimal Right Panel",
  description: "Hides non-essential elements in the right panel."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-minimalRightPanel";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `
      .map-filter-container > div:nth-child(2),
      .map-filter-container > div > div:nth-child(3) { display: none !important; }
    `;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

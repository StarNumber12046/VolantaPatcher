export const manifest = {
  id: "removeBrowser",
  name: "Remove Browser Button",
  description: "Removes the browser button from the interface."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-removeBrowser";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `.browser-panel-button { display: none !important; }`;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

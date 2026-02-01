export const manifest = {
  id: "transparentSidebarBottom",
  name: "Transparent Sidebar Bottom",
  description: "Makes the bottom of the sidebar transparent."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-transparentSidebarBottom";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `div.nav-alt-bottom-container { background-color: transparent !important; }`;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

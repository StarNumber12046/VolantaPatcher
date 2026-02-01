export const manifest = {
  id: "minimalSidebar",
  name: "Minimal Sidebar",
  description: "Hides sidebar elements that are not essential."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-minimalSidebar";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `
      a[href='#/schedules'],
      a[href='#/events'],
      a[href='#/activities'],
      app-orbs-balance { display: none !important; }
    `;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

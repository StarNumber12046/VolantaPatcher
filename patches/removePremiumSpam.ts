export const manifest = {
  id: "removePremiumSpam",
  name: "Remove Premium Spam",
  description: "Hides premium upsells and party card container."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-removePremiumSpam";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `
      img[alt='Customize profile'],
      .party-card-container { display: none !important; }
    `;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

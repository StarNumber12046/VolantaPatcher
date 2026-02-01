export const manifest = {
  id: "removeMapboxLogo",
  name: "Remove Mapbox Logo",
  description: "Hides the Mapbox logo and attribution."
};

export function execute(enabled: boolean) {
  const id = "vp-patch-removeMapboxLogo";
  let style = document.getElementById(id);
  if (enabled) {
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      style.textContent = `
      .mapboxgl-ctrl-logo,
      .mapboxgl-ctrl-bottom-right { display: none !important; }
    `;
      document.head.appendChild(style);
    }
  } else {
    style?.remove();
  }
}

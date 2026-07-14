export const manifest = {
  id: "unlockWeatherLayers",
  name: "Unlock Volanta premium features",
  description:
    "Bypasses client-side premium checks (weather layers, forecast times, altitude, and other gated features). Applied to app.asar when you run the patcher.",
};

export function execute(_enabled: boolean) {
  // Premium unlock is applied to app.asar at patcher build time (see lib/weatherUnlockPatches.ts).
}
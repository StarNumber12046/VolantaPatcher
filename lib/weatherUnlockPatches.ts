import type { AsarReplacement } from "./asarPatches";

export const weatherUnlockAsarReplacements: AsarReplacement[] = [
  {
    id: "auth-isPremiumUser",
    description: "AuthService.isPremiumUser() always returns true",
    search: "isPremiumUser(){return this.decodedToken.isPremium}",
    replace: "isPremiumUser(){return!0}",
  },
  {
    id: "premium-isPremiumUser",
    description: "Premium service isPremiumUser getter always returns true",
    search:
      /get isPremiumUser\(\)\{if\(!this\.auth\.token\)return!1;let \w+=this\.jwt\.decodeToken\(this\.auth\.token\);if\(!\w+\["volanta\.subscription_end_date"\]\)return!1;let \w+=parseInt\(\w+\["volanta\.subscription_end_date"\]\);return \w+\?\w+\.default\.unix\(\w+\)\.utc\(\)>\(0,\w+\.default\)\(\):!1\}/g,
    replace: "get isPremiumUser(){return!0}",
  },
];
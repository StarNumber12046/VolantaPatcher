import { copyFileSync, renameSync } from "fs";
import { patch } from "./lib/patcher";
import { cwd } from "process";

console.log("[i] Patching Volanta...");
const asarPath =
  (process.env.LOCALAPPDATA as string) + "/Programs/Volanta/resources/app.asar";
const outPath = cwd() + "/patched.asar";
await patch(asarPath, cwd() + "/lib/loader.js", outPath);
// renameSync(asarPath, asarPath + ".bak");
copyFileSync(outPath, asarPath);

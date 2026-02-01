import { createPackage, extractAll } from "@electron/asar";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  readdirSync,
} from "fs";
import { cwd } from "process";
import { join } from "path";

function isScriptLoaded(htmlContent: string) {
  return htmlContent.includes('<script type="module">');
}

function removeLoaderScript(htmlContent: string) {
  return htmlContent.replace(/<script type="module">.*?<\/script>/s, "");
}

function appendLoaderScript(htmlContent: string, loaderScript: string) {
  return htmlContent.replace(
    "</html>",
    `<script type="module">${loaderScript}</script></html>`,
  );
}

function patchContents(asarExtractedPath: string, loaderScript: string) {
  const htmlPath = asarExtractedPath + "/dist/renderer/browser/index.html";
  let htmlContent = readFileSync(htmlPath, "utf8");
  if (isScriptLoaded(htmlContent)) {
    console.log(`[i] ${htmlPath} already patched, updating...`);
    htmlContent = removeLoaderScript(htmlContent);
  }
  const patchedHtmlContent = appendLoaderScript(htmlContent, loaderScript);
  writeFileSync(htmlPath, patchedHtmlContent);
}

async function rebuild(asarExtractedPath: string, asarPath: string) {
  console.log(`[i] Rebuilding ${asarPath} ...`);
  await createPackage(asarExtractedPath, asarPath);
}

async function buildLoader(): Promise<string> {
  console.log("[i] Building patches...");
  const patchesDir = join(cwd(), "patches");
  const registryPath = join(cwd(), "src/client/registry.ts");

  // Ensure src/client exists (it should, but just in case)
  if (!existsSync(join(cwd(), "src/client"))) {
    mkdirSync(join(cwd(), "src/client"), { recursive: true });
  }

  const patchFiles = readdirSync(patchesDir).filter((f) => f.endsWith(".ts"));

  const imports = patchFiles
    .map(
      (f, i) =>
        `import * as p${i} from "../../patches/${f.replace(".ts", "")}";`,
    )
    .join("\n");
  const exports = `export const patches = [${patchFiles.map((_, i) => `p${i}`).join(", ")}];`;

  writeFileSync(registryPath, imports + "\n\n" + exports);

  const build = await Bun.build({
    entrypoints: [join(cwd(), "src/client/index.ts")],
    minify: true,
  });

  if (!build.success) {
    console.error("Build failed:", build.logs);
    throw new Error("Build failed");
  }

  if (!build.outputs[0]) {
    console.error("Unexpected number of outputs:", build.outputs.length);
    throw new Error("Unexpected number of outputs");
  }
  return await build.outputs[0].text();
}

export async function patch(asarPath: string, outPath: string) {
  const loaderScript = await buildLoader();

  const asarExtractedPath = cwd() + "/.extract";
  console.log(`[i] Extracting ${asarPath} to ${asarExtractedPath}...`);
  if (existsSync(asarExtractedPath)) {
    rmSync(asarExtractedPath, { recursive: true, force: true });
  }
  mkdirSync(asarExtractedPath);
  extractAll(asarPath, asarExtractedPath);
  console.log(`[i] Patching ${asarPath}...`);
  patchContents(asarExtractedPath, loaderScript);
  await rebuild(asarExtractedPath, outPath);
  // rmSync(asarExtractedPath, { recursive: true, force: true });
  console.log(`[i] Done!`);
}

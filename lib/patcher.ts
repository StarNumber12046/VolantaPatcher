import { createPackage, extractAll } from "@electron/asar";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { cwd } from "process";

function isScriptLoaded(htmlContent: string) {
  return htmlContent.includes('<script type="module">');
}

function removeLoaderScript(htmlContent: string) {
  return htmlContent.replace(/<script type="module">.*?<\/script>/s, "");
}

function appendLoaderScript(htmlContent: string, loaderScript: string) {
  return htmlContent.replace(
    "</html>",
    `<script type="module">${loaderScript}</script></html>`
  );
}

function patchContents(asarExtractedPath: string, loaderPath: string) {
  const htmlPath = asarExtractedPath + "/dist/renderer/browser/index.html";
  let htmlContent = readFileSync(htmlPath, "utf8");
  if (isScriptLoaded(htmlContent)) {
    console.log(`[i] ${htmlPath} already patched, updating...`);
    htmlContent = removeLoaderScript(htmlContent);
  }
  const patchedHtmlContent = appendLoaderScript(
    htmlContent,
    readFileSync(loaderPath, "utf8")
  );
  writeFileSync(htmlPath, patchedHtmlContent);
}

async function rebuild(asarExtractedPath: string, asarPath: string) {
  console.log(`[i] Rebuilding ${asarPath} ...`);
  await createPackage(asarExtractedPath, asarPath);
}

export async function patch(
  asarPath: string,
  loaderPath: string,
  outPath: string
) {
  const asarExtractedPath = cwd() + "/.extract";
  console.log(`[i] Extracting ${asarPath} to ${asarExtractedPath}...`);
  if (existsSync(asarExtractedPath)) {
    rmSync(asarExtractedPath, { recursive: true, force: true });
  }
  mkdirSync(asarExtractedPath);
  extractAll(asarPath, asarExtractedPath);
  console.log(`[i] Patching ${asarPath}...`);
  patchContents(asarExtractedPath, loaderPath);
  await rebuild(asarExtractedPath, outPath);
  // rmSync(asarExtractedPath, { recursive: true, force: true });
  console.log(`[i] Done!`);
}

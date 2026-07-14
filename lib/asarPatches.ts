import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { readdirSync, statSync } from "fs";

export interface AsarReplacement {
  id: string;
  description: string;
  search: string | RegExp;
  replace: string;
}

function walkJsFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkJsFiles(full, files);
    } else if (entry.endsWith(".js")) {
      files.push(full);
    }
  }
  return files;
}

export function applyAsarReplacements(
  asarExtractedPath: string,
  replacements: AsarReplacement[],
): void {
  const browserDir = join(asarExtractedPath, "dist/renderer/browser");
  const files = walkJsFiles(browserDir);
  const applied = new Map<string, string[]>();

  for (const file of files) {
    let content = readFileSync(file, "utf8");
    let changed = false;

    for (const replacement of replacements) {
      const before = content;
      if (content.includes(replacement.replace)) {
        const hits = applied.get(replacement.id) ?? [];
        hits.push(file);
        applied.set(replacement.id, hits);
        continue;
      }

      if (typeof replacement.search === "string") {
        if (!content.includes(replacement.search)) {
          continue;
        }
        content = content.replaceAll(replacement.search, replacement.replace);
      } else {
        if (!replacement.search.test(content)) {
          replacement.search.lastIndex = 0;
          continue;
        }
        content = content.replace(replacement.search, replacement.replace);
        replacement.search.lastIndex = 0;
      }

      if (content !== before) {
        changed = true;
        const hits = applied.get(replacement.id) ?? [];
        hits.push(file);
        applied.set(replacement.id, hits);
      }
    }

    if (changed) {
      writeFileSync(file, content, "utf8");
    }
  }

  for (const replacement of replacements) {
    const hits = applied.get(replacement.id) ?? [];
    if (hits.length === 0) {
      console.warn(
        `[w] ASAR patch "${replacement.id}" did not match any files (${replacement.description})`,
      );
    } else {
      console.log(
        `[i] ASAR patch "${replacement.id}" applied in ${hits.length} file(s)`,
      );
    }
  }
}
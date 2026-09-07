import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Run the existing TypeScript services and Next route handlers with Node's test runner.
// Only the Next server-only marker is omitted outside the Next server runtime.
export function createProjectLoader(root) {
  const cache = new Map();
  function load(relativePath) {
    let filename = path.resolve(root, relativePath);
    if (!fs.existsSync(filename)) filename += ".ts";
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const packageRequire = createRequire(filename);
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
      fileName: filename,
    });
    function localRequire(specifier) {
      if (specifier === "server-only") return {};
      if (specifier.startsWith("@/")) return load(specifier.slice(2));
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(filename), specifier));
      return packageRequire(specifier);
    }
    new Function("require", "module", "exports", outputText)(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load;
}

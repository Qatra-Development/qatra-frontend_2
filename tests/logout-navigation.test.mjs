import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createProjectLoader(root);
const errors = load("src/lib/api/errors.ts");

function logoutHarness(endSession) {
  const navigation = [];
  const messages = [];
  const mocks = {
    react: {
      useRef: (value) => ({ current: value }),
      useState: (value) => [value, () => {}],
    },
    sonner: { toast: { success: (value) => messages.push(value), error: (value) => messages.push(value) } },
    "../client/session": { endAuthenticatedSession: endSession },
    "@/src/lib/api/errors": errors,
  };
  const source = fs.readFileSync(`${root}src/features/auth/hooks/use-logout.ts`, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const hookModule = { exports: {} };
  const window = { location: { replace: (url) => navigation.push(url) } };
  new Function("require", "module", "exports", "window", outputText)(
    (name) => {
      assert.ok(name in mocks, `Unexpected dependency: ${name}`);
      return mocks[name];
    }, hookModule, hookModule.exports, window,
  );
  return { ...hookModule.exports.useLogout(), navigation, messages };
}

test("logout requests a fresh public document only after session clearing completes", async () => {
  let finish;
  let calls = 0;
  const session = new Promise((resolve) => { finish = resolve; });
  const page = logoutHarness(() => { calls++; return session; });
  const first = page.handleLogout();
  await page.handleLogout();
  assert.equal(calls, 1);
  assert.deepEqual(page.navigation, []);
  finish();
  await first;
  assert.deepEqual(page.navigation, ["/"]);
  assert.equal(page.messages.length, 1);
});

test("backend revocation failure still reloads the public page when the route cleared cookies", async () => {
  const page = logoutHarness(async () => { throw new errors.ApiError("Revocation failed", "SERVER", 502); });
  await page.handleLogout();
  assert.deepEqual(page.navigation, ["/"]);
  assert.equal(page.messages.length, 1);
});

test("a network failure does not navigate while browser cookies may still be present", async () => {
  let calls = 0;
  const page = logoutHarness(async () => {
    if (++calls === 1) throw new errors.ApiError("Offline", "NETWORK");
  });
  await page.handleLogout();
  assert.deepEqual(page.navigation, []);
  await page.handleLogout();
  assert.deepEqual(page.navigation, ["/"]);
});

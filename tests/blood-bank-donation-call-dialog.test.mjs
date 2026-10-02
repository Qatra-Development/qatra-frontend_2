import assert from "node:assert/strict";
import fs from "node:fs";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createProjectLoader(root);
const service = load("src/features/blood-bank/donations/services/blood-bank-donation.service.ts");
let originalFetch, requests;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, method: options.method, body: JSON.parse(options.body) });
    return Response.json({ success: true, data: { id: 71 } });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}

function harness(overrides = {}) {
  const states = [], refs = [], messages = [];
  let stateIndex = 0, refIndex = 0, closed = 0, reset = 0;
  const element = (type, props) => ({ type, props });
  const mocks = {
    react: {
      useState(initial) {
        const index = stateIndex++;
        if (!(index in states)) states[index] = initial;
        return [states[index], (value) => { states[index] = value; }];
      },
      useRef(initial) {
        const index = refIndex++;
        return refs[index] ??= { current: initial === null ? { close() { closed++; }, showModal() {} } : initial };
      },
    },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "lucide-react": { CircleAlert: "CircleAlert" },
    "./icons/HospitalDashboardIcons": { Plus: "Plus" },
    sonner: { toast: { success: (message) => messages.push(message) } },
    "@/src/features/blood-bank/donations/services/blood-bank-donation.service": service,
    "@/src/features/blood-bank/donations/lib/donation.utils": load("src/features/blood-bank/donations/lib/donation.utils.ts"),
  };
  const source = fs.readFileSync(`${root}src/app/BloodBankDashboard/components/CreateDonationCallDialog.tsx`, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const loadedModule = { exports: {} };
  const fields = { title: "Urgent call", priority: "urgent", units_required: "3", date: "2099-10-02", time: "12:30", donation_location: "Blood bank", description: "Please donate", ...overrides };
  class FormFields { get(name) { return fields[name]; } }
  new Function("require", "module", "exports", "FormData", outputText)((name) => {
    assert.ok(name in mocks, name);
    return mocks[name];
  }, loadedModule, loadedModule.exports, FormFields);
  function render() {
    stateIndex = 0; refIndex = 0;
    return nodes(loadedModule.exports.default({ initialBloodType: "O+" }));
  }
  return {
    render, messages,
    get closed() { return closed; },
    get reset() { return reset; },
    submit() { return render().find((node) => node.type === "form").props.onSubmit({ preventDefault() {}, currentTarget: { reset() { reset++; } } }); },
  };
}

test("dashboard dialog publishes the selected fields through the donation-call POST endpoint", async () => {
  const page = harness();
  await page.submit();
  assert.deepEqual(requests, [{ url: "/api/backend/blood-bank/donation-calls", method: "POST", body: {
    title: "Urgent call", blood_type: "O+", units_required: 3, priority: "urgent",
    needed_at: new Date("2099-10-02T12:30:00").toISOString(), donation_location: "Blood bank", description: "Please donate",
  } }]);
  assert.equal(page.closed, 1);
  assert.equal(page.reset, 1);
  assert.equal(page.messages.length, 1);
});

test("invalid units or past dates block publication", async () => {
  for (const fields of [{ units_required: "1.5" }, { date: "2000-01-01" }, { title: " " }]) {
    const page = harness(fields);
    await page.submit();
    assert.ok(page.render().some((node) => node.props?.role === "alert"));
    assert.equal(page.closed, 0);
  }
  assert.equal(requests.length, 0);
});

test("pending publication blocks duplicate submissions and closing; backend failures preserve the form for retry", async () => {
  let finish, attempts = 0;
  globalThis.fetch = () => { attempts++; return new Promise((resolve) => { finish = resolve; }); };
  const page = harness();
  const pending = page.submit();
  assert.equal(page.render().find((node) => node.props?.type === "submit").props.disabled, true);
  await page.submit();
  assert.equal(attempts, 1);
  let prevented = false;
  page.render().find((node) => node.type === "dialog").props.onCancel({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  finish(Response.json({ success: false, message: "Publication rejected" }, { status: 422 }));
  await pending;
  assert.equal(page.closed, 0);
  assert.equal(page.reset, 0);
  assert.equal(page.render().find((node) => node.props?.role === "alert").props.children, "Publication rejected");
  assert.equal(page.render().find((node) => node.props?.type === "submit").props.disabled, false);
  globalThis.fetch = async () => Response.json({ success: true, data: { id: 71 } });
  await page.submit();
  assert.equal(page.closed, 1);
});

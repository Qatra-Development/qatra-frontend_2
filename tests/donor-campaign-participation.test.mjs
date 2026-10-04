import assert from "node:assert/strict";
import fs from "node:fs";
import { beforeEach, afterEach, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/app/donor/calls/page.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(`${source}\nexport { DonorCampaignContent };`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
});
let originalFetch;
let status;
let requests;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  requests = [];
  status = "registered";
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (options.method === "POST") return Response.json({ message: "Cancelled", data: { status: "cancelled" } });
    return Response.json({ data: [{
      id: 47, campaign_number: "CP-47", title: "Campaign", description: "Description",
      institution: { id: 8, name: "Hospital", type: "hospital" },
      start_date: "2026-10-02", end_date: "2026-10-03", start_time: "09:00", end_time: "15:00",
      governorate: "غزة", area: "الرمال", location: "Venue", target_count: 40,
      status: "active", blood_types: ["O+"], my_participation: status ? { status } : null,
    }], meta: { last_page: 1 } });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

function harness() {
  const states = [], refs = [], dependencies = [], cleanups = [], effects = [], timers = [];
  const listeners = new Map();
  const intervals = new Map();
  let index = 0, refIndex = 0, effectIndex = 0, nextId = 1;
  const element = (type, props) => ({ type, props });
  const hooks = {
    useState(initial) {
      const i = index++;
      if (!(i in states)) states[i] = initial;
      return [states[i], (value) => { states[i] = typeof value === "function" ? value(states[i]) : value; }];
    },
    useRef(initial) { const i = refIndex++; return refs[i] ??= { current: initial }; },
    useMemo: (factory) => factory(),
    useEffect(effect, deps) {
      const i = effectIndex++;
      if (!dependencies[i] || deps.some((value, j) => !Object.is(value, dependencies[i][j]))) {
        dependencies[i] = deps;
        effects.push(() => { cleanups[i]?.(); cleanups[i] = effect(); });
      }
    },
  };
  const mocks = {
    react: { __esModule: true, default: hooks, ...hooks },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "next/image": { __esModule: true, default: "Image" },
    "next/link": { __esModule: true, default: "Link" },
    sonner: { toast: { error() {}, success() {} } },
    "lucide-react": new Proxy({}, { get: (_, name) => String(name) }),
    "@/src/features/donor-dashboard/components/DonorHeader": { __esModule: true, default: "DonorHeader" },
    "@/src/features/donor-dashboard/services/donor.service": {},
    "@/src/config/api": { backendProxyUrl: (path) => `/api/backend${path}` },
  };
  const browser = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
    setInterval: (fn) => { const id = nextId++; intervals.set(id, fn); return id; },
    clearInterval: (id) => intervals.delete(id),
  };
  const module = { exports: {} };
  new Function("require", "module", "exports", "window", "document", "setTimeout", "clearTimeout", outputText)(
    (name) => { assert.ok(name in mocks, name); return mocks[name]; }, module, module.exports,
    browser, { ...browser, visibilityState: "visible" },
    (fn) => { timers.push(fn); return timers.length; }, () => {},
  );
  return {
    render() { index = 0; refIndex = 0; effectIndex = 0; return module.exports.DonorCampaignContent(); },
    async flush() {
      while (effects.length) effects.shift()();
      while (timers.length) await timers.shift()();
      await setImmediate();
    },
    refresh: () => { for (const fn of intervals.values()) fn(); },
    focus: () => listeners.get("focus")?.(),
    get polling() { return intervals.size; },
  };
}

function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
function text(tree) {
  if (tree == null || typeof tree === "boolean") return "";
  if (typeof tree !== "object") return String(tree);
  return Array.isArray(tree) ? tree.map(text).join("") : text(tree.props?.children);
}
const button = (tree, label) => nodes(tree).find((node) => node.type === "button" && text(node).trim() === label);
async function openCampaign(page) {
  page.render(); await page.flush();
  button(page.render(), "عرض تفاصيل الحملة").props.onClick();
  const tree = page.render(); await page.flush();
  return tree;
}

test("donated participation shows donation confirmation and removes cancellation", async () => {
  status = "donated";
  const page = harness();
  const tree = await openCampaign(page);
  assert.match(text(tree), /تم التبرع/);
  assert.doesNotMatch(text(tree), /أنت مسجل للمشاركة/);
  assert.equal(button(tree, "إلغاء مشاركتي"), undefined);
  assert.equal(button(tree, "أرغب بالمشاركة"), undefined);
  assert.equal(page.polling, 0);
});

test("registered and attended participation retain registration and cancellation", async () => {
  for (const current of ["registered", "attended"]) {
    status = current;
    const tree = await openCampaign(harness());
    assert.match(text(tree), /أنت مسجل للمشاركة/);
    assert.ok(button(tree, "إلغاء مشاركتي"));
  }
});

test("cancelled and absent participation retain the join action", async () => {
  for (const current of ["cancelled", null]) {
    status = current;
    const tree = await openCampaign(harness());
    assert.ok(button(tree, "أرغب بالمشاركة"));
    assert.equal(button(tree, "إلغاء مشاركتي"), undefined);
  }
});

test("hospital donation status refreshes while details stay open and polling stops", async () => {
  const page = harness();
  await openCampaign(page);
  assert.equal(page.polling, 1);
  status = "donated";
  page.refresh(); page.render(); await page.flush();
  const tree = page.render(); await page.flush();
  assert.match(text(tree), /تم التبرع/);
  assert.equal(button(tree, "إلغاء مشاركتي"), undefined);
  assert.equal(page.polling, 0);
});

test("returning to the page refreshes participation, and normal cancellation still posts", async () => {
  const page = harness();
  let tree = await openCampaign(page);
  await button(tree, "إلغاء مشاركتي").props.onClick();
  tree = page.render(); await page.flush();
  assert.ok(button(tree, "أرغب بالمشاركة"));
  assert.ok(requests.some(({ url, options }) => url.endsWith("/47/cancel-participation") && options.method === "POST"));
  status = "donated";
  page.focus(); page.render(); await page.flush();
  assert.match(text(page.render()), /تم التبرع/);
});

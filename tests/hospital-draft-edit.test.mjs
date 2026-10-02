import assert from "node:assert/strict";
import fs from "node:fs";
import { beforeEach, afterEach, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createProjectLoader(root);
const service = load("src/features/institution/blood-requests/services/blood-request.service.ts");
const draft = { id: 71, request_number: "BR-DRAFT-71", version: 3, status: "draft", status_label: "مسودة", blood_type: "O+", priority: "normal", priority_label: "عادي", units_required: 2, units_provided: 0, needed_at: "2099-10-02T12:00:00", description: "Hospital request", notes: "Keep notes", recipients: [{ blood_bank_id: 8, institution_name: "Blood bank" }] };
let originalFetch, requests, failPatch, failSubmit;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  requests = []; failPatch = false; failSubmit = false;
  globalThis.fetch = async (url, options) => {
    const body = options.body ? JSON.parse(options.body) : undefined;
    requests.push({ url, method: options.method, body });
    if (options.method === "PATCH") return failPatch ? Response.json({ success: false, message: "Update failed" }, { status: 422 }) : Response.json({ success: true, data: { ...draft, ...body, version: 4 } });
    if (url.endsWith("/submit")) return failSubmit ? Response.json({ success: false, message: "Submit failed" }, { status: 422 }) : Response.json({ success: true, data: { ...draft, version: 5, status: "pending", status_label: "بانتظار القبول" } });
    if (url.includes("/suppliers?")) return Response.json({ success: true, data: [{ id: 8, institution_name: "Blood bank", governorate: "غزة", address: "Address", available_units: 20 }], meta: {} });
    if (url.endsWith("/71")) return Response.json({ success: true, data: draft });
    return Response.json({ success: true, data: [draft], meta: { last_page: 1 } });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

function harness(options = {}) {
  const states = [], refs = [], deps = [], effects = [], cleanups = [], messages = [];
  let i = 0, r = 0, e = 0;
  let stored = JSON.stringify([{ id: draft.request_number, type: "O+", units: "0/2", urgency: "عادي", status: "مسودة", needed: "02/10/2099 - 12:00 pm", updated: "الآن", ...options }]);
  const storage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  const listeners = new Map();
  const browser = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name), dispatchEvent: (event) => listeners.get(event.type)?.() };
  const element = (type, props) => ({ type, props });
  const mocks = {
    react: {
      useState: (initial) => { const index = i++; if (!(index in states)) states[index] = initial; return [states[index], (value) => { states[index] = typeof value === "function" ? value(states[index]) : value; }]; },
      useRef: (initial) => { const index = r++; return refs[index] ??= { current: initial === null ? { close() {}, showModal() {} } : initial }; },
      useEffect: (effect, values) => { const index = e++; if (!deps[index] || values.some((value, j) => !Object.is(value, deps[index][j]))) { deps[index] = values; effects.push(() => { cleanups[index]?.(); cleanups[index] = effect(); }); } },
    },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "lucide-react": { BadgeCheck: "BadgeCheck", Heart: "Heart", MoreHorizontal: "MoreHorizontal", X: "X" },
    "../components/CreateBloodRequestDialog": { __esModule: true, default: "CreateBloodRequestDialog" },
    sonner: { toast: { success: (message) => messages.push(message), error: (message) => messages.push(message) } },
    "@/src/features/institution/blood-requests/services/blood-request.service": service,
    "@/src/features/institution/blood-requests/lib/blood-request.utils": load("src/features/institution/blood-requests/lib/blood-request.utils.ts"),
    "@/src/features/institution/blood-requests/schemas/blood-request.schema": load("src/features/institution/blood-requests/schemas/blood-request.schema.ts"),
  };
  const source = fs.readFileSync(`${root}src/app/HospitalDashboard/my-requests/page.tsx`, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const module = { exports: {} };
  new Function("require", "module", "exports", "localStorage", "window", outputText)((name) => { assert.ok(name in mocks, name); return mocks[name]; }, module, module.exports, storage, browser);
  return {
    messages,
    get stored() { return JSON.parse(stored); },
    render() { i = 0; r = 0; e = 0; return module.exports.default(); },
    async flush() { while (effects.length) effects.shift()(); await setImmediate(); },
  };
}
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
async function openEdit(page) {
  page.render(); await page.flush();
  nodes(page.render()).find((node) => node.type === "tr" && node.props.onClick).props.onClick();
  const buttons = nodes(page.render()).filter((node) => node.type === "button" && node.props.children === "تعديل الطلب");
  await buttons[0].props.onClick();
  page.render(); await page.flush();
  return nodes(page.render()).filter((node) => node.type === "button" && node.props.children === "تعديل الطلب").at(-1);
}

test("editing a draft saves real fields then submits the new server version and persists pending status", async () => {
  const page = harness();
  (await openEdit(page)).props.onClick();
  await page.flush();
  const mutations = requests.filter((request) => ["PATCH", "POST"].includes(request.method));
  assert.deepEqual(mutations.map((request) => [request.method, request.url]), [["PATCH", "/api/backend/institution/blood-requests/71"], ["POST", "/api/backend/institution/blood-requests/71/submit"]]);
  assert.equal(mutations[0].body.version, 3);
  assert.equal(mutations[0].body.notes, "Keep notes");
  assert.deepEqual(mutations[0].body.recipient_ids, [8]);
  assert.equal(mutations[1].body.version, 4);
  assert.equal(page.stored[0].status, "بانتظار القبول");
  assert.equal(page.stored[0].backendId, 71);
});

test("new cached drafts open by backend ID without searching the institution list", async () => {
  const page = harness({ backendId: 71 });
  await openEdit(page);
  assert.ok(requests.some((request) => request.url.endsWith("/blood-requests/71")));
  assert.equal(requests.some((request) => request.url.includes("blood-requests?")), false);
  assert.equal(page.messages.length, 0);
});

test("older cached drafts are found across explicit draft pages without request-number search", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (!url.includes("blood-requests?")) return normalFetch(url, options);
    requests.push({ url, method: options.method });
    const query = new URL(url, "http://localhost").searchParams;
    assert.equal(query.get("status"), "draft");
    assert.equal(query.has("search"), false);
    return Response.json({ success: true, data: query.get("page") === "1" ? [] : [draft], meta: { last_page: 2 } });
  };
  const page = harness();
  await openEdit(page);
  assert.equal(requests.filter((request) => request.url.includes("blood-requests?")).length, 2);
  assert.ok(requests.some((request) => request.url.endsWith("/blood-requests/71")));
  assert.equal(page.messages.length, 0);
});

test("a stale cache entry cannot open or edit another draft", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => url.includes("blood-requests?")
    ? Response.json({ success: true, data: [{ ...draft, id: 99, request_number: "BR-OTHER" }], meta: { last_page: 1 } })
    : normalFetch(url, options);
  const page = harness();
  await openEdit(page);
  assert.ok(page.messages.some((message) => message.includes("غير موجود")));
  assert.equal(requests.some((request) => request.url.endsWith("/71") || request.url.endsWith("/99")), false);
});

test("legacy timestamp drafts open locally and become real pending server requests after completion", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.includes("blood-requests?")) return Response.json({ success: true, data: [], meta: { last_page: 1 } });
    if (url.endsWith("/blood-requests") && options.method === "POST") {
      requests.push({ url, method: options.method, body: JSON.parse(options.body) });
      return Response.json({ success: true, data: { ...draft, request_number: "BR-SERVER-71", status: "pending", status_label: "بانتظار القبول" } });
    }
    return normalFetch(url, options);
  };
  const page = harness({ id: "BR-1789913479156" });
  await openEdit(page);
  assert.equal(page.messages.length, 0);
  assert.equal(requests.some((request) => request.url.endsWith("/71")), false);
  const tree = page.render();
  nodes(tree).find((node) => node.props?.id === "edit-request-reason").props.onChange({ target: { value: "Completed old draft" } });
  nodes(tree).find((node) => node.props?.name === "edit-request-supplier").props.onChange();
  nodes(page.render()).filter((node) => node.type === "button" && node.props.children === "تعديل الطلب").at(-1).props.onClick();
  await page.flush();
  assert.equal(requests.filter((request) => request.method === "POST").length, 1);
  assert.deepEqual(requests.find((request) => request.method === "POST").body.recipient_ids, [8]);
  assert.equal(page.stored.length, 1);
  assert.equal(page.stored[0].id, "BR-SERVER-71");
  assert.equal(page.stored[0].backendId, 71);
  assert.equal(page.stored[0].status, "بانتظار القبول");
});

test("failed creation leaves the legacy local draft and its original number intact", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.includes("blood-requests?")) return Response.json({ success: true, data: [], meta: { last_page: 1 } });
    if (url.endsWith("/blood-requests") && options.method === "POST") return Response.json({ success: false, message: "Creation failed" }, { status: 422 });
    return normalFetch(url, options);
  };
  const page = harness({ id: "BR-1789913479156", reason: "Stored reason", supplier: "Blood bank" });
  (await openEdit(page)).props.onClick();
  await page.flush();
  assert.equal(page.stored[0].id, "BR-1789913479156");
  assert.equal(page.stored[0].status, "مسودة");
  assert.ok(page.messages.includes("Creation failed"));
});

test("failed updates do not submit or relabel a draft", async () => {
  const page = harness();
  const button = await openEdit(page);
  failPatch = true; button.props.onClick(); await page.flush();
  assert.equal(requests.some((request) => request.url.endsWith("/submit")), false);
  assert.equal(page.stored[0].status, "مسودة");
  assert.ok(page.messages.includes("Update failed"));
});

test("failed submission keeps the draft and retry uses the updated version", async () => {
  const page = harness();
  const button = await openEdit(page);
  failSubmit = true; button.props.onClick(); await page.flush();
  assert.equal(page.stored[0].status, "مسودة");
  failSubmit = false;
  page.render(); await page.flush();
  nodes(page.render()).filter((node) => node.type === "button" && node.props.children === "تعديل الطلب").at(-1).props.onClick();
  await page.flush();
  assert.equal(requests.filter((request) => request.method === "PATCH").at(-1).body.version, 4);
  assert.equal(page.stored[0].status, "بانتظار القبول");
});

async function openDetails(page) {
  page.render(); await page.flush();
  nodes(page.render()).find((node) => node.type === "tr" && node.props.onClick).props.onClick();
  return nodes(page.render()).find((node) => node.type === "dialog" && node.props["aria-labelledby"] === "request-details-title");
}
const dialogButton = (tree, label) => nodes(tree).find((node) => node.type === "button" && node.props.children === label);

test("dialog actions follow draft, pending, completed, cancelled and ready states", async () => {
  for (const status of ["مسودة", "بانتظار القبول", "مكتمل", "ملغي", "جاهز للتسليم"]) {
    const dialog = await openDetails(harness({ status }));
    const editable = ["مسودة", "بانتظار القبول"].includes(status);
    assert.equal(Boolean(dialogButton(dialog, "تعديل الطلب")), editable, status);
    assert.equal(Boolean(dialogButton(dialog, "إلغاء الطلب")), editable, status);
    assert.equal(Boolean(dialogButton(dialog, "إغلاق")), ["مكتمل", "ملغي"].includes(status), status);
    assert.equal(Boolean(dialogButton(dialog, "تم الاستلام")), status === "جاهز للتسليم", status);
  }
});

test("pending edits save by PATCH without submitting the already submitted request again", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/71") && options.method === "GET") return Response.json({ success: true, data: { ...draft, status: "pending", status_label: "بانتظار القبول" } });
    if (options.method === "PATCH") {
      requests.push({ url, method: options.method, body: JSON.parse(options.body) });
      return Response.json({ success: true, data: { ...draft, version: 4, status: "pending", status_label: "بانتظار القبول" } });
    }
    return normalFetch(url, options);
  };
  const page = harness({ backendId: 71, status: "بانتظار القبول" });
  (await openEdit(page)).props.onClick(); await page.flush();
  assert.equal(requests.filter((request) => request.method === "PATCH").length, 1);
  assert.equal(requests.some((request) => request.url.endsWith("/submit")), false);
  assert.equal(page.stored[0].status, "بانتظار القبول");
});

test("server cancellation includes request version and reason and persists cancelled state", async () => {
  for (const status of ["مسودة", "بانتظار القبول"]) {
    const normalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
      if (url.endsWith("/71") && options.method === "GET") return Response.json({ success: true, data: { ...draft, status: status === "مسودة" ? "draft" : "pending" } });
      if (url.endsWith("/cancel")) {
        requests.push({ url, method: options.method, body: JSON.parse(options.body) });
        return Response.json({ success: true, data: { ...draft, status: "cancelled", status_label: "ملغي" } });
      }
      return normalFetch(url, options);
    };
    const page = harness({ backendId: 71, status });
    dialogButton(await openDetails(page), "إلغاء الطلب").props.onClick();
    nodes(page.render()).find((node) => node.props?.id === "cancellation-reason").props.onChange({ target: { value: "No longer needed" } });
    const dialog = nodes(page.render()).find((node) => node.type === "dialog" && node.props["aria-labelledby"] === "request-details-title");
    dialogButton(dialog, "إلغاء الطلب").props.onClick(); await page.flush();
    assert.deepEqual(requests.at(-1), { url: "/api/backend/institution/blood-requests/71/cancel", method: "POST", body: { version: 3, cancellation_reason: "No longer needed" } });
    assert.equal(page.stored[0].status, "ملغي");
    const closed = nodes(page.render()).find((node) => node.type === "dialog" && node.props["aria-labelledby"] === "request-details-title");
    assert.ok(dialogButton(closed, "إغلاق"));
    assert.equal(dialogButton(closed, "تعديل الطلب"), undefined);
  }
});

test("failed cancellation preserves the status and legacy draft cancellation stays local", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/cancel")) return Response.json({ success: false, message: "Cancellation failed" }, { status: 422 });
    if (url.includes("blood-requests?")) return Response.json({ success: true, data: [], meta: { last_page: 1 } });
    return normalFetch(url, options);
  };
  for (const legacy of [false, true]) {
    const page = harness(legacy ? { id: "BR-1789913479156" } : { backendId: 71 });
    dialogButton(await openDetails(page), "إلغاء الطلب").props.onClick();
    nodes(page.render()).find((node) => node.props?.id === "cancellation-reason").props.onChange({ target: { value: "Cancel" } });
    const dialog = nodes(page.render()).find((node) => node.type === "dialog" && node.props["aria-labelledby"] === "request-details-title");
    dialogButton(dialog, "إلغاء الطلب").props.onClick(); await page.flush();
    assert.equal(page.stored[0].status, legacy ? "ملغي" : "مسودة");
  }
});

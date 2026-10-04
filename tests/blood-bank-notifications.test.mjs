import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { beforeEach, afterEach, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createProjectLoader(root);
const service = load("src/app/BloodBankDashboard/notifications/notification-api.ts");
const record = { id: "notification-1", data: { title: "New donor", message: "A donor responded", href: "/BloodBankDashboard/donations/calls", action: "عرض المستجيبين" }, read_at: null, created_at: "2026-10-02T09:00:00Z" };
let originalFetch;
let requests;
let failMutation;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  requests = [];
  failMutation = false;
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    if (options.method === "POST") return failMutation ? Response.json({ message: "Rejected" }, { status: 500 }) : Response.json({ message: "Read" });
    if (url.endsWith("unread-count")) return Response.json({ unread_count: 1 });
    return Response.json({ data: [record], meta: { last_page: 1 } });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

test("notifications mapping preserves IDs, content, read state and safe dashboard links", () => {
  const item = service.toNotificationItem(record, new Date(record.created_at));
  assert.equal(item.id, record.id);
  assert.equal(item.title, "New donor");
  assert.equal(item.description, "A donor responded");
  assert.equal(item.href, record.data.href);
  assert.equal(item.unread, true);
  assert.equal(item.group, "today");
  const old = service.toNotificationItem({ ...record, read_at: "2026-10-02", created_at: "2026-09-01T09:00:00Z", data: { title: "Old", url: "javascript:alert(1)" } }, new Date(record.created_at));
  assert.equal(old.href, undefined);
  assert.equal(old.unread, false);
  assert.equal(old.group, "earlier");
  assert.ok(old.time);
});

test("loads all notification pages and documented unread count via authenticated proxy", async () => {
  const normalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("unread-count")) return normalFetch(url, options);
    requests.push({ url, options });
    return Response.json({ data: { data: [{ ...record, id: url.endsWith("page=1") ? "one" : "two" }], last_page: 2 } });
  };
  const items = await service.getNotifications();
  assert.deepEqual(items.map((item) => item.id), ["one", "two"]);
  assert.equal(await service.getUnreadCount(), 1);
  assert.deepEqual(requests.map((request) => request.url), ["/api/backend/notifications?page=1", "/api/backend/notifications?page=2", "/api/backend/notifications/unread-count"]);
  assert.ok(requests.every((request) => request.options.cache === "no-store"));
});

test("read actions use exact notification IDs and documented POST endpoints", async () => {
  await service.readNotification("id/with space");
  await service.readAllNotifications();
  assert.deepEqual(requests.map((request) => [request.url, request.options.method]), [["/api/backend/notifications/id%2Fwith%20space/read", "POST"], ["/api/backend/notifications/read-all", "POST"]]);
});

function pageHarness() {
  const states = [], refs = [], effects = [], messages = [];
  let index = 0, refIndex = 0, mounted = false;
  const mocks = {
    react: {
      useState: (initial) => { const i = index++; if (!(i in states)) states[i] = initial; return [states[i], (value) => { states[i] = typeof value === "function" ? value(states[i]) : value; }]; },
      useRef: (initial) => { const i = refIndex++; return refs[i] ??= { current: initial }; },
      useEffect: (effect) => { if (!mounted) effects.push(effect); },
    },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
    sonner: { toast: { error: (message) => messages.push(message) } },
    "@/src/components/notifications/NotificationsCenter": { __esModule: true, default: "NotificationsCenter" },
    "@/src/lib/api/errors": load("src/lib/api/errors.ts"),
    "./notification-api": service,
  };
  const source = fs.readFileSync(`${root}src/app/BloodBankDashboard/notifications/page.tsx`, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const module = { exports: {} };
  const require = createRequire(import.meta.url);
  new Function("require", "module", "exports", outputText)((name) => mocks[name] ?? require(name), module, module.exports);
  return {
    messages,
    render: () => { index = 0; refIndex = 0; const tree = module.exports.default(); mounted = true; return tree; },
    mount: () => effects.map((effect) => effect()),
  };
}

test("bank page loads real notifications, preserves existing presentation props and updates after success", async () => {
  const page = pageHarness();
  page.render();
  page.mount();
  await setImmediate();
  const tree = page.render();
  assert.equal(tree.props.dashboardKey, "blood-bank");
  assert.equal(tree.props.description, "الإشعارات الخاصة بنداءات التبرع والمواعيد ومخزون الدم");
  assert.equal(tree.props.notifications[0].title, "New donor");
  assert.equal(tree.props.unreadCount, 1);
  await tree.props.onRead(record.id);
  assert.equal(page.render().props.notifications[0].unread, false);
  assert.equal(page.render().props.unreadCount, 0);
  await tree.props.onRead(record.id);
  assert.equal(requests.filter((request) => request.options.method === "POST").length, 1);
});

test("failed read keeps notification unread and read-all updates state only on success", async () => {
  const page = pageHarness();
  page.render(); page.mount(); await setImmediate();
  failMutation = true;
  await page.render().props.onRead(record.id);
  assert.equal(page.render().props.notifications[0].unread, true);
  assert.equal(page.render().props.unreadCount, 1);
  await page.render().props.onReadAll();
  assert.equal(page.render().props.unreadCount, 1);
  assert.equal(page.messages.length, 2);
  failMutation = false;
  await page.render().props.onReadAll();
  assert.equal(page.render().props.notifications[0].unread, false);
  assert.equal(page.render().props.unreadCount, 0);
});

test("authentication and malformed responses propagate without fake notifications", async () => {
  globalThis.fetch = async () => Response.json({ message: "Login required" }, { status: 401 });
  await assert.rejects(service.getNotifications(), /Login required/);
  globalThis.fetch = async () => Response.json({ data: [{ data: {} }] });
  await assert.rejects(service.getNotifications(), /معرّفات/);
  globalThis.fetch = async () => Response.json({ unread_count: "5" });
  await assert.rejects(service.getUnreadCount(), /عدد الإشعارات/);
});

test("shared center retains local reading for other dashboards and delegates bank reading", () => {
  const require = createRequire(import.meta.url);
  const source = fs.readFileSync(`${root}src/components/notifications/NotificationsCenter.tsx`, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  function centerHarness() {
    const states = [];
    let index = 0;
    const element = (type, props) => ({ type, props });
    const mocks = {
      react: { useState: (initial) => { const i = index++; if (!(i in states)) states[i] = initial; return [states[i], (value) => { states[i] = typeof value === "function" ? value(states[i]) : value; }]; } },
      "react/jsx-runtime": { jsx: element, jsxs: element },
      "next/link": { __esModule: true, default: "Link" },
      "lucide-react": new Proxy({}, { get: (_, name) => String(name) }),
    };
    const module = { exports: {} };
    new Function("require", "module", "exports", outputText)((name) => mocks[name] ?? require(name), module, module.exports);
    return (props) => { index = 0; return module.exports.default(props); };
  }
  function nodes(tree) {
    if (!tree || typeof tree !== "object") return [];
    if (Array.isArray(tree)) return tree.flatMap(nodes);
    return [tree, ...nodes(tree.props?.children)];
  }
  function button(tree, label) { return nodes(tree).find((node) => node.type === "button" && nodes(node.props.children).some((child) => child.props?.children === label)); }
  const item = service.toNotificationItem(record, new Date(record.created_at));
  const props = { dashboardKey: "hospital", notifications: [item] };
  const render = centerHarness();
  let tree = render(props);
  const readAll = nodes(tree).find((node) => node.type === "button" && Array.isArray(node.props.children) && node.props.children.includes("تحديد الكل كمقروء"));
  readAll.props.onClick();
  tree = render(props);
  assert.equal(nodes(tree).find((node) => node.type === "button" && Array.isArray(node.props.children) && node.props.children.includes("تحديد الكل كمقروء")).props.disabled, true);
  const bank = centerHarness();
  let calls = 0;
  const bankProps = { ...props, dashboardKey: "blood-bank", unreadCount: 1, onRead: async () => {}, onReadAll: async () => { calls++; } };
  tree = bank(bankProps);
  button(tree, "غير المقروءة").props.onClick();
  tree = bank(bankProps);
  nodes(tree).find((node) => node.type === "button" && Array.isArray(node.props.children) && node.props.children.includes("تحديد الكل كمقروء")).props.onClick();
  assert.equal(calls, 1);
  const updated = { ...bankProps, unreadCount: 0, notifications: [{ ...item, unread: false }] };
  bank(updated);
  tree = bank(updated);
  assert.match(button(tree, "غير المقروءة").props.className, /bg-\[#e8f3f1\]/);
});

import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { setImmediate } from "node:timers/promises";
import ts from "typescript";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = createProjectLoader(root);
const services = load("src/features/blood-bank/donations/services/campaign.service.ts");
const api = load("src/lib/api/client.ts");
const packageRequire = createRequire(import.meta.url);
const campaign = {
  id: 47, campaign_number: "CP-2026-0047", title: "API campaign", description: "API description",
  status: "published", start_date: "2026-10-10", end_date: "2026-10-11", start_time: "09:00", end_time: "15:00",
  governorate: "غزة", area: "الرمال", location: "API venue", target_count: 40, notes: "API notes", blood_types: ["O+"],
  institution: { id: 8, name: "API institution" },
};
const values = {
  name: "New title", description: "New description", startDate: "2026-10-10", endDate: "2026-10-11",
  startTime: "09:00", endTime: "15:00", governorate: "غزة", region: "الرمال", address: "New venue", targetCount: "40", notes: "New notes",
};
let originalFetch;
let requests;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, method: options.method, body: options.body ? JSON.parse(options.body) : undefined });
    return Response.json({ data: { id: 88 }, message: "Saved" });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

// Exercise the actual page handlers while replacing only React's rendering
// state and data hooks. API requests still use the project client/services.
function pageHarness(filename, pathname) {
  const states = [];
  const refs = [];
  let stateIndex = 0;
  let refIndex = 0;
  let reloads = 0;
  const enables = [];
  const messages = [];
  const reload = () => { reloads += 1; };
  const detailData = { campaign, loading: false, error: null, reload };
  const participantData = {
    participants: [{ id: 91, status: "registered", donor: { id: 1007, donor_number: "D-1007", name: "API donor", blood_type: "O+", region: "غزة" } }],
    loaded: true, loading: false, error: null, reload,
  };
  const listData = { campaigns: [campaign, { ...campaign, id: 88, status: "draft" }], stats: { upcoming_campaigns: 3, registered_participants: 18, verified_donations: 8 }, loading: false, error: null, reload };
  const element = (type, props, key) => ({ type, props, key });
  const mocks = {
    react: {
      useState: (initial) => {
        const index = stateIndex++;
        if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
        return [states[index], (value) => { states[index] = typeof value === "function" ? value(states[index]) : value; }];
      },
      useRef: (initial) => { const index = refIndex++; return refs[index] ??= { current: initial }; },
    },
    "react/jsx-runtime": { jsx: element, jsxs: element },
    "next/navigation": { usePathname: () => pathname },
    "next/link": { __esModule: true, default: "Link" },
    "lucide-react": new Proxy({}, { get: (_, name) => String(name) }),
    sonner: { toast: { success: (message) => messages.push(message), error: (message) => messages.push(message) } },
    "../hooks/useInstitutionCampaigns": { useInstitutionCampaigns: (enabled) => { enables.push(enabled); return listData; } },
    "../hooks/useInstitutionCampaign": { useInstitutionCampaign: (_, enabled) => { enables.push(enabled); return detailData; } },
    "../hooks/useCampaignParticipants": { useCampaignParticipants: (_, enabled) => { enables.push(enabled); return participantData; } },
    "../services/campaign.service": services,
    "@/src/lib/api/client": api,
    "@/src/config/api": load("src/config/api.ts"),
    "@/src/lib/api/errors": load("src/lib/api/errors.ts"),
  };
  const source = fs.readFileSync(`${root}src/features/blood-bank/donations/components/${filename}.tsx`, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const loadedModule = { exports: {} };
  class FormDataFromForm { constructor(form) { this.values = form.values; } entries() { return Object.entries(this.values)[Symbol.iterator](); } }
  new Function("require", "module", "exports", "FormData", outputText)((name) => mocks[name] ?? packageRequire(name), loadedModule, loadedModule.exports, FormDataFromForm);
  return {
    enables, messages, detailData, participantData, listData,
    get reloads() { return reloads; },
    render: () => { stateIndex = 0; refIndex = 0; return loadedModule.exports.default({ campaignNumber: "47", campaignsHref: pathname.split("/donations/")[0] + "/donations/campaigns" }); },
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
  if (Array.isArray(tree)) return tree.map(text).join("");
  return text(tree.props?.children);
}
const button = (tree, label) => nodes(tree).find((node) => node.type === "button" && text(node).trim() === label);
async function submit(tree) {
  const form = nodes(tree).find((node) => node.type === "form");
  form.props.onSubmit({ preventDefault() {}, currentTarget: { values, reportValidity: () => true } });
  await setImmediate();
}

for (const dashboard of ["BloodBankDashboard", "HospitalDashboard"]) {
  const base = `/${dashboard}/donations/campaigns`;
  test(`${dashboard}: each single field can be saved and resumed without publication validation`, async () => {
    for (const field of [...Object.keys(values), "bloodTypes"]) {
      const page = pageHarness("DonationCampaignsPage", base);
      button(page.render(), "إنشاء حملة").props.onClick();
      const partialValues = Object.fromEntries(Object.keys(values).map((key) => [key, key === field ? values[key] : ""]));
      if (field === "bloodTypes") button(page.render(), "O+").props.onClick();
      const form = { values: partialValues, reportValidity: () => { throw new Error("Drafts must skip validity checks"); } };
      const previousRequests = requests.length;
      button(page.render(), "حفظ كمسودة").props.onClick({ currentTarget: { form } });
      await setImmediate();
      assert.equal(requests.length, previousRequests + 1, field);
      assert.equal(requests.at(-1).body.status, "draft");
      assert.equal(page.messages.length, 1);
      button(page.render(), "آخر مسودة").props.onClick();
      const tree = page.render();
      for (const [key, value] of Object.entries(partialValues)) {
        assert.equal(nodes(tree).find((node) => node.props?.name === key).props.defaultValue, value, key);
      }
      button(tree, "حفظ كمسودة").props.onClick({ currentTarget: { form } });
      await setImmediate();
      assert.equal(requests.at(-1).method, "PATCH");
      assert.equal(requests.at(-1).url, "/api/backend/blood-bank/campaigns/88");
    }
  });

  test(`${dashboard}: incomplete server drafts reopen, cleared fields persist, and publishing still validates`, async () => {
    const page = pageHarness("DonationCampaignsPage", base);
    page.listData.campaigns.push({ ...campaign, id: 99, status: "draft", updated_at: "2026-10-02T12:00:00Z", title: null, description: null, start_date: null, start_time: null, governorate: null, area: null, location: null, blood_types: null, notes: "Only notes" });
    button(page.render(), "آخر مسودة").props.onClick();
    let tree = page.render();
    assert.equal(nodes(tree).find((node) => node.props?.name === "startDate").props.defaultValue, "");
    assert.equal(nodes(tree).find((node) => node.props?.name === "notes").props.defaultValue, "Only notes");
    const partialValues = Object.fromEntries(Object.keys(values).map((key) => [key, key === "notes" ? "Only notes" : ""]));
    const form = { values: partialValues, reportValidity: () => false };
    nodes(tree).find((node) => node.type === "form").props.onSubmit({ preventDefault() {}, currentTarget: form });
    await setImmediate();
    assert.equal(requests.length, 0);
    button(tree, "حفظ كمسودة").props.onClick({ currentTarget: { form } });
    await setImmediate();
    assert.equal(requests[0].url, "/api/backend/blood-bank/campaigns/99");
    assert.equal(requests[0].body.end_date, null);
    assert.equal(requests[0].body.end_time, null);
    assert.equal(requests[0].body.target_count, null);
    tree = page.render();
    button(tree, "آخر مسودة").props.onClick();
    assert.equal(nodes(page.render()).find((node) => node.props?.name === "notes").props.defaultValue, "Only notes");
  });

  test(`${dashboard}: API list, stats, real links, creation and persisted draft publishing`, async () => {
    const page = pageHarness("DonationCampaignsPage", base);
    let tree = page.render();
    assert.ok(page.enables.every(Boolean));
    assert.match(text(tree), /API campaign/);
    assert.deepEqual(nodes(tree).filter((node) => node.type === "Link").map((node) => node.props.href), [`${base}/47`, `${base}/47/participants`]);
    button(tree, "إنشاء حملة").props.onClick();
    tree = page.render();
    button(tree, "O+").props.onClick();
    await submit(page.render());
    assert.equal(requests[0].url, "/api/backend/blood-bank/campaigns");
    assert.equal(requests[0].method, "POST");
    assert.equal(requests[0].body.status, "published");
    assert.deepEqual(requests[0].body.blood_types, ["O+"]);
    tree = page.render();
    button(tree, "آخر مسودة").props.onClick();
    await submit(page.render());
    assert.equal(requests[1].url, "/api/backend/blood-bank/campaigns/88");
    assert.equal(requests[1].method, "PATCH");
    assert.equal(requests[1].body.status, "published");
    assert.equal(page.reloads, 2);
  });

  test(`${dashboard}: draft save, API details, editing and confirmed cancellation`, async () => {
    const list = pageHarness("DonationCampaignsPage", base);
    button(list.render(), "إنشاء حملة").props.onClick();
    button(list.render(), "O+").props.onClick();
    const form = { values, reportValidity: () => true };
    button(list.render(), "حفظ كمسودة").props.onClick({ currentTarget: { form } });
    await setImmediate();
    assert.equal(requests[0].body.status, "draft");

    const details = pageHarness("InstitutionCampaignDetailsPage", `${base}/47`);
    let tree = details.render();
    assert.ok(details.enables.every(Boolean));
    assert.match(text(tree), /API campaign/);
    assert.match(text(tree), /API institution/);
    button(tree, "تعديل الحملة").props.onClick();
    await submit(details.render());
    assert.equal(requests[1].url, "/api/backend/blood-bank/campaigns/47");
    assert.equal(requests[1].method, "PATCH");
    assert.equal(requests[1].body.title, "New title");
    button(details.render(), "إلغاء الحملة").props.onClick();
    button(details.render(), "تأكيد الإلغاء").props.onClick();
    await setImmediate();
    assert.equal(requests[2].url, "/api/backend/blood-bank/campaigns/47/cancel");
    assert.equal(requests[2].method, "POST");
    assert.equal(details.reloads, 2);
  });

  test(`${dashboard}: participants and donation dialog use the participation ID and refresh both datasets`, async () => {
    const page = pageHarness("InstitutionCampaignParticipantsPage", `${base}/47/participants`);
    let tree = page.render();
    assert.ok(page.enables.every(Boolean));
    assert.match(text(tree), /API donor/);
    button(tree, "تسجيل التبرع").props.onClick();
    await submit(page.render());
    assert.equal(requests[0].url, "/api/backend/blood-bank/campaigns/47/participants/91/record-donation");
    assert.equal(requests[0].method, "POST");
    assert.match(requests[0].body.collected_at, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(page.reloads, 2);
    tree = page.render();
    assert.equal(nodes(tree).some((node) => node.props?.role === "dialog"), false);
  });
}

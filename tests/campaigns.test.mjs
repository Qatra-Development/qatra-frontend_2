import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const load = createProjectLoader(fileURLToPath(new URL("../", import.meta.url)));
const services = load("src/features/blood-bank/donations/services/campaign.service.ts");
const json = (payload, status = 200) => Response.json(payload, { status });
let originalFetch;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Unexpected network call"); };
});
afterEach(() => { globalThis.fetch = originalFetch; });

test("details resolve the real campaign ID across institution pages, including cancelled campaigns", async () => {
  const paths = [];
  const signal = new AbortController().signal;
  globalThis.fetch = async (url, options) => {
    paths.push(url);
    assert.equal(options.signal, signal);
    assert.equal(options.cache, "no-store");
    return json({
      data: url.endsWith("page=1") ? [{ id: 2, title: "Another campaign" }] : [{ id: 47, title: "Selected campaign", status: "cancelled" }],
      meta: { last_page: 2 },
    });
  };
  const campaign = await services.getInstitutionCampaign("47", signal);
  assert.equal(campaign.title, "Selected campaign");
  assert.equal(campaign.status, "cancelled");
  assert.deepEqual(paths, ["/api/backend/blood-bank/campaigns?page=1", "/api/backend/blood-bank/campaigns?page=2"]);
});

test("missing campaigns produce an error rather than another campaign's details", async () => {
  globalThis.fetch = async () => json({ data: [{ id: 1 }], meta: { last_page: 1 } });
  await assert.rejects(services.getInstitutionCampaign(47), /غير موجودة/);
});

test("all participant pages preserve participation IDs, donor IDs and API statuses", async () => {
  const paths = [];
  globalThis.fetch = async (url) => {
    paths.push(url);
    return json({
      data: url.endsWith("page=1")
        ? [{ id: 91, status: "attended", donor: { id: 1007, name: "Test donor" } }]
        : [{ id: 92, status: "donated", donor: { id: 1008 } }],
      meta: { last_page: 2 },
    });
  };
  const participants = await services.getCampaignParticipants(47);
  assert.deepEqual(participants.map((item) => [item.id, item.donor.id, item.status]), [[91, 1007, "attended"], [92, 1008, "donated"]]);
  assert.equal(paths[1], "/api/backend/blood-bank/campaigns/47/participants?page=2");
});

test("donation recording uses participation ID and documented collection date without inventing unit metadata", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/backend/blood-bank/campaigns/47/participants/91/record-donation");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), { collected_at: "2026-10-01" });
    return json({ message: "Recorded" });
  };
  assert.equal((await services.recordCampaignDonation(47, 91, "2026-10-01")).message, "Recorded");
});

test("editing patches documented fields, preserves status and allows clearing optional dates", async () => {
  const payload = { title: "Updated", start_date: "2026-10-10", end_date: null, end_time: null, blood_types: ["O+"] };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/backend/blood-bank/campaigns/47");
    assert.equal(options.method, "PATCH");
    assert.deepEqual(JSON.parse(options.body), payload);
    assert.equal("status" in JSON.parse(options.body), false);
    return json({ message: "Saved" });
  };
  await services.updateInstitutionCampaign(47, payload);
});

test("cancellation is posted to the selected campaign and propagates backend errors", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/backend/blood-bank/campaigns/47/cancel");
    assert.equal(options.method, "POST");
    return json({ success: false, message: "Cancellation rejected" });
  };
  await assert.rejects(services.cancelInstitutionCampaign(47), /Cancellation rejected/);
});

test("authentication failures and malformed participant responses are surfaced", async () => {
  globalThis.fetch = async () => json({ message: "Unauthenticated" }, 401);
  await assert.rejects(services.getCampaignParticipants(47), /Unauthenticated/);
  globalThis.fetch = async () => json({ data: [{ status: "registered", donor: { id: 1007 } }] });
  await assert.rejects(services.getCampaignParticipants(47), /استجابة المشاركين/);
  globalThis.fetch = async () => json({ data: [] });
  assert.deepEqual(await services.getCampaignParticipants(47), []);
});

import assert from "node:assert/strict";
import { beforeEach, afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createProjectLoader } from "./helpers/load-project-module.mjs";

const load = createProjectLoader(fileURLToPath(new URL("../", import.meta.url)));
const { institutionDetailsSchema, institutionDocumentSchema, institutionRegistrationSchema } = load("src/features/auth/schemas/institution-registration.schema.ts");
const { INSTITUTION_DOCUMENTS, INSTITUTION_FIELD_MAP, INSTITUTION_TYPES, SERVICE_SCOPES, MAX_DOCUMENT_BYTES } = load("src/features/auth/constants/institution-registration.ts");
const { buildInstitutionFormData, readInstitutionFormData } = load("src/features/auth/services/institution-registration-payload.ts");
const { apiClient } = load("src/lib/api/client.ts");
const { ApiError, getApiErrorMessage } = load("src/lib/api/errors.ts");
const services = load("src/features/auth/services/auth.service.ts");
const { POST: register } = load("src/app/api/auth/register/health-institution/route.ts");
const { POST: verify } = load("src/app/api/auth/verify-health-institution/route.ts");
const { POST: resend } = load("src/app/api/auth/resend-health-institution-verification-code/route.ts");
const details = {
  institutionName: "مستشفى الاختبار", institutionType: "central_hospital", licenseNumber: "LIC-1001",
  address: "Gaza City", governorate: "Gaza", representativeName: "أحمد علي", phone: "0591234567",
  email: "hospital@example.test", password: "Password123", passwordConfirmation: "Password123",
};
const pdf = () => new File(["%PDF-1.4\nTest document"], "license.pdf", { type: "application/pdf" });
const registration = () => ({ ...details, serviceScope: "blood_request_only", documents: Object.fromEntries(INSTITUTION_DOCUMENTS.map(({ field }) => [field, pdf()])) });
const multipartRequest = (body) => new Request("http://localhost/api/auth/register/health-institution", { method: "POST", body });
const jsonRequest = (body) => new Request("http://localhost/api/auth/verify-health-institution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
let originalFetch;
let originalEnv;

beforeEach(() => {
  originalFetch = globalThis.fetch;
  originalEnv = process.env.API_URL;
  process.env.API_URL = "https://backend.example.test/api";
  globalThis.fetch = async () => { throw new Error("Unexpected network call in test"); };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalEnv === undefined) delete process.env.API_URL;
  else process.env.API_URL = originalEnv;
});

test("institution types and service scopes use the API enums", () => {
  for (const { value } of INSTITUTION_TYPES) assert.equal(institutionDetailsSchema.safeParse({ ...details, institutionType: value }).success, true);
  for (const { value } of SERVICE_SCOPES) assert.equal(institutionRegistrationSchema.safeParse({ ...registration(), serviceScope: value }).success, true);
  for (const institutionType of ["hospital", "medical_center", "clinic", "lab"]) assert.equal(institutionDetailsSchema.safeParse({ ...details, institutionType }).success, false);
  for (const serviceScope of ["hospital_with_bank", "central_bank"]) assert.equal(institutionRegistrationSchema.safeParse({ ...registration(), serviceScope }).success, false);
});

test("details require every field, matching passwords and a valid phone/email", () => {
  for (const field of Object.keys(details)) assert.equal(institutionDetailsSchema.safeParse({ ...details, [field]: "" }).success, false, field);
  for (const changes of [{ passwordConfirmation: "different" }, { phone: "0571234567" }, { email: "invalid" }, { password: "12345678", passwordConfirmation: "12345678" }]) {
    assert.equal(institutionDetailsSchema.safeParse({ ...details, ...changes }).success, false);
  }
  assert.equal(institutionDetailsSchema.parse({ ...details, institutionName: " Test Hospital " }).institutionName, "Test Hospital");
});

test("all four documents are required, including quality and commercial registration", () => {
  for (const { field } of INSTITUTION_DOCUMENTS) {
    const data = registration();
    delete data.documents[field];
    assert.equal(institutionRegistrationSchema.safeParse(data).success, false, field);
  }
});

test("documents allow PDF/JPEG/PNG, reject empty and oversized files", () => {
  for (const type of ["application/pdf", "image/jpeg", "image/png"]) assert.equal(institutionDocumentSchema.safeParse(new File(["test"], "document", { type })).success, true);
  for (const file of [new File([], "empty.pdf", { type: "application/pdf" }), new File(["test"], "bad.txt", { type: "text/plain" }), "file-name-only.pdf", new File([new Uint8Array(MAX_DOCUMENT_BYTES + 1)], "big.pdf", { type: "application/pdf" })]) {
    assert.equal(institutionDocumentSchema.safeParse(file).success, false);
  }
  assert.equal(institutionDocumentSchema.safeParse(new File([new Uint8Array(MAX_DOCUMENT_BYTES)], "limit.pdf", { type: "application/pdf" })).success, true);
});

test("serialization preserves canonical field names, file names, MIME types and bytes", async () => {
  const data = registration();
  const body = buildInstitutionFormData(data);
  assert.equal([...body.keys()].length, 15);
  for (const [field, apiField] of Object.entries(INSTITUTION_FIELD_MAP)) assert.equal(body.get(apiField), data[field]);
  assert.equal(body.get("service_scope"), data.serviceScope);
  const decoded = institutionRegistrationSchema.parse(readInstitutionFormData(await multipartRequest(body).formData()));
  assert.equal(decoded.passwordConfirmation, details.password);
  for (const { field } of INSTITUTION_DOCUMENTS) {
    assert.equal(decoded.documents[field].name, data.documents[field].name);
    assert.equal(decoded.documents[field].type, "application/pdf");
    assert.equal(await decoded.documents[field].text(), await data.documents[field].text());
  }
});

test("client sends FormData without a manual boundary and retains JSON support", async () => {
  let calls = 0;
  globalThis.fetch = async (endpoint, options) => {
    calls++;
    if (calls === 1) {
      assert.ok(options.body instanceof FormData);
      assert.equal(options.headers.has("Content-Type"), false);
      assert.equal(options.headers.get("Accept"), "application/json");
    } else {
      assert.equal(options.headers.get("Content-Type"), "application/json");
      assert.deepEqual(JSON.parse(options.body), { email: details.email });
    }
    return Response.json({ success: true });
  };
  await apiClient("/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: buildInstitutionFormData(registration()) });
  await apiClient("/json", { method: "POST", body: { email: details.email } });
  assert.equal(calls, 2);
});

test("registration service and BFF forward one multipart request with four files", async () => {
  let calls = 0;
  globalThis.fetch = async (endpoint, options) => {
    calls++;
    if (endpoint.startsWith("/api/")) return register(multipartRequest(options.body));
    assert.equal(endpoint, "https://backend.example.test/api/auth/register/health-institution");
    assert.equal(options.method, "POST");
    assert.equal(new Headers(options.headers).has("Content-Type"), false);
    assert.equal(institutionRegistrationSchema.safeParse(readInstitutionFormData(options.body)).success, true);
    return Response.json({ success: true, message: "Verification code sent" }, { status: 201 });
  };
  const result = await services.registerInstitution(registration());
  assert.equal(result.success, true);
  assert.equal(calls, 2);
});

test("BFF rejects malformed bodies and missing documents before contacting backend", async () => {
  assert.equal((await register(jsonRequest({}))).status, 400);
  const body = buildInstitutionFormData(registration());
  body.delete("quality_safety_certificate_document");
  const result = await register(multipartRequest(body));
  assert.equal(result.status, 422);
  assert.ok((await result.json()).errors.quality_safety_certificate_document);
});

test("backend validation and rate-limit errors reach the form intact", async () => {
  for (const status of [422, 429]) {
    const errors = { email: ["البريد مستخدم مسبقًا"], practice_license_document: ["مستند غير صالح"] };
    globalThis.fetch = async () => Response.json({ success: false, message: "Request rejected", errors }, { status });
    const response = await register(multipartRequest(buildInstitutionFormData(registration())));
    assert.equal(response.status, status);
    assert.deepEqual((await response.json()).errors, errors);
  }
});

test("institution verification/resend use their dedicated API endpoints; donor endpoints remain separate", async () => {
  const endpoints = [];
  globalThis.fetch = async (endpoint, options) => {
    endpoints.push(endpoint);
    assert.equal(JSON.parse(options.body).email, details.email);
    return Response.json({ success: true });
  };
  assert.equal((await verify(jsonRequest({ email: details.email, code: "1234" }))).status, 200);
  assert.equal((await resend(jsonRequest({ email: details.email }))).status, 200);
  await services.verifyInstitutionEmail({ email: details.email, code: "1234" });
  await services.resendInstitutionVerificationCode({ email: details.email });
  await services.verifyDonorEmail({ email: details.email, code: "1234" });
  await services.resendDonorVerificationCode({ email: details.email });
  assert.deepEqual(endpoints, [
    "https://backend.example.test/api/auth/verify-health-institution",
    "https://backend.example.test/api/auth/resend-health-institution-verification-code",
    "/api/auth/verify-health-institution", "/api/auth/resend-health-institution-verification-code",
    "/api/auth/verify-email", "/api/auth/resend-verification-code",
  ]);
  assert.equal((await verify(jsonRequest({ email: details.email, code: "12" }))).status, 422);
});

test("client presents specific field errors instead of losing the backend explanation", async () => {
  globalThis.fetch = async () => Response.json({ message: "Validation failed", errors: { email: ["البريد مستخدم مسبقًا"] } }, { status: 422 });
  await assert.rejects(services.registerInstitution(registration()), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, 422);
    assert.equal(getApiErrorMessage(error), "البريد مستخدم مسبقًا");
    return true;
  });
});

test("invalid successful backend payloads cannot confirm registration or email verification", async () => {
  for (const payload of [null, [], {}, { success: "false" }, "<html>Upstream error</html>"]) {
    globalThis.fetch = async () => typeof payload === "string"
      ? new Response(payload, { headers: { "Content-Type": "text/html" } })
      : Response.json(payload);
    const registrationResponse = await register(multipartRequest(buildInstitutionFormData(registration())));
    const verificationResponse = await verify(jsonRequest({ email: details.email, code: "1234" }));
    assert.equal(registrationResponse.status, 502);
    assert.equal(verificationResponse.status, 502);
    assert.equal((await registrationResponse.json()).success, false);
    assert.equal((await verificationResponse.json()).success, false);
  }
});

test("a logical rejection with HTTP 200 retains validation errors", async () => {
  const errors = { code: ["رمز التحقق غير صحيح."] };
  globalThis.fetch = async () => Response.json({ success: false, message: "Validation failed", errors });
  for (const route of [verify, resend]) {
    const response = await route(jsonRequest({ email: details.email, code: "1234" }));
    assert.equal(response.status, 422);
    assert.deepEqual((await response.json()).errors, errors);
  }
});

import "server-only";

import { ApiError, errorCodeForStatus } from "./errors";

const DEFAULT_BACKEND_ERROR = "تعذر الاتصال بخدمة الخادم. يرجى المحاولة لاحقًا.";

function backendBaseUrl(): string {
  const baseUrl = process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!baseUrl) {
    console.error("API_URL is not configured. Set it in the project root .env.local file.");
    throw new ApiError("خدمة الخادم غير مهيأة حاليًا. يرجى المحاولة لاحقًا.", "SERVER", 500);
  }

  let url: URL;
  try {
    url = new URL(baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Unsupported protocol.");
  } catch {
    console.error("API_URL must be an absolute HTTP or HTTPS URL, including the API prefix.");
    throw new ApiError("إعدادات الاتصال بخدمة الخادم غير صحيحة. يرجى المحاولة لاحقًا.", "SERVER", 500);
  }

  return baseUrl.replace(/\/+$/, "");
}

function backendUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("Backend API paths must start with '/'.");
  }

  return `${backendBaseUrl()}${path}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

function messageFromPayload(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const { message } = payload as { message?: unknown };
    if (typeof message === "string" && message.length > 0) return message;
  }

  return "تعذر إتمام الطلب لدى خدمة الخادم. يرجى المحاولة لاحقًا.";
}

function fieldErrorsFromPayload(payload: unknown): Record<string, string[]> | undefined {
  if (typeof payload !== "object" || payload === null || !("errors" in payload)) return undefined;
  const errors = payload.errors;
  if (typeof errors !== "object" || errors === null || Array.isArray(errors)) return undefined;

  const entries = Object.entries(errors).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) && entry[1].every((message: unknown) => typeof message === "string"),
  );
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export async function backendRequest<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  // Resolve configuration before the fetch catch so setup errors are not reported as network failures.
  const url = backendUrl(path);
  let response: Response;
  try {
    response = await fetch(url, { ...options, cache: "no-store" });
  } catch (error) {
    console.error("Backend network request failed:", error);
    throw new ApiError(DEFAULT_BACKEND_ERROR, "NETWORK");
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      messageFromPayload(payload),
      errorCodeForStatus(response.status),
      response.status,
      fieldErrorsFromPayload(payload),
    );
  }

  return payload as TResponse;
}

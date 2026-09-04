import "server-only";

import { ApiError } from "./errors";

const DEFAULT_BACKEND_ERROR = "تعذر الاتصال بخدمة الخادم. يرجى المحاولة لاحقًا.";

function backendBaseUrl(): string {
  const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("API_URL is not configured.");
  }

  return baseUrl.replace(/\/$/, "");
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

  return DEFAULT_BACKEND_ERROR;
}

export async function backendRequest<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  let response: Response;
  try {
    response = await fetch(backendUrl(path), { ...options, cache: "no-store" });
  } catch {
    throw new ApiError(DEFAULT_BACKEND_ERROR, "NETWORK");
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(messageFromPayload(payload), "SERVER", response.status);
  }

  return payload as TResponse;
}

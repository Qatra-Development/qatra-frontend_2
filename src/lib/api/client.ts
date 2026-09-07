import { ApiError, errorCodeForStatus } from "./errors";

type ErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

async function readPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

export async function apiClient<TResponse>(
  endpoint: string,
  options: Omit<RequestInit, "body"> & { body?: object } = {},
): Promise<TResponse> {
  const { body, headers, ...requestOptions } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("Accept")) requestHeaders.set("Accept", "application/json");
  if (isFormData) requestHeaders.delete("Content-Type");
  else if (body && !requestHeaders.has("Content-Type")) requestHeaders.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      ...requestOptions,
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("تعذر الاتصال بالخادم. يرجى التحقق من الإنترنت.", "NETWORK");
  }

  const payload = await readPayload(response);
  const errorPayload = typeof payload === "object" && payload !== null ? (payload as ErrorPayload) : {};

  if (!response.ok) {
    throw new ApiError(
      errorPayload.message ?? "تعذر إتمام الطلب. يرجى المحاولة لاحقًا.",
      errorCodeForStatus(response.status),
      response.status,
      errorPayload.errors,
    );
  }

  return payload as TResponse;
}

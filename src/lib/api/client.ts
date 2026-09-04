import { ApiError, type ApiErrorCode } from "./errors";

type ErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

function errorCodeForStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return "VALIDATION";
  if (status === 401) return "AUTHENTICATION";
  if (status === 403) return "AUTHORIZATION";
  if (status === 404) return "NOT_FOUND";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

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

  let response: Response;
  try {
    response = await fetch(endpoint, {
      ...requestOptions,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
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

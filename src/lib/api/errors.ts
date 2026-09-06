export type ApiErrorCode =
  | "VALIDATION"
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "NOT_FOUND"
  | "SERVER"
  | "NETWORK"
  | "UNKNOWN";

export function errorCodeForStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return "VALIDATION";
  if (status === 401) return "AUTHENTICATION";
  if (status === 403) return "AUTHORIZATION";
  if (status === 404) return "NOT_FOUND";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "VALIDATION" && error.fieldErrors) {
      const fieldMessage = Object.values(error.fieldErrors)
        .flat()
        .find((message) => typeof message === "string" && message.trim().length > 0);
      if (fieldMessage) return fieldMessage;
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
}

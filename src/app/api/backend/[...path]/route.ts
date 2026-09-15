import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { apiErrorResponse } from "@/src/lib/api/route-response";
import { backendRequest } from "@/src/lib/api/server-client";
import { AUTH_COOKIE_NAME } from "@/src/lib/auth/cookies";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const BACKEND_BASE_URL =
  process.env.API_URL ??
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL;

/**
 * Proxy binary files such as PDF / JPG / PNG without trying
 * to parse the Laravel response as JSON.
 *
 * This is intentionally separate from backendRequest so the
 * existing JSON API behavior remains unchanged.
 */
async function forwardBinaryFile(
  request: Request,
  backendPath: string,
  token: string,
): Promise<NextResponse> {
  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      {
        success: false,
        message: "لم يتم إعداد رابط الخادم الخلفي.",
      },
      {
        status: 500,
      },
    );
  }

  const baseUrl = BACKEND_BASE_URL.replace(/\/$/, "");
  const query = new URL(request.url).search;

  const backendResponse = await fetch(`${baseUrl}${backendPath}${query}`, {
    method: request.method,

    headers: {
      Accept: request.headers.get("accept") || "*/*",
      Authorization: `Bearer ${token}`,
    },

    cache: "no-store",
  });

  /*
   * Laravel may return JSON on errors even though this endpoint
   * normally returns a file.
   */
  if (!backendResponse.ok) {
    const contentType = backendResponse.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const payload = await backendResponse.json().catch(() => ({
        success: false,
        message: "تعذر تحميل المستند.",
      }));

      return NextResponse.json(payload, {
        status: backendResponse.status,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "تعذر تحميل المستند.",
      },
      {
        status: backendResponse.status,
      },
    );
  }

  const responseHeaders = new Headers();

  const contentType = backendResponse.headers.get("content-type");

  const contentDisposition = backendResponse.headers.get("content-disposition");

  const contentLength = backendResponse.headers.get("content-length");

  if (contentType) {
    responseHeaders.set("Content-Type", contentType);
  }

  if (contentDisposition) {
    responseHeaders.set("Content-Disposition", contentDisposition);
  }

  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  /*
   * Avoid caching protected institution documents.
   */
  responseHeaders.set("Cache-Control", "private, no-store, max-age=0");

  /*
   * Stream the Laravel response directly to the browser.
   *
   * This supports:
   * - PDF
   * - JPG / JPEG
   * - PNG
   * - other binary file types
   *
   * without converting them to JSON.
   */
  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

async function forward(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "يجب تسجيل الدخول أولًا.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const { path } = await context.params;

    const backendPath = `/${path.join("/")}`;

    /*
     * File download endpoint:
     *
     * /admin/institutions/{institutionId}/documents/{documentId}/download
     *
     * It must not go through backendRequest because its successful
     * response is a file rather than JSON.
     */
    const isFileDownload =
      request.method === "GET" && backendPath.endsWith("/download");

    if (isFileDownload) {
      return forwardBinaryFile(request, backendPath, token);
    }

    /*
     * Keep the existing JSON proxy behavior unchanged.
     */
    const method = request.method;

    const body = ["GET", "HEAD"].includes(method)
      ? undefined
      : await request.text();

    const contentType = request.headers.get("content-type");

    const query = new URL(request.url).search;

    const payload = await backendRequest<unknown>(`${backendPath}${query}`, {
      method,

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,

        ...(contentType
          ? {
              "Content-Type": contentType,
            }
          : {}),
      },

      body: body || undefined,
    });

    return NextResponse.json(payload);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;

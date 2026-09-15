import "server-only";

import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/config/api";
import { backendRequest } from "@/src/lib/api/server-client";
import { AUTH_COOKIE_NAME } from "./cookies";

type CurrentUserResponse = {
  data?: {
    account_type?: string;
    user?: {
      account_type?: string;
    };
  };
  user?: {
    account_type?: string;
  };
};

export async function getCurrentAccountType(): Promise<string | null> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const response = await backendRequest<CurrentUserResponse>(API_ENDPOINTS.auth.me, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    response.data?.user?.account_type ??
    response.data?.account_type ??
    response.user?.account_type ??
    null
  );
}

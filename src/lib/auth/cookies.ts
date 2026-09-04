import "server-only";

import { AUTH_COOKIE_NAME, REMEMBER_ME_MAX_AGE_SECONDS } from "./constants";

function backendTokenMaxAgeSeconds(): number | undefined {
  const value = Number(process.env.AUTH_TOKEN_MAX_AGE_SECONDS);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function authCookieOptions(rememberMe: boolean) {
  const backendMaxAge = backendTokenMaxAgeSeconds();
  const persistentMaxAge = backendMaxAge
    ? Math.min(REMEMBER_ME_MAX_AGE_SECONDS, backendMaxAge)
    : REMEMBER_ME_MAX_AGE_SECONDS;

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    priority: "high" as const,
    ...(rememberMe ? { maxAge: persistentMaxAge } : {}),
  };
}

export { AUTH_COOKIE_NAME };

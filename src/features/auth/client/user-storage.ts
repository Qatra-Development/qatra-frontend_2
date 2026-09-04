"use client";

import { AUTH_USER_STORAGE_KEY } from "@/src/lib/auth/constants";
import type { AuthenticatedUser } from "../types/auth.types";

export function saveAuthenticatedUser(user: AuthenticatedUser): void {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthenticatedUser(): void {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

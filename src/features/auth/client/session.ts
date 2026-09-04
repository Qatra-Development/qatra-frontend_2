"use client";

import { logout } from "../services/auth.service";
import { clearAuthenticatedUser } from "./user-storage";

export async function endAuthenticatedSession(): Promise<void> {
  try {
    await logout();
  } finally {
    clearAuthenticatedUser();
  }
}

"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { endAuthenticatedSession } from "../client/session";
import { ApiError, getApiErrorMessage } from "@/src/lib/api/errors";

export function useLogout() {
  const pending = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (pending.current) return;

    pending.current = true;
    setIsLoggingOut(true);

    try {
      await endAuthenticatedSession();
      toast.success("تم تسجيل الخروج بنجاح.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));

      // The logout route clears browser cookies even if backend revocation fails.
      if (!(error instanceof ApiError) || error.status !== 502) return;
    } finally {
      pending.current = false;
      setIsLoggingOut(false);
    }

    // Load the public page after cookie removal, rather than reusing a
    // prefetched Server Component tree rendered for the signed-in session.
    window.location.replace("/login");
  }

  return { handleLogout, isLoggingOut };
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { endAuthenticatedSession } from "../client/session";
import { ApiError, getApiErrorMessage } from "@/src/lib/api/errors";

export function useLogout() {
  const router = useRouter();
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

    router.replace("/");
    router.refresh();
  }

  return { handleLogout, isLoggingOut };
}

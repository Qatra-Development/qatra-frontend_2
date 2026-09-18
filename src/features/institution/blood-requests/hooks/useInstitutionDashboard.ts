"use client";

import { useEffect, useState } from "react";

import { getInstitutionDashboardData } from "../services/blood-request.service";

import type { InstitutionDashboardData } from "../types/blood-request.types";
import { toast } from "sonner";

export function useInstitutionDashboard() {
  const [data, setData] = useState<InstitutionDashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const result = await getInstitutionDashboardData(controller.signal);

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "تعذر تحميل لوحة التحكم.";

        setError(message);

        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [reloadKey]);

  return {
    data,
    loading,
    error,

    refresh: () => setReloadKey((value) => value + 1),
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";

import { getBloodRequestDetails } from "../services/blood-request.service";

import type { BloodRequestDetails } from "../types/blood-request.types";

export function useBloodRequestDetails(requestId: number | string) {
  const [request, setRequest] = useState<BloodRequestDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getBloodRequestDetails(
          requestId,
          controller.signal,
        );

        setRequest(result);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          error instanceof Error ? error.message : "تعذر تحميل تفاصيل الطلب.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [requestId, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    request,
    setRequest,

    loading,
    error,

    refresh,
  };
}

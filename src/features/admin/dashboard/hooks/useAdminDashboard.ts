"use client";

import { useEffect, useState } from "react";

import { getAdminDashboard } from "../services/admin-dashboard.service";

import type { AdminDashboardData } from "../types/admin-dashboard.types";

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const dashboard = await getAdminDashboard(controller.signal);

        setData(dashboard);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setError(error instanceof Error ? error.message : "حدث خطأ غير متوقع.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  return {
    data,
    error,
    isLoading,

    retry: () => {
      setReloadKey((value) => value + 1);
    },
  };
}

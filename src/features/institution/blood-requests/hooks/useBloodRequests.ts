"use client";

import { useCallback, useEffect, useState } from "react";

import { getBloodRequests } from "../services/blood-request.service";

import type {
  BloodRequestListFilters,
  BloodRequestListItem,
  PaginationMeta,
} from "../types/blood-request.types";

interface State {
  items: BloodRequestListItem[];

  meta: PaginationMeta | null;

  loading: boolean;

  error: string | null;
}

export function useBloodRequests(filters: BloodRequestListFilters) {
  const [refreshKey, setRefreshKey] = useState(0);

  const [state, setState] = useState<State>({
    items: [],
    meta: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const result = await getBloodRequests(filters, controller.signal);

        setState({
          items: result.items,
          meta: result.meta,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : "تعذر تحميل الطلبات.",
        }));
      }
    }

    void load();

    return () => controller.abort();
  }, [filters, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    ...state,
    refresh,
  };
}

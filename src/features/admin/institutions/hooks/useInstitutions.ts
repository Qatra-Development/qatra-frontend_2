"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { filterInstitutions } from "../lib/institutions.utils";

import { getInstitutions } from "../services/institutions.service";

import type {
  InstitutionsDataset,
  InstitutionsTab,
  ServiceScopeFilter,
} from "../types/institutions.types";
import { toast } from "sonner";

const EMPTY_DATA: InstitutionsDataset = {
  approved: {
    items: [],
    total: 0,
  },

  removed: {
    items: [],
    total: 0,
  },
};

export function useInstitutions() {
  const [data, setData] = useState<InstitutionsDataset>(EMPTY_DATA);

  const [activeTab, setActiveTab] = useState<InstitutionsTab>("approved");

  const [searchQuery, setSearchQuery] = useState("");

  const [serviceScope, setServiceScope] = useState<ServiceScopeFilter>("all");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getInstitutions(controller.signal);

        setData(result);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع.";

        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  const filteredInstitutions = useMemo(
    () =>
      filterInstitutions(data[activeTab].items, deferredSearch, serviceScope),
    [data, activeTab, deferredSearch, serviceScope],
  );

  const counts = useMemo(
    () => ({
      approved: data.approved.total,

      removed: data.removed.total,
    }),
    [data],
  );

  const hasFilters = deferredSearch.trim().length > 0 || serviceScope !== "all";

  return {
    activeTab,
    setActiveTab,

    searchQuery,
    setSearchQuery,

    serviceScope,
    setServiceScope,

    institutions: filteredInstitutions,

    counts,

    isLoading,
    error,

    hasFilters,

    retry: () => setReloadKey((value) => value + 1),
  };
}

"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { filterApprovalInstitutions } from "../lib/approval-requests.utils";

import { getApprovalRequests } from "../services/approval-requests.service";

import type {
  ApprovalRequestsDataset,
  ApprovalRequestStatus,
  ServiceScopeFilter,
} from "../types/approval-requests.types";
import { toast } from "sonner";

const EMPTY_DATA: ApprovalRequestsDataset = {
  pending_review: {
    items: [],
    total: 0,
  },

  rejected: {
    items: [],
    total: 0,
  },
};

export function useApprovalRequests() {
  const [data, setData] = useState<ApprovalRequestsDataset>(EMPTY_DATA);

  const [activeStatus, setActiveStatus] =
    useState<ApprovalRequestStatus>("pending_review");

  const [searchQuery, setSearchQuery] = useState("");

  const [serviceScope, setServiceScope] = useState<ServiceScopeFilter>("all");

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    const controller = new AbortController();

    const loadRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getApprovalRequests(controller.signal);

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
    };

    loadRequests();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  const activeItems = data[activeStatus].items;

  const filteredItems = useMemo(
    () => filterApprovalInstitutions(activeItems, deferredSearch, serviceScope),
    [activeItems, deferredSearch, serviceScope],
  );

  const counts = useMemo(
    () => ({
      pending_review: data.pending_review.total,

      rejected: data.rejected.total,
    }),
    [data],
  );

  const hasActiveFilters =
    deferredSearch.trim().length > 0 || serviceScope !== "all";

  return {
    activeStatus,
    setActiveStatus,

    searchQuery,
    setSearchQuery,

    serviceScope,
    setServiceScope,

    requests: filteredItems,
    counts,

    isLoading,
    error,

    hasActiveFilters,

    retry: () => {
      setReloadKey((value) => value + 1);
    },
  };
}

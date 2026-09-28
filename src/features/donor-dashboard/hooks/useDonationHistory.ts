"use client";

import { useEffect, useState } from "react";

import { getCurrentUser, getDonationHistory } from "../services/donor.service";

import type {
  CurrentUser,
  DonationHistoryProcess,
  DonationHistorySummary,
  PaginationMeta,
} from "../types/donor.types";

export function useDonationHistory() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [items, setItems] = useState<DonationHistoryProcess[]>([]);

  const [summary, setSummary] = useState<DonationHistorySummary | null>(null);

  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [userResponse, historyResponse] = await Promise.all([
          getCurrentUser(controller.signal),

          getDonationHistory(page, controller.signal),
        ]);

        setUser(userResponse.data);

        setItems(historyResponse.data);

        setSummary(historyResponse.summary);

        setMeta(historyResponse.meta);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل سجل التبرعات.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [page]);

  return {
    user,
    items,
    summary,
    meta,

    page,
    setPage,

    loading,
    error,
  };
}

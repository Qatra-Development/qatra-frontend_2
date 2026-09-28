"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllDonationCallResponses,
  getDonationCall,
} from "../services/blood-bank-donation.service";

import type {
  DonationCall,
  DonationCallResponder,
  DonationRespondersSummary,
} from "../types/donation.types";

const PAGE_SIZE = 10;

export function useDonationCallResponders(callId: number) {
  const [call, setCall] = useState<DonationCall | null>(null);

  const [sourceResponders, setSourceResponders] = useState<
    DonationCallResponder[]
  >([]);

  const [summary, setSummary] = useState<DonationRespondersSummary | null>(
    null,
  );

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [callResponse, respondersResponse] = await Promise.all([
          getDonationCall(callId, controller.signal),

          getAllDonationCallResponses(
            callId,
            {
              response_status: "interested",
            },
            controller.signal,
          ),
        ]);

        setCall(callResponse.data);

        setSourceResponders(respondersResponse.data);

        setSummary(respondersResponse.meta.summary);
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
            : "تعذر تحميل المستجيبين.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [callId, refreshKey]);

  const availableCount = useMemo(
    () =>
      sourceResponders.filter(
        (responder) => responder.donor.availability_status === "available",
      ).length,
    [sourceResponders],
  );

  const total = sourceResponders.length;

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(page, lastPage);

  const responders = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return sourceResponders.slice(start, start + PAGE_SIZE);
  }, [sourceResponders, safePage]);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    call,
    responders,
    summary,

    availableCount,

    page: safePage,
    lastPage,
    total,

    loading,
    error,

    setPage,
    reload,
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllDonationCalls } from "../services/blood-bank-donation.service";

import type { DonationCall } from "../types/donation.types";

export type DonationCallTab = "all" | "active" | "closed";

const PAGE_SIZE = 4;

export function useDonationCalls() {
  const [sourceCalls, setSourceCalls] = useState<DonationCall[]>([]);

  const [search, setSearchValue] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [region, setRegionValue] = useState("");

  const [tab, setTabValue] = useState<DonationCallTab>("all");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllDonationCalls(
          {
            search: debouncedSearch || undefined,
          },
          controller.signal,
        );

        setSourceCalls(response.data);
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
            : "تعذر تحميل نداءات التبرع.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, refreshKey]);

  const regions = useMemo(() => {
    return Array.from(
      new Set(
        sourceCalls
          .map((call) => call.institution?.governorate)
          .filter((value): value is string => Boolean(value)),
      ),
    );
  }, [sourceCalls]);

  const filteredCalls = useMemo(() => {
    return sourceCalls.filter((call) => {
      if (region && call.institution?.governorate !== region) {
        return false;
      }

      if (tab === "active" && call.status !== "active") {
        return false;
      }

      if (
        tab === "closed" &&
        !["fulfilled", "closed", "cancelled"].includes(call.status)
      ) {
        return false;
      }

      return true;
    });
  }, [sourceCalls, region, tab]);

  const total = filteredCalls.length;

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(page, lastPage);

  const calls = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredCalls.slice(start, start + PAGE_SIZE);
  }, [filteredCalls, safePage]);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setRegion = useCallback((value: string) => {
    setRegionValue(value);
    setPage(1);
  }, []);

  const setTab = useCallback((value: DonationCallTab) => {
    setTabValue(value);
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    calls,

    search,
    region,
    tab,

    regions,

    total,
    page: safePage,
    lastPage,

    loading,
    error,

    setSearch,
    setRegion,
    setTab,
    setPage,

    reload,
  };
}

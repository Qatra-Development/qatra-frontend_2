"use client";

import { useCallback, useEffect, useState } from "react";

import { getVoluntaryDonationRequests } from "../services/blood-bank-donation.service";

import type {
  BloodType,
  VoluntaryDonationRequestsMeta,
  VoluntaryDonationRequest,
} from "../types/donation.types";

interface Filters {
  search: string;
  region: string;
  bloodType: BloodType | "";
  page: number;
}

export function useVoluntaryDonationRequests() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    region: "",
    bloodType: "",
    page: 1,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [requests, setRequests] = useState<VoluntaryDonationRequest[]>([]);

  const [meta, setMeta] = useState<VoluntaryDonationRequestsMeta | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await getVoluntaryDonationRequests(
          {
            search: debouncedSearch || undefined,

            region: filters.region || undefined,

            blood_type: filters.bloodType || undefined,

            page: filters.page,
            per_page: 15,
          },
          controller.signal,
        );

        setRequests(response.data);
        setMeta(response.meta);
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
            : "تعذر تحميل طلبات التبرع.",
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
  }, [
    debouncedSearch,
    filters.region,
    filters.bloodType,
    filters.page,
    refreshKey,
  ]);

  const setSearch = useCallback((search: string) => {
    setFilters((current) => ({
      ...current,
      search,
      page: 1,
    }));
  }, []);

  const setRegion = useCallback((region: string) => {
    setFilters((current) => ({
      ...current,
      region,
      page: 1,
    }));
  }, []);

  const setBloodType = useCallback((bloodType: BloodType | "") => {
    setFilters((current) => ({
      ...current,
      bloodType,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  }, []);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    requests,
    meta,
    filters,

    loading,
    error,

    setSearch,
    setRegion,
    setBloodType,
    setPage,

    reload,
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllDonationProcesses,
  getAllVoluntaryDonationRequests,
} from "../services/blood-bank-donation.service";

import { createEmptyBloodTypeCounts } from "../lib/donation.utils";

import type {
  BloodType,
  UpcomingDonationProcess,
} from "../types/donation.types";

const PAGE_SIZE = 15;

export function useUpcomingDonors() {
  const [sourceProcesses, setSourceProcesses] = useState<
    UpcomingDonationProcess[]
  >([]);

  const [search, setSearchValue] = useState("");

  const [region, setRegionValue] = useState("");

  const [bloodType, setBloodTypeValue] = useState<BloodType | "">("");

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
        /*
         * لا يوجد region filter في endpoint
         * donation-processes حاليًا.
         *
         * لذلك نجلب جميع scheduled
         * ثم نفلتر محليًا.
         */
        const [processes, voluntaryRequests] = await Promise.all([
          getAllDonationProcesses(
            {
              status: "scheduled",
            },
            controller.signal,
          ),

          /*
           * نستخدم هذا endpoint فقط
           * لإكمال رقم الهاتف للعمليات
           * التي أصلها طلب تبرع طوعي.
           */
          getAllVoluntaryDonationRequests(
            {
              status: "scheduled",
            },
            controller.signal,
          ),
        ]);

        const phoneByProcessId = new Map<number, string>();

        voluntaryRequests.forEach((request) => {
          if (request.process?.id && request.donor.phone) {
            phoneByProcessId.set(request.process.id, request.donor.phone);
          }
        });

        const enrichedProcesses = processes
          .filter((process) => process.status === "scheduled" && process.donor)
          .map(
            (process): UpcomingDonationProcess => ({
              ...process,

              donor: {
                ...process.donor!,
                phone: phoneByProcessId.get(process.id) ?? null,
              },
            }),
          );

        setSourceProcesses(enrichedProcesses);
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
            : "تعذر تحميل المتبرعين القادمين.",
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
  }, [refreshKey]);

  const regions = useMemo(() => {
    return Array.from(
      new Set(
        sourceProcesses.map((process) => process.donor.region).filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "ar"));
  }, [sourceProcesses]);

  const bloodTypeCounts = useMemo(() => {
    const counts = createEmptyBloodTypeCounts();

    sourceProcesses.forEach((process) => {
      counts[process.donor.blood_type] += 1;
    });

    return counts;
  }, [sourceProcesses]);

  const filteredProcesses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sourceProcesses.filter((process) => {
      if (bloodType && process.donor.blood_type !== bloodType) {
        return false;
      }

      if (region && process.donor.region !== region) {
        return false;
      }

      if (normalizedSearch) {
        const searchableValues = [
          process.donor.name ?? "",
          process.donor.phone ?? "",
          process.process_number,
          process.donation_call?.title ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableValues.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });
  }, [sourceProcesses, bloodType, region, search]);

  const total = filteredProcesses.length;

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(page, lastPage);

  const processes = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredProcesses.slice(start, start + PAGE_SIZE);
  }, [filteredProcesses, safePage]);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setRegion = useCallback((value: string) => {
    setRegionValue(value);
    setPage(1);
  }, []);

  const setBloodType = useCallback((value: BloodType | "") => {
    setBloodTypeValue(value);
    setPage(1);
  }, []);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    processes,

    total,
    sourceTotal: sourceProcesses.length,

    page: safePage,
    lastPage,

    search,
    region,
    bloodType,

    regions,
    bloodTypeCounts,

    loading,
    error,

    setSearch,
    setRegion,
    setBloodType,
    setPage,

    reload,
  };
}

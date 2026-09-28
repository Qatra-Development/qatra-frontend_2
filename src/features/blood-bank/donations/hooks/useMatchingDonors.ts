"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllMatchingDonors,
  getDonationCall,
  inviteDonationCallDonors,
} from "../services/blood-bank-donation.service";

import type { DonationCall, MatchingDonor } from "../types/donation.types";

const PAGE_SIZE = 10;

export function useMatchingDonors(callId: number) {
  const [call, setCall] = useState<DonationCall | null>(null);

  const [sourceDonors, setSourceDonors] = useState<MatchingDonor[]>([]);

  const [search, setSearchValue] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [callResponse, donorsResponse] = await Promise.all([
          getDonationCall(callId, controller.signal),

          getAllMatchingDonors(
            callId,
            {
              invitation_status: "any",
            },
            controller.signal,
          ),
        ]);

        setCall(callResponse.data);

        setSourceDonors(donorsResponse.data);
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
            : "تعذر تحميل المتبرعين المناسبين.",
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

  const filteredDonors = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return sourceDonors;
    }

    return sourceDonors.filter((donor) => {
      const haystack = [donor.name, donor.region, ...donor.donation_areas]
        .join(" ")
        .toLowerCase();

      return haystack.includes(value);
    });
  }, [sourceDonors, search]);

  const total = filteredDonors.length;

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(page, lastPage);

  const donors = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredDonors.slice(start, start + PAGE_SIZE);
  }, [filteredDonors, safePage]);

  const selectablePageIds = useMemo(
    () =>
      donors.filter((donor) => !donor.invitation_sent).map((donor) => donor.id),
    [donors],
  );

  const allPageSelected =
    selectablePageIds.length > 0 &&
    selectablePageIds.every((id) => selectedIds.has(id));

  const toggleDonor = useCallback((donor: MatchingDonor) => {
    if (donor.invitation_sent) {
      return;
    }

    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(donor.id)) {
        next.delete(donor.id);
      } else {
        next.add(donor.id);
      }

      return next;
    });
  }, []);

  const toggleCurrentPage = useCallback(() => {
    setSelectedIds((current) => {
      const next = new Set(current);

      const everythingSelected = selectablePageIds.every((id) => next.has(id));

      if (everythingSelected) {
        selectablePageIds.forEach((id) => next.delete(id));
      } else {
        selectablePageIds.forEach((id) => next.add(id));
      }

      return next;
    });
  }, [selectablePageIds]);

  const sendInvitations = useCallback(async () => {
    const donorIds = Array.from(selectedIds);

    if (donorIds.length === 0) {
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      await inviteDonationCallDonors(callId, donorIds);

      setSelectedIds(new Set());

      setRefreshKey((current) => current + 1);

      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر إرسال النداء.",
      );

      return false;
    } finally {
      setSubmitting(false);
    }
  }, [callId, selectedIds]);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  return {
    call,
    donors,

    search,
    setSearch,

    selectedIds,

    page: safePage,
    lastPage,
    total,

    selectablePageIds,
    allPageSelected,

    loading,
    submitting,
    error,

    setPage,

    toggleDonor,
    toggleCurrentPage,
    sendInvitations,
  };
}

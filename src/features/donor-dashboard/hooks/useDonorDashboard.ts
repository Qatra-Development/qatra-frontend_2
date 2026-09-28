"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getCurrentUser,
  getDonorAvailability,
  getDonorDonationCalls,
} from "../services/donor.service";

import type {
  CurrentUser,
  DonorAvailability,
  DonorDonationCall,
} from "../types/donor.types";

export function useDonorDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [availability, setAvailability] = useState<DonorAvailability | null>(
    null,
  );

  const [targetedCalls, setTargetedCalls] = useState<DonorDonationCall[]>([]);

  const [matchingCalls, setMatchingCalls] = useState<DonorDonationCall[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [
          userResponse,
          availabilityResponse,
          targetedResponse,
          matchingResponse,
        ] = await Promise.all([
          getCurrentUser(controller.signal),

          getDonorAvailability(controller.signal),

          getDonorDonationCalls(true, controller.signal),

          getDonorDonationCalls(false, controller.signal),
        ]);

        setUser(userResponse.data);

        setAvailability(availabilityResponse.data);

        setTargetedCalls(targetedResponse.data);

        setMatchingCalls(matchingResponse.data);
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
            : "تعذر تحميل لوحة التحكم.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [refreshKey]);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    user,
    availability,

    targetedCalls,
    matchingCalls,

    loading,
    error,

    reload,
  };
}

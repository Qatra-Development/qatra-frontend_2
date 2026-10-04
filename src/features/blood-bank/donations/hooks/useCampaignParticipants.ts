"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import { getCampaignParticipants, type CampaignParticipant } from "../services/campaign.service";

export function useCampaignParticipants(id: number | string, enabled: boolean) {
  const [result, setResult] = useState<{ id: string; participants: CampaignParticipant[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const participants = await getCampaignParticipants(id, controller.signal);
        if (!controller.signal.aborted) setResult({ id: String(id), participants });
      } catch (error) {
        if (!controller.signal.aborted) setError(getApiErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, enabled, revision]);

  return {
    participants: result?.id === String(id) ? result.participants : [],
    loaded: result?.id === String(id), error, loading, reload,
  };
}

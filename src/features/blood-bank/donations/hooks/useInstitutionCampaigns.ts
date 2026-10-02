"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import {
  getCampaignStats,
  getInstitutionCampaigns,
  type CampaignStats,
  type InstitutionCampaign,
} from "../services/campaign.service";

export function useInstitutionCampaigns(enabled: boolean) {
  const [campaigns, setCampaigns] = useState<InstitutionCampaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      await Promise.allSettled([
        getInstitutionCampaigns(controller.signal).then((campaigns) => {
          if (!controller.signal.aborted) setCampaigns(campaigns);
        }).catch((error) => {
          if (!controller.signal.aborted) setError(getApiErrorMessage(error));
        }).finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        }),
        getCampaignStats(controller.signal).then((stats) => {
          if (!controller.signal.aborted) setStats(stats);
        }).catch((error) => {
          if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
        }),
      ]);
    }
    void load();
    return () => controller.abort();
  }, [enabled, revision]);

  return { campaigns, stats, loading, error, reload };
}

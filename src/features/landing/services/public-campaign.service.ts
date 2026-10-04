import "server-only";

import { backendRequest } from "@/src/lib/api/server-client";

import type {
  FeaturedCampaignsResult,
  PublicCampaignsResponse,
} from "../types/public-campaign.types";

export async function getFeaturedPublicCampaigns(
  limit = 3,
): Promise<FeaturedCampaignsResult> {
  try {
    const query = new URLSearchParams({
      page: "1",
    });

    const response = await backendRequest<PublicCampaignsResponse>(
      `/public/campaigns?${query.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    return {
      data: response.data.slice(0, limit),

      error: null,
    };
  } catch {
    return {
      data: [],

      error: "تعذر تحميل حملات التبرع حاليًا.",
    };
  }
}

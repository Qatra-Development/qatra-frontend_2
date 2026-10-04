import VisitorContent from "./VisitorContent";
import type { PublicCampaign, CampaignFilters } from "./VisitorContent";
import { backendRequest } from "@/src/lib/api/server-client";

export default function VisitorPage() {
  async function loadCampaignsAction(filters: CampaignFilters) {
    "use server";

    try {
      const query = new URLSearchParams();
      if (typeof filters.search === "string" && filters.search.trim()) {
        query.set("search", filters.search.trim());
      }
      if (typeof filters.governorate === "string" && filters.governorate) {
        query.set("governorate", filters.governorate);
      }
      if (typeof filters.blood_type === "string" && filters.blood_type) {
        query.set("blood_type", filters.blood_type);
      }
      if (filters.status === "published" || filters.status === "active") {
        query.set("status", filters.status);
      }

      // The existing UI has no pagination controls; retrieve every matching page.
      const campaigns: PublicCampaign[] = [];
      let page = 1;
      let lastPage = 1;
      do {
        query.set("page", String(page));
        const response = await backendRequest<{
          data: PublicCampaign[];
          meta: { last_page: number };
        }>(`/public/campaigns?${query}`, {
          headers: { Accept: "application/json" },
        });
        campaigns.push(...response.data);
        lastPage = response.meta.last_page;
        page += 1;
      } while (page <= lastPage);

      return { data: campaigns, error: null };
    } catch {
      return { data: [], error: "تعذر تحميل الحملات. يرجى المحاولة مجددًا." };
    }
  }

  async function loadCampaignAction(id: string) {
    "use server";

    if (!/^\d+$/.test(id)) {
      return { data: null, error: "معرّف الحملة غير صالح." };
    }

    try {
      const response = await backendRequest<{ data: PublicCampaign }>(
        `/public/campaigns/${id}`,
        { headers: { Accept: "application/json" } },
      );
      return { data: response.data, error: null };
    } catch {
      return { data: null, error: "تعذر تحميل تفاصيل الحملة. يرجى المحاولة مجددًا." };
    }
  }

  return (
    <VisitorContent
      loadCampaignsAction={loadCampaignsAction}
      loadCampaignAction={loadCampaignAction}
    />
  );
}

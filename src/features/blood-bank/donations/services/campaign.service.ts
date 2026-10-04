import { backendProxyUrl } from "@/src/config/api";
import { apiClient } from "@/src/lib/api/client";

export type InstitutionCampaign = {
  id: number | string;
  campaign_number: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  start_time: string;
  end_time?: string | null;
  governorate: string;
  area: string;
  location: string;
  target_count?: number | null;
  notes?: string | null;
  status: string;
  status_label?: string;
  blood_types: string[];
  updated_at?: string;
  created_at?: string;
  institution?: { id: number | string; name: string; type?: string };
  stats?: {
    registered_count: number;
    attended_count: number;
    donated_count: number;
    cancelled_count?: number;
    total_participated: number;
  };
};

export type CampaignStats = {
  upcoming_campaigns: number;
  registered_participants: number;
  verified_donations: number;
};

type CampaignListResponse = {
  success?: boolean;
  message?: string;
  data: InstitutionCampaign[];
  meta?: { current_page: number; last_page: number };
};

// The institution list must include completed/cancelled campaigns and drafts.
// The public endpoint only exposes published and active campaigns.
export async function getInstitutionCampaigns(signal?: AbortSignal) {
  const campaigns: InstitutionCampaign[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const response = await apiClient<CampaignListResponse>(
      backendProxyUrl(`/blood-bank/campaigns?page=${page}`),
      { signal, cache: "no-store" },
    );
    if (response.success === false || !Array.isArray(response.data)) {
      throw new Error(response.message || "تعذر تحميل حملات التبرع.");
    }
    campaigns.push(...response.data);
    lastPage = response.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);
  return campaigns;
}

export async function getCampaignStats(signal?: AbortSignal) {
  const response = await apiClient<{
    success?: boolean;
    message?: string;
    stats: CampaignStats;
  }>(backendProxyUrl("/blood-bank/campaigns/stats"), { signal, cache: "no-store" });
  if (response.success === false || !response.stats) {
    throw new Error(response.message || "تعذر تحميل إحصائيات الحملات.");
  }
  return response.stats;
}

const campaignPath = (id: number | string) =>
  `/blood-bank/campaigns/${encodeURIComponent(String(id))}`;

export async function getInstitutionCampaign(id: number | string, signal?: AbortSignal) {
  // Use the confirmed institution list: public details exclude drafts and
  // cancelled campaigns, and an institution GET detail route is not documented.
  const campaigns = await getInstitutionCampaigns(signal);
  const campaign = campaigns.find((item) => String(item.id) === String(id));
  if (!campaign) throw new Error("الحملة غير موجودة أو غير متاحة لهذا الحساب.");
  return campaign;
}

export type UpdateCampaignPayload = {
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  start_time: string;
  end_time: string | null;
  governorate: string;
  area: string;
  location: string;
  target_count: number | null;
  notes: string;
  blood_types: string[];
};

type MutationResponse = { success?: boolean; message?: string; data?: unknown };

async function mutateCampaign(path: string, method: "POST" | "PATCH", body?: object) {
  const response = await apiClient<MutationResponse>(backendProxyUrl(path), { method, body });
  if (response.success === false) throw new Error(response.message || "تعذر تنفيذ العملية.");
  return response;
}

export function updateInstitutionCampaign(id: number | string, payload: UpdateCampaignPayload) {
  return mutateCampaign(campaignPath(id), "PATCH", payload);
}

export function cancelInstitutionCampaign(id: number | string) {
  return mutateCampaign(`${campaignPath(id)}/cancel`, "POST");
}

export type CampaignParticipant = {
  id: number | string;
  status: "registered" | "attended" | "cancelled" | "donated";
  registered_at?: string | null;
  donor?: {
    id: number | string;
    donor_number?: string;
    name?: string | null;
    full_name?: string | null;
    blood_type?: string | null;
    governorate?: string | null;
    area?: string | null;
    region?: string | null;
  } | null;
};

export async function getCampaignParticipants(id: number | string, signal?: AbortSignal) {
  const participants: CampaignParticipant[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const response = await apiClient<{
      success?: boolean;
      message?: string;
      data: CampaignParticipant[];
      meta?: { last_page: number };
    }>(backendProxyUrl(`${campaignPath(id)}/participants?page=${page}`), { signal, cache: "no-store" });
    if (response.success === false || !Array.isArray(response.data)) {
      throw new Error(response.message || "تعذر تحميل المشاركين.");
    }
    if (response.data.some((participant) =>
      !participant || !["string", "number"].includes(typeof participant.id) ||
      !["registered", "attended", "cancelled", "donated"].includes(participant.status),
    )) {
      throw new Error("استجابة المشاركين لا تحتوي معرّفات وحالات مشاركة صالحة.");
    }
    participants.push(...response.data);
    lastPage = response.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);
  return participants;
}

export function recordCampaignDonation(
  campaignId: number | string,
  participantId: number | string,
  collectedAt: string,
) {
  return mutateCampaign(
    `${campaignPath(campaignId)}/participants/${encodeURIComponent(String(participantId))}/record-donation`,
    "POST",
    { collected_at: collectedAt },
  );
}

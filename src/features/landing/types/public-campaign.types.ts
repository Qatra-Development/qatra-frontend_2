export type PublicCampaignStatus = "published" | "active";

export interface PublicCampaignInstitution {
  id: number;
  name: string;
  type: string;
}

export interface PublicCampaignStats {
  registered_count: number;
  attended_count: number;
  donated_count: number;
  total_participated: number;
}

export interface PublicCampaign {
  id: number;
  campaign_number: string;

  title: string;
  description: string;

  institution: PublicCampaignInstitution;

  start_date: string;
  end_date: string;

  start_time: string;
  end_time: string;

  governorate: string;
  area: string;
  location: string;

  target_count: number;

  notes: string | null;

  status: PublicCampaignStatus;
  status_label: string;

  blood_types: string[];

  stats: PublicCampaignStats;

  my_participation: unknown | null;
}

export interface PublicCampaignsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PublicCampaignsResponse {
  data: PublicCampaign[];
  meta: PublicCampaignsMeta;
}

export interface FeaturedCampaignsResult {
  data: PublicCampaign[];
  error: string | null;
}

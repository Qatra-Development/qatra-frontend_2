export type InstitutionStatus =
  | "pending_verification"
  | "pending_review"
  | "needs_completion"
  | "approved"
  | "rejected";

export interface AdminInstitution {
  id: number;

  institution_name: string;
  institution_type: string;
  license_number: string;

  address?: string | null;
  governorate?: string | null;

  service_scope?: string | null;

  status: InstitutionStatus;

  review_notes?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface InstitutionPage {
  items: AdminInstitution[];
  total: number;
}

export interface AdminDashboardStats {
  total: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  latestInstitutions: AdminInstitution[];
  lastReview: AdminInstitution | null;
}

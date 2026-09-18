export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodType = (typeof BLOOD_TYPES)[number];

export type BloodRequestPriority = "normal" | "urgent" | "emergency";

export type BloodRequestStatus =
  | "draft"
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "rejected"
  | "cancelled";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LaravelPagination<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;

  from?: number | null;
  to?: number | null;

  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export interface BloodRequestCoverage {
  provided: number;
  required: number;
  label: string;
}

export interface BloodRequestListItem {
  id: number;
  request_number: string;

  blood_type: BloodType;
  units_required: number;
  units_provided: number;

  priority: BloodRequestPriority;
  priority_label: string;

  description: string;

  needed_at: string;

  notes: string | null;

  status: BloodRequestStatus;
  status_label: string;

  coverage: BloodRequestCoverage;

  version: number;

  created_at: string;
  updated_at: string;

  assigned_blood_bank_id?: number | null;
}

export interface BloodRequestDetails extends BloodRequestListItem {
  recipient_ids?: number[];

  recipients?: BloodRequestRecipient[];

  available_actions?: {
    edit: boolean;
    submit: boolean;
    cancel: boolean;
  };

  status_history?: BloodRequestHistory[];

  cancellation_reason?: string | null;
  rejection_reason?: string | null;
}

export interface BloodRequestRecipient {
  id?: number;
  institution_id?: number;

  institution_name?: string;

  status?: string;

  created_at?: string;
  updated_at?: string;
}

export interface BloodRequestHistory {
  from_status: string | null;
  to_status: string;

  status_label: string;

  changed_by?: string | null;

  note?: string | null;

  created_at: string;
}

export interface BloodSupplier {
  id: number;

  institution_name: string;
  institution_type: string;

  governorate: string;
  address: string;

  available_units: number;

  can_fulfill: boolean;
  same_governorate: boolean;
}

export interface SupplierPagination {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;

  proximity_basis?: string;
  blood_type_match?: string;
  checked_at?: string;
}

export interface SupplierResult {
  items: BloodSupplier[];
  meta?: SupplierPagination;
}

export interface BloodRequestSummary {
  total_requests: number;
  active_requests: number;

  units_required: number;
  units_received: number;

  cancelled_requests: number;

  draft_count: number;
  latest_draft_id: number | null;

  status_counts: Record<BloodRequestStatus, number>;

  units_by_blood_type:
    | Partial<Record<BloodType, number>>
    | Array<{
        blood_type: BloodType;
        units?: number;
        units_required?: number;
        total?: number;
      }>;

  chart_period_days: number;
}

export interface InstitutionDashboardData {
  summary: BloodRequestSummary;

  latestRequests: BloodRequestListItem[];

  latestDraft: BloodRequestDetails | null;
}

export interface CreateBloodRequestPayload {
  blood_type: BloodType;

  units_required: number;

  priority: BloodRequestPriority;

  description: string;

  needed_at: string;

  notes?: string;

  recipient_ids: number[];
}

export type DraftBloodRequestPayload = Partial<
  Omit<CreateBloodRequestPayload, "recipient_ids">
> & {
  recipient_ids?: number[];
};

export interface BloodRequestFormValues {
  blood_type: BloodType | "";

  units_required: string;

  priority: BloodRequestPriority | "";

  needed_date: string;
  needed_time: string;

  description: string;
  notes: string;

  recipient_ids: number[];
}

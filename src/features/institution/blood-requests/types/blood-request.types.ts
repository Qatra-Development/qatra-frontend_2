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

export type BloodRequestStatusFilter = BloodRequestStatus | "processing";

export type BloodRequestSort = "newest" | "oldest" | "priority" | "needed_at";

export type BloodRequestDateField = "created_at" | "needed_at";

export type BloodRequestDatePreset = "today" | "last7" | "last30" | "custom";

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedApiResponse<
  T,
  TMeta extends PaginationMeta = PaginationMeta,
> extends ApiResponse<T[]> {
  meta: TMeta;
}

/*
|--------------------------------------------------------------------------
| Coverage
|--------------------------------------------------------------------------
*/

export interface BloodRequestCoverage {
  provided: number;
  required: number;
  label: string;
}

/*
|--------------------------------------------------------------------------
| Request
|--------------------------------------------------------------------------
*/

export interface BloodRequestListItem {
  id: number;
  request_number: string;

  blood_type: BloodType;

  units_required: number;
  units_provided: number;

  coverage: BloodRequestCoverage;

  priority: BloodRequestPriority;
  priority_label: string;

  description: string;

  needed_at: string;

  notes: string | null;

  status: BloodRequestStatus;
  status_label: string;

  version: number;

  assigned_blood_bank_id: number | null;

  created_at: string;
  updated_at: string;
}

export interface BloodRequestRecipient {
  blood_bank_id: number;

  institution_name: string;
  governorate: string;

  status: string;

  sent_at: string | null;
  responded_at: string | null;

  rejection_reason: string | null;
}

export interface BloodRequestHistory {
  from_status: BloodRequestStatus | null;
  to_status: BloodRequestStatus;

  status_label: string;

  changed_by: number | null;

  note: string | null;

  created_at: string;
}

export interface BloodRequestAvailableActions {
  edit: boolean;
  submit: boolean;
  cancel: boolean;
}

export interface BloodRequestDetails extends BloodRequestListItem {
  recipient_ids: number[];

  recipients: BloodRequestRecipient[];

  available_actions: BloodRequestAvailableActions;

  accepted_at: string | null;

  cancellation_reason: string | null;
  cancelled_at: string | null;

  rejection_reason: string | null;
  rejected_at: string | null;

  submitted_at: string | null;

  completed_at: string | null;

  delivered_by: number | null;
  delivery_notes: string | null;

  status_history: BloodRequestHistory[];
}

export interface BloodRequestMutationResult {
  request: BloodRequestDetails;

  message?: string;
}

/*
|--------------------------------------------------------------------------
| Suppliers
|--------------------------------------------------------------------------
*/

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

export interface SupplierPagination extends PaginationMeta {
  proximity_basis: string;
  blood_type_match: string;
  checked_at: string;
}

export type SupplierApiResponse = PaginatedApiResponse<
  BloodSupplier,
  SupplierPagination
>;

export interface SupplierResult {
  items: BloodSupplier[];
  meta: SupplierPagination;
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export interface BloodRequestSummary {
  total_requests: number;
  active_requests: number;

  units_required: number;
  units_received: number;

  cancelled_requests: number;

  draft_count: number;
  latest_draft_id: number | null;

  status_counts: Record<BloodRequestStatus, number>;

  units_by_blood_type: Record<BloodType, number>;

  chart_period_days: number;
}

export interface InstitutionDashboardData {
  summary: BloodRequestSummary;

  latestRequests: BloodRequestListItem[];

  latestDraft: BloodRequestDetails | null;
}

/*
|--------------------------------------------------------------------------
| List filters - API
|--------------------------------------------------------------------------
*/

export interface BloodRequestListFilters {
  search?: string;

  blood_type?: BloodType;

  priority?: BloodRequestPriority;

  status?: BloodRequestStatusFilter;

  date_from?: string;
  date_to?: string;

  date_field?: BloodRequestDateField;

  sort?: BloodRequestSort;

  page?: number;
  per_page?: number;
}

/*
|--------------------------------------------------------------------------
| UI filters
|--------------------------------------------------------------------------
*/

export interface BloodRequestUiFilters {
  status?: BloodRequestStatusFilter;

  blood_type?: BloodType;

  priority?: BloodRequestPriority;

  date_preset?: BloodRequestDatePreset;

  date_from?: string;
  date_to?: string;
}

export interface BloodRequestListResult {
  items: BloodRequestListItem[];
  meta: PaginationMeta;
}

/*
|--------------------------------------------------------------------------
| Create / Update
|--------------------------------------------------------------------------
*/

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

export type UpdateBloodRequestPayload = {
  version: number;

  blood_type: BloodType;

  units_required: number;

  priority: BloodRequestPriority;

  description: string;

  needed_at: string;

  notes?: string | null;

  recipient_ids: number[];
};

export interface CancelBloodRequestPayload {
  version: number;

  cancellation_reason: string;
}

export interface SubmitBloodRequestPayload {
  version: number;
}

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

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

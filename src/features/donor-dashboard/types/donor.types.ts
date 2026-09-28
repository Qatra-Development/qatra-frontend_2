export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type DonationPriority = "normal" | "urgent" | "emergency";

export type DonationCallStatus =
  | "active"
  | "fulfilled"
  | "closed"
  | "cancelled";

export type DonationResponseStatus = "interested" | "declined";

export type DonationProcessStatus =
  | "awaiting_contact"
  | "scheduled"
  | "completed"
  | "cancelled";

export type DonorAvailabilityStatus =
  | "available"
  | "temporarily_unavailable"
  | "unavailable";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  account_type: "donor";
  status: string;
  email_verified_at?: string | null;
}

export interface DonorAvailability {
  accepts_donation_requests: boolean;

  availability_status: DonorAvailabilityStatus;

  last_donation_at: string | null;
  next_eligible_at: string | null;

  is_eligible: boolean;
}

export interface DonationCallInstitution {
  id: number;
  name: string;
  governorate: string;
  address: string;
}

export interface DonorCallProcess {
  id: number;
  process_number: string;
  status: DonationProcessStatus;
  scheduled_at: string | null;
  unit_code: string | null;
}

export interface DonorCallResponse {
  status: DonationResponseStatus;
  responded_at: string;
  process: DonorCallProcess | null;
}

export interface DonationCallCounts {
  invitations_sent: number;
  responses: number;
  interested: number;
  completed_donations: number;
}

export interface DonorDonationCall {
  id: number;
  call_number: string;

  title: string;
  blood_type: BloodType;
  units_required: number;

  priority: DonationPriority;

  donation_location: string | null;
  needed_at: string | null;

  description: string;

  status: DonationCallStatus;

  institution?: DonationCallInstitution;

  counts: DonationCallCounts;

  is_targeted: boolean;

  my_response: DonorCallResponse | null;

  created_at: string | null;
  fulfilled_at: string | null;
  closed_at: string | null;
  cancelled_at: string | null;
}

export interface DonationCallsResponse {
  success: true;
  data: DonorDonationCall[];
  meta: PaginationMeta;
}

export interface DonationInstitution {
  id: number;
  name: string;
  type: string;
  governorate: string;
  address: string;
  same_region: boolean;
}

export interface DonationInstitutionsResponse {
  success: true;
  data: DonationInstitution[];
  meta: PaginationMeta;
}

export interface CreateVoluntaryDonationPayload {
  institution_id: number;
  note?: string;
}

export interface VoluntaryDonationProcess {
  id: number;
  process_number: string;
  status: DonationProcessStatus;

  scheduled_at: string | null;
  location: string | null;
}

export interface DonorVoluntaryDonationRequest {
  id: number;
  request_number: string;

  status: "pending" | "scheduled" | "completed" | "declined" | "cancelled";

  note: string | null;

  submitted_at: string;

  institution: {
    id: number;
    name: string;
    governorate: string;
    address: string;
  } | null;

  process: VoluntaryDonationProcess | null;
}

export interface DonationBloodUnit {
  id: number;
  unit_code: string;
  expires_at: string | null;
  status: string;
}

export interface DonationRecord {
  id: number;
  donation_date: string | null;
  blood_unit: DonationBloodUnit | null;
}

export interface DonationHistoryProcess {
  id: number;
  process_number: string;

  status: DonationProcessStatus;

  scheduled_at: string | null;
  location: string | null;
  instructions: string | null;

  completed_at: string | null;

  cancelled_at: string | null;
  cancellation_reason: string | null;

  institution?: {
    id: number;
    name: string;
  };

  donation_call?: {
    id: number;
    call_number: string;
    title: string;
  } | null;

  donation?: DonationRecord | null;

  created_at: string | null;
}

export interface DonationHistorySummary {
  total_donations: number;
  completed_donations: number;
  donations_this_year: number;
  institutions_donated_to: number;
}

export interface DonationHistoryResponse {
  success: true;

  data: DonationHistoryProcess[];

  summary: DonationHistorySummary;

  meta: PaginationMeta;
}

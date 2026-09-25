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

export type VoluntaryDonationRequestStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "declined"
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

export type BloodTypeCounts = Record<BloodType, number>;

export type StatusCounts<T extends string> = Record<T, number>;

export interface VoluntaryDonationDonor {
  id: number;
  name: string;
  phone: string;
  blood_type: BloodType;
  region: string;
  availability_status: DonorAvailabilityStatus;
  next_eligible_at: string | null;
}

export interface VoluntaryDonationProcess {
  id: number;
  process_number: string;
  status: DonationProcessStatus;
  scheduled_at: string | null;
}

export interface VoluntaryDonationRequest {
  id: number;
  request_number: string;
  status: VoluntaryDonationRequestStatus;
  note: string | null;
  submitted_at: string;

  donor: VoluntaryDonationDonor;

  process: VoluntaryDonationProcess | null;
}

export interface VoluntaryDonationRequestsMeta extends PaginationMeta {
  blood_type_counts: BloodTypeCounts;

  status_counts: StatusCounts<VoluntaryDonationRequestStatus>;
}

export interface VoluntaryDonationRequestsResponse {
  success: true;
  data: VoluntaryDonationRequest[];
  meta: VoluntaryDonationRequestsMeta;
}

export interface VoluntaryDonationFilters {
  search?: string;
  region?: string;
  blood_type?: BloodType;
  status?: VoluntaryDonationRequestStatus;
  page?: number;
  per_page?: number;
}

export interface ScheduleDonationPayload {
  scheduled_at: string;
  location?: string;
  instructions?: string;
}

export interface DonationProcessDonor {
  id: number;
  name: string | null;
  phone?: string | null;
  blood_type: BloodType;
  region: string;
}

export interface DonationProcessInstitution {
  id: number;
  name: string;
}

export interface DonationProcessCall {
  id: number;
  call_number: string;
  title: string;
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

export interface DonationProcess {
  id: number;
  process_number: string;
  status: DonationProcessStatus;

  scheduled_at: string | null;
  location: string | null;
  instructions: string | null;

  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;

  donor?: DonationProcessDonor;
  institution?: DonationProcessInstitution;

  donation_call?: DonationProcessCall | null;
  donation?: DonationRecord | null;

  created_at: string | null;
}

export interface DonationProcessesMeta extends PaginationMeta {
  blood_type_counts: BloodTypeCounts;

  status_counts: StatusCounts<DonationProcessStatus>;
}

export interface DonationProcessesResponse {
  success: true;
  data: DonationProcess[];
  meta: DonationProcessesMeta;
}

export interface DonationProcessFilters {
  status?: DonationProcessStatus;
  blood_type?: BloodType;
  search?: string;
  scheduled_from?: string;
  scheduled_to?: string;
  page?: number;
  per_page?: number;
}

export interface DonationCallInstitution {
  id: number;
  name: string;
  governorate: string;
  address: string;
}

export interface DonationCallCounts {
  invitations_sent: number;
  responses: number;
  interested: number;
  completed_donations: number;
}

export interface DonationCall {
  id: number;
  call_number: string;
  title: string;
  blood_type: BloodType;
  units_required: number;
  priority: DonationPriority;
  donation_location: string;
  needed_at: string | null;
  description: string;
  status: DonationCallStatus;

  institution?: DonationCallInstitution;

  counts: DonationCallCounts;

  is_targeted: boolean;
  my_response: unknown | null;

  created_at: string | null;
  fulfilled_at: string | null;
  closed_at: string | null;
  cancelled_at: string | null;
}

export interface DonationCallsMeta extends PaginationMeta {
  status_counts: StatusCounts<DonationCallStatus>;

  blood_type_counts: BloodTypeCounts;
}

export interface DonationCallsResponse {
  success: true;
  data: DonationCall[];
  meta: DonationCallsMeta;
}

export interface DonationCallFilters {
  search?: string;
  status?: DonationCallStatus;
  blood_type?: BloodType;
  priority?: DonationPriority;
  page?: number;
  per_page?: number;
}

export interface CreateDonationCallPayload {
  title: string;
  blood_type: BloodType;
  units_required: number;
  priority: DonationPriority;
  needed_at: string;
  donation_location?: string;
  description: string;
}

export interface MatchingDonor {
  id: number;
  name: string;
  blood_type: BloodType;
  region: string;

  donation_areas: string[];

  availability_status: DonorAvailabilityStatus;

  last_donation_at: string | null;
  next_eligible_at: string | null;

  invitation_sent: boolean;

  match: {
    blood_type: "exact" | "compatible";
    location: "same_region" | "donation_area";
  };
}

export interface MatchingDonorsMeta extends PaginationMeta {
  matching_basis: string[];
}

export interface MatchingDonorsResponse {
  success: true;
  data: MatchingDonor[];
  meta: MatchingDonorsMeta;
}

export interface MatchingDonorFilters {
  search?: string;
  region?: string;
  blood_type?: BloodType;

  invitation_status?: "sent" | "not_sent" | "any";

  page?: number;
  per_page?: number;
}

export interface DonationCallResponseProcess {
  id: number;
  process_number: string;
  status: DonationProcessStatus;
  scheduled_at: string | null;
  donation_recorded: boolean;
}

export interface DonationCallResponder {
  id: number;
  response_status: DonationResponseStatus;
  responded_at: string;
  note: string | null;

  donor: {
    id: number;
    name: string;
    blood_type: BloodType;
    region: string;
    availability_status: DonorAvailabilityStatus;
  };

  process: DonationCallResponseProcess | null;
}

export interface DonationRespondersSummary {
  invitations_sent: number;
  interested: number;
  declined: number;
  scheduled: number;
  completed_donations: number;
}

export interface DonationCallResponsesMeta extends PaginationMeta {
  summary: DonationRespondersSummary;
}

export interface DonationCallResponsesResponse {
  success: true;
  data: DonationCallResponder[];
  meta: DonationCallResponsesMeta;
}

export interface DonationCallResponseFilters {
  response_status?: DonationResponseStatus;
  blood_type?: BloodType;
  region?: string;
  page?: number;
  per_page?: number;
}

export interface CompleteDonationPayload {
  collected_at: string;
  notes?: string;
}

export interface UpcomingDonationProcess extends Omit<
  DonationProcess,
  "donor"
> {
  donor: DonationProcessDonor;
}

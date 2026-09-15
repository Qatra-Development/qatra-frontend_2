export type ApprovalRequestStatus = "pending_review" | "rejected";

export type InstitutionType =
  | "central_hospital"
  | "field_hospital"
  | "health_center"
  | "blood_bank_association"
  | "independent_blood_center";

export type ServiceScope =
  | "blood_request_only"
  | "blood_bank_services_only"
  | "blood_request_and_blood_bank";

export type DocumentStatus = "pending" | "approved" | "rejected";

export interface InstitutionDocument {
  id: number;
  institution_id: number;
  document_type: string;
  file_path: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface InstitutionRepresentativeUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface InstitutionRepresentative {
  id: number;
  institution_id: number;
  user_id: number;
  representative_name: string;
  created_at: string;
  updated_at: string;
  user: InstitutionRepresentativeUser;
}

export interface ApprovalInstitution {
  id: number;
  institution_name: string;
  institution_type: InstitutionType;
  license_number: string;

  address: string;
  governorate: string;

  phone_number: string;
  email: string;

  status: ApprovalRequestStatus;
  service_scope: ServiceScope;

  review_notes: string | null;

  verified_by: number | null;
  verified_at: string | null;

  created_at: string;
  updated_at: string;

  representative: InstitutionRepresentative;
  documents: InstitutionDocument[];

  verifier: unknown | null;
}

export interface LaravelPagination<T> {
  current_page: number;
  data: T[];

  from: number | null;
  to: number | null;

  last_page: number;
  per_page: number;
  total: number;

  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface ApprovalRequestsApiResponse {
  success: boolean;
  message?: string;
  data: LaravelPagination<ApprovalInstitution>;
}

export interface ApprovalRequestsCollection {
  items: ApprovalInstitution[];
  total: number;
}

export type ApprovalRequestsDataset = Record<
  ApprovalRequestStatus,
  ApprovalRequestsCollection
>;

export type ServiceScopeFilter = "all" | ServiceScope;

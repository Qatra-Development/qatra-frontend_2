export type InstitutionStatus =
  | "pending_verification"
  | "pending_review"
  | "needs_completion"
  | "approved"
  | "rejected";

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

export type InstitutionDocumentType =
  | "practice_license"
  | "commercial_registration"
  | "representative_authorization"
  | "quality_safety_certificate";

export type InstitutionDocumentStatus = "pending" | "approved" | "rejected";

export interface InstitutionDocument {
  id: number;
  institution_id: number;
  document_type: InstitutionDocumentType;
  file_path: string;
  status: InstitutionDocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface InstitutionVerifierUser {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;

  avatar_url?: string | null;
  image_url?: string | null;
  profile_photo_url?: string | null;
}

export interface InstitutionVerifier {
  id?: number;
  name?: string;

  avatar_url?: string | null;
  image_url?: string | null;
  profile_photo_url?: string | null;

  user?: InstitutionVerifierUser | null;
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

export interface AdminInstitution {
  id: number;
  institution_name: string;
  institution_type: InstitutionType;
  license_number: string;

  address: string;
  governorate: string;

  phone_number: string;
  email: string;

  status: InstitutionStatus;
  service_scope: ServiceScope;

  review_notes: string | null;

  verified_by: number | null;
  verified_at: string | null;

  created_at: string;
  updated_at: string;

  representative: InstitutionRepresentative;
  documents: InstitutionDocument[];
  verifier: InstitutionVerifier | null;
}

export interface LaravelPagination<T> {
  current_page: number;
  data: T[];

  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;

  from: number | null;
  to: number | null;

  last_page: number;
  per_page: number;
  total: number;
}

export interface InstitutionsApiResponse {
  success: boolean;
  message?: string;
  data: LaravelPagination<AdminInstitution>;
}

export interface InstitutionCollection {
  items: AdminInstitution[];
  total: number;
}

export type InstitutionsTab = "approved" | "removed";

export type ServiceScopeFilter = "all" | ServiceScope;

export interface InstitutionsDataset {
  approved: InstitutionCollection;
  removed: InstitutionCollection;
}

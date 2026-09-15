export interface InstitutionDocument {
  id: number;
  document_type: string;
  file_path?: string;
  status: "pending" | "approved" | "rejected" | string;
  created_at?: string;
  updated_at?: string;
}

export interface InstitutionRepresentative {
  id: number;
  representative_name: string;
  user_id?: number;
  institution_id?: number;
  phone?: string;
  email?: string;
  job_title?: string;
  position?: string;
  role?: string;
  created_at?: string;
  rejection_count?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at?: string;
  };
}

export interface InstitutionStatusData {
  institution_id: number;
  institution_name: string;
  institution_type: string;
  license_number: string;
  license_expiry_date?: string;
  address: string;
  city?: string;
  governorate: string;
  phone_number: string;
  email: string;
  service_scope: string;
  status:
    | "pending_verification"
    | "pending_review"
    | "needs_completion"
    | "approved"
    | "rejected"
    | string;
  review_notes?: string | null;
  created_at?: string;
  representative?: InstitutionRepresentative;
  documents?: InstitutionDocument[];
}

export interface InstitutionStatusResponse {
  success: boolean;
  message?: string;
  data: InstitutionStatusData;
}

export interface InstitutionResubmitResponse {
  success: boolean;
  message: string;
  data: {
    institution_id: number;
    status: "pending_review";
    review_notes: null;
  };
}

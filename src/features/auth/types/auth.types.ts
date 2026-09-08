export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  account_type: string;
  status: string;
}

export interface Institution {
  id: number;
  institution_name: string;
  institution_type: string;
  license_number: string;
  service_scope: string;
  status: string;
  review_notes: string | null;
}

export interface BackendLoginSuccessResponse {
  success: true;
  message: string;
  data: {
    user: User;
    token: string;
    institution?: Institution;
  };
}

export interface BackendLoginFailureResponse {
  success: false;
  message: string;
  data?: undefined;
}

export type BackendLoginResponse =
  | BackendLoginSuccessResponse
  | BackendLoginFailureResponse;

export interface AuthenticatedUser {
  user: User;
  institution?: Institution;
}

export interface LoginResponse {
  success: true;
  message: string;
  data: AuthenticatedUser;
}

export type PublicAuthResponse = {
  success: boolean;
  message: string;
  data?: {
    verification_email_sent?: boolean;
    [key: string]: unknown;
  };
};

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    registerDonor: "/auth/register/donor",
    registerInstitution: "/auth/register/health-institution",
    verifyInstitutionEmail: "/auth/verify-health-institution",
    resendInstitutionVerificationCode:
      "/auth/resend-health-institution-verification-code",
    verifyDonorEmail: "/auth/verify-email",
    resendDonorVerificationCode: "/auth/resend-verification-code",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  cases: {
    list: "/cases",
    show: (id: string | number) => `/cases/${id}`,
  },
  donations: {
    create: "/donations",
  },

  admin: {
    institutions: "/admin/institutions",

    institution: (institutionId: number | string) =>
      `/admin/institutions/${institutionId}`,

    document: (institutionId: number | string, documentId: number | string) =>
      `/admin/institutions/${institutionId}/documents/${documentId}`,

    downloadDocument: (
      institutionId: number | string,
      documentId: number | string,
    ) =>
      `/admin/institutions/${institutionId}/documents/${documentId}/download`,

    approveInstitution: (institutionId: number | string) =>
      `/admin/institutions/${institutionId}/approve`,

    requestCompletion: (institutionId: number | string) =>
      `/admin/institutions/${institutionId}/request-completion`,

    rejectInstitution: (institutionId: number | string) =>
      `/admin/institutions/${institutionId}/reject`,
  },
  institution: {
    status: "/institution/status",
    resubmit: "/institution/resubmit",
  },

  institutionBloodRequests: {
    base: "/institution/blood-requests",

    summary: "/institution/blood-requests/summary",

    suppliers: "/institution/blood-requests/suppliers",

    drafts: "/institution/blood-requests/drafts",

    detail: (requestId: number | string) =>
      `/institution/blood-requests/${requestId}`,

    submit: (requestId: number | string) =>
      `/institution/blood-requests/${requestId}/submit`,

    cancel: (requestId: number | string) =>
      `/institution/blood-requests/${requestId}/cancel`,
  },
} as const;

export const BFF_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    registerDonor: "/api/auth/register/donor",
    registerInstitution: "/api/auth/register/health-institution",
    verifyInstitutionEmail: "/api/auth/verify-health-institution",
    resendInstitutionVerificationCode:
      "/api/auth/resend-health-institution-verification-code",
    verifyDonorEmail: "/api/auth/verify-email",
    resendDonorVerificationCode: "/api/auth/resend-verification-code",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  backend: (path: string) => `/api/backend${path}`,
} as const;

export const backendProxyUrl = (backendPath: string) => {
  const normalizedPath = backendPath.startsWith("/")
    ? backendPath
    : `/${backendPath}`;

  return `/api/backend${normalizedPath}`;
};

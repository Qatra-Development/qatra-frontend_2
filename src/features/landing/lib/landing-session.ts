import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/src/lib/auth/constants";

import { LANDING_ROUTES } from "../config/landing.config";

export interface LandingSession {
  isAuthenticated: boolean;
  accountType?: string;
  dashboardHref: string;
  urgentResponseHref: string;
}

function getDashboardPath(
  accountType?: string,
  institutionStatus?: string,
  serviceScope?: string,
) {
  if (accountType === "health_authority_admin") {
    return LANDING_ROUTES.adminDashboard;
  }

  if (
    accountType === "health_institution" ||
    accountType === "institution" ||
    accountType === "hospital"
  ) {
    if (institutionStatus !== "approved") {
      return LANDING_ROUTES.institutionPending;
    }

    if (serviceScope === "blood_request_only") {
      return LANDING_ROUTES.institutionDashboard;
    }

    if (
      serviceScope === "blood_bank_services_only" ||
      serviceScope === "blood_request_and_blood_bank"
    ) {
      return LANDING_ROUTES.bloodBankDashboard;
    }

    return LANDING_ROUTES.institutionPending;
  }

  if (accountType === "donor") {
    return LANDING_ROUTES.donorDashboard;
  }

  return LANDING_ROUTES.home;
}

export async function getLandingSession(): Promise<LandingSession> {
  const cookieStore = await cookies();

  const isAuthenticated = cookieStore.has(AUTH_COOKIE_NAME);

  const accountType = cookieStore.get("account_type")?.value;

  const institutionStatus = cookieStore.get("institution_status")?.value;

  const serviceScope = cookieStore.get("service_scope")?.value;

  const dashboardHref = getDashboardPath(
    accountType,
    institutionStatus,
    serviceScope,
  );

  const urgentResponseHref =
    accountType === "donor"
      ? `${LANDING_ROUTES.donorDashboard}#donation-calls`
      : isAuthenticated
        ? dashboardHref
        : LANDING_ROUTES.login;

  return {
    isAuthenticated,
    accountType,
    dashboardHref,
    urgentResponseHref,
  };
}

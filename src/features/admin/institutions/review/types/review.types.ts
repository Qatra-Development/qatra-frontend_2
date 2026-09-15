export type ReviewStepId = 1 | 2 | 3 | 4;

export type InstitutionDecision = "approve" | "request_completion" | "reject";

export interface ReviewProgress {
  maxDays: number;
  elapsedDays: number;
  remainingDays: number;
  percentage: number;
}

export interface RequestedService {
  key: "blood_request" | "blood_bank";

  title: string;
  description: string;
}

export interface ReviewDecisionForm {
  decision: InstitutionDecision;
  notes?: string;
}

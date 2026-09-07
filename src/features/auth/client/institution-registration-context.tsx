"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { InstitutionDetailsData, InstitutionDocuments, InstitutionDocumentField, InstitutionFormErrors, InstitutionServiceScope } from "../types/institution-registration.types";

function useRegistrationDraft() {
  const [details, setDetails] = useState<InstitutionDetailsData | null>(null);
  const [documents, setDocuments] = useState<InstitutionDocuments>({});
  const [serviceScope, setServiceScope] = useState<InstitutionServiceScope>("blood_request_only");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<InstitutionFormErrors>({});

  const setDocument = (field: InstitutionDocumentField, file?: File) => {
    setDocuments((previous) => ({ ...previous, [field]: file }));
  };

  const clearDraft = () => {
    setDetails(null);
    setDocuments({});
    setServiceScope("blood_request_only");
    setTermsAccepted(false);
    setErrors({});
  };

  return { details, setDetails, documents, setDocument, serviceScope, setServiceScope, termsAccepted, setTermsAccepted, errors, setErrors, clearDraft };
}

const RegistrationContext = createContext<ReturnType<typeof useRegistrationDraft> | null>(null);

export function InstitutionRegistrationProvider({ children }: { children: ReactNode }) {
  // Keep passwords and documents in memory only; the shared auth layout survives step navigation.
  const draft = useRegistrationDraft();
  return <RegistrationContext.Provider value={draft}>{children}</RegistrationContext.Provider>;
}

export function useInstitutionRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) throw new Error("Institution registration requires InstitutionRegistrationProvider.");
  return context;
}

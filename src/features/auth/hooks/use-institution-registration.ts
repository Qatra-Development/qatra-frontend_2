"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInstitutionRegistration } from "../client/institution-registration-context";
import { INSTITUTION_FIELD_MAP } from "../constants/institution-registration";
import { institutionDetailsSchema, institutionDocumentSchema, institutionRegistrationSchema } from "../schemas/institution-registration.schema";
import { registerInstitution } from "../services/auth.service";
import type { InstitutionDetailsValues, InstitutionDocumentField, InstitutionFormErrors } from "../types/institution-registration.types";
import { ApiError, getApiErrorMessage } from "@/src/lib/api/errors";

const EMPTY_DETAILS: InstitutionDetailsValues = {
  institutionName: "", institutionType: "", licenseNumber: "", address: "", governorate: "",
  representativeName: "", phone: "", email: "", password: "", passwordConfirmation: "",
};

function validationErrors(issues: readonly { path: PropertyKey[]; message: string }[]): InstitutionFormErrors {
  const errors: InstitutionFormErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] === "documents" ? issue.path[1] : issue.path[0]);
    errors[key] ??= issue.message;
  }
  return errors;
}

export function useInstitutionDetailsForm() {
  const router = useRouter();
  const draft = useInstitutionRegistration();
  const [values, setValues] = useState<InstitutionDetailsValues>(draft.details ?? EMPTY_DETAILS);

  const setField = (field: keyof InstitutionDetailsValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    draft.setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = institutionDetailsSchema.safeParse(values);
    if (!parsed.success) {
      draft.setErrors(validationErrors(parsed.error.issues));
      toast.error(parsed.error.issues[0]?.message);
      return;
    }
    draft.setDetails(parsed.data);
    draft.setErrors({});
    router.push("/HospitalDocuments");
  };

  return { values, setField, errors: draft.errors, handleSubmit };
}

export function useInstitutionDocumentsForm() {
  const router = useRouter();
  const draft = useInstitutionRegistration();
  const [isLoading, setIsLoading] = useState(false);
  const submitting = useRef(false);

  const selectDocument = (field: InstitutionDocumentField, file: File) => {
    const parsed = institutionDocumentSchema.safeParse(file);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message;
      draft.setDocument(field);
      draft.setErrors((previous) => ({ ...previous, [field]: message }));
      toast.error(message);
      return;
    }
    draft.setDocument(field, parsed.data);
    draft.setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !draft.details) return;
    const parsed = institutionRegistrationSchema.safeParse({ ...draft.details, serviceScope: draft.serviceScope, documents: draft.documents });
    if (!parsed.success) {
      draft.setErrors(validationErrors(parsed.error.issues));
      toast.error(parsed.error.issues[0]?.message);
      return;
    }
    if (!draft.termsAccepted) {
      draft.setErrors({ termsAccepted: "يجب الموافقة على الشروط والإقرار بصحة البيانات والوثائق." });
      return;
    }
    submitting.current = true;
    setIsLoading(true);
    draft.setErrors({});
    try {
      const response = await registerInstitution(parsed.data);
      const email = parsed.data.email;
      draft.clearDraft();
      toast.success(response.message || "تم إرسال طلب المؤسسة. يرجى التحقق من بريدك الإلكتروني.");
      router.replace(`/verify?email=${encodeURIComponent(email)}&type=institution`);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        const errors: InstitutionFormErrors = {};
        for (const [apiField, messages] of Object.entries(error.fieldErrors)) {
          const field = Object.entries(INSTITUTION_FIELD_MAP).find(([, value]) => value === apiField)?.[0]
            ?? (apiField === "service_scope" ? "serviceScope" : apiField);
          errors[field] = messages[0];
        }
        draft.setErrors(errors);
      }
      toast.error(getApiErrorMessage(error));
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };

  return { ...draft, isLoading, selectDocument, handleSubmit };
}

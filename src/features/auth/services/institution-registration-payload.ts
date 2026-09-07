import { INSTITUTION_DOCUMENTS, INSTITUTION_FIELD_MAP } from "../constants/institution-registration";
import type { InstitutionRegistrationData } from "../types/institution-registration.types";

export function buildInstitutionFormData(data: InstitutionRegistrationData): FormData {
  const body = new FormData();
  for (const [field, apiField] of Object.entries(INSTITUTION_FIELD_MAP)) {
    body.set(apiField, data[field as keyof typeof INSTITUTION_FIELD_MAP]);
  }
  body.set("service_scope", data.serviceScope);
  for (const { field } of INSTITUTION_DOCUMENTS) {
    body.set(field, data.documents[field]);
  }
  return body;
}

export function readInstitutionFormData(body: FormData) {
  return {
    ...Object.fromEntries(Object.entries(INSTITUTION_FIELD_MAP).map(([field, apiField]) => [field, body.get(apiField)])),
    serviceScope: body.get("service_scope"),
    documents: Object.fromEntries(INSTITUTION_DOCUMENTS.map(({ field }) => [field, body.get(field)])),
  };
}

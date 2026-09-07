import type { z } from "zod";
import type { institutionDetailsSchema, institutionRegistrationSchema } from "../schemas/institution-registration.schema";
import type { INSTITUTION_DOCUMENTS, SERVICE_SCOPES } from "../constants/institution-registration";

export type InstitutionDetailsData = z.infer<typeof institutionDetailsSchema>;
export type InstitutionDetailsValues = Record<keyof InstitutionDetailsData, string>;
export type InstitutionRegistrationData = z.infer<typeof institutionRegistrationSchema>;
export type InstitutionDocumentField = (typeof INSTITUTION_DOCUMENTS)[number]["field"];
export type InstitutionDocuments = Partial<Record<InstitutionDocumentField, File>>;
export type InstitutionServiceScope = (typeof SERVICE_SCOPES)[number]["value"];
export type InstitutionFormErrors = Record<string, string | undefined>;

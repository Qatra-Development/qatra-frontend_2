"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  AdminInstitution,
  InstitutionDocumentStatus,
} from "../../types/institutions.types";

import {
  approveInstitution,
  fetchInstitutionDocument,
  getInstitutionForReview,
  rejectInstitution,
  requestInstitutionCompletion,
  updateDocumentStatus,
} from "../services/institution-review.service";

import { getDocumentFileName } from "../lib/review.utils";

import type { InstitutionDecision } from "../types/review.types";
import { toast } from "sonner";

export function useInstitutionReview(institutionId: string) {
  const [institution, setInstitution] = useState<AdminInstitution | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [documentUpdatingId, setDocumentUpdatingId] = useState<number | null>(
    null,
  );

  const [fileLoadingId, setFileLoadingId] = useState<number | null>(null);

  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  const loadInstitution = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setError(null);

        const data = await getInstitutionForReview(institutionId, signal);

        setInstitution(data);
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "تعذر تحميل بيانات المؤسسة.";

        setError(message);

        toast.error(message);
      }
    },
    [institutionId],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);

        await loadInstitution(controller.signal);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [loadInstitution]);

  async function reviewDocument(
    documentId: number,
    status: InstitutionDocumentStatus,
  ) {
    try {
      setDocumentUpdatingId(documentId);

      const response = await updateDocumentStatus(
        institutionId,
        documentId,
        status,
      );

      toast.success(
        response.message ||
          (status === "approved" ? "تم اعتماد المستند." : "تم رفض المستند."),
      );

      await loadInstitution();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحديث المستند.",
      );
    } finally {
      setDocumentUpdatingId(null);
    }
  }

  async function viewDocument(documentId: number) {
    const previewWindow = window.open("about:blank", "_blank");

    if (!previewWindow) {
      toast.error("تعذر فتح نافذة عرض المستند. يرجى السماح بالنوافذ المنبثقة.");
      return;
    }

    // يمنع الصفحة المعروضة من الوصول للنافذة الأصلية.
    previewWindow.opener = null;

    try {
      setFileLoadingId(documentId);

      const blob = await fetchInstitutionDocument(institutionId, documentId);

      const objectUrl = URL.createObjectURL(blob);

      previewWindow.location.replace(objectUrl);

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      previewWindow.close();

      toast.error(error instanceof Error ? error.message : "تعذر عرض المستند.");
    } finally {
      setFileLoadingId(null);
    }
  }

  async function downloadDocument(documentId: number, filePath: string) {
    try {
      setFileLoadingId(documentId);

      const blob = await fetchInstitutionDocument(institutionId, documentId);

      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = objectUrl;

      anchor.download = getDocumentFileName(filePath);

      document.body.appendChild(anchor);

      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحميل المستند.",
      );
    } finally {
      setFileLoadingId(null);
    }
  }

  async function submitDecision(decision: InstitutionDecision, notes?: string) {
    try {
      setIsSubmittingDecision(true);

      let response: {
        message?: string;
      };

      switch (decision) {
        case "approve":
          response = await approveInstitution(institutionId);
          break;

        case "request_completion":
          response = await requestInstitutionCompletion(
            institutionId,
            notes ?? "",
          );
          break;

        case "reject":
          response = await rejectInstitution(institutionId, notes ?? "");
          break;
      }

      toast.success(response.message || "تم تنفيذ القرار بنجاح.");

      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تنفيذ القرار.",
      );

      return false;
    } finally {
      setIsSubmittingDecision(false);
    }
  }

  return {
    institution,
    isLoading,
    error,

    documentUpdatingId,
    fileLoadingId,

    isSubmittingDecision,

    reviewDocument,
    viewDocument,
    downloadDocument,
    submitDecision,

    retry: () => loadInstitution(),
  };
}

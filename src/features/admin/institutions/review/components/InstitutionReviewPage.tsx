"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import ReviewHeader from "./ReviewHeader";
import ReviewStepper from "./ReviewStepper";
import ReviewFooter from "./ReviewFooter";

import InstitutionDataStep from "./steps/InstitutionDataStep";
import ServicesDocumentsStep from "./steps/ServicesDocumentsStep";
import RequestInformationStep from "./steps/RequestInformationStep";
import DecisionStep from "./steps/DecisionStep";

import { useInstitutionReview } from "../hooks/useInstitutionReview";

import { REVIEW_STEPS } from "../config/review.config";

import { areRequiredDocumentsApproved } from "../lib/review.utils";

import { reviewDecisionSchema } from "../schemas/review-decision.schema";

import type { InstitutionDecision, ReviewStepId } from "../types/review.types";

interface Props {
  institutionId: string;
}

export default function InstitutionReviewPage({ institutionId }: Props) {
  const router = useRouter();

  const {
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

    retry,
  } = useInstitutionReview(institutionId);

  const [currentStep, setCurrentStep] = useState<ReviewStepId>(1);

  const [decision, setDecision] = useState<InstitutionDecision | null>(null);

  const [notes, setNotes] = useState("");

  const [validationError, setValidationError] = useState<string>();

  if (isLoading) {
    return <ReviewPageSkeleton />;
  }

  if (error || !institution) {
    return (
      <ReviewErrorState
        message={error || "تعذر تحميل المؤسسة."}
        onRetry={retry}
      />
    );
  }

  const current = REVIEW_STEPS.find((step) => step.id === currentStep)!;

  const canApprove =
    institution.status === "pending_review" &&
    areRequiredDocumentsApproved(institution);

  function nextStep() {
    setCurrentStep((step) => Math.min(4, step + 1) as ReviewStepId);
  }

  function previousStep() {
    setCurrentStep((step) => Math.max(1, step - 1) as ReviewStepId);
  }

  function handleDecisionChange(value: InstitutionDecision) {
    setDecision(value);
    setNotes("");
    setValidationError(undefined);
  }

  async function confirmDecision() {
    if (!decision) return;

    if (decision === "approve" && !canApprove) {
      return;
    }

    const result = reviewDecisionSchema.safeParse(
      decision === "approve"
        ? {
            decision,
          }
        : {
            decision,
            notes,
          },
    );

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message);

      return;
    }

    setValidationError(undefined);

    const success = await submitDecision(
      decision,
      decision === "approve" ? undefined : notes.trim(),
    );

    if (!success) return;

    router.replace("/dashboard/institutions");

    router.refresh();
  }

  return (
    <div dir="rtl" className="space-y-6">
      <ReviewHeader institution={institution} />

      <section
        className="
          admin-card
          overflow-hidden
          px-4 py-5
          sm:px-6
        "
      >
        <ReviewStepper currentStep={currentStep} />

        <div
          className="
            px-0
            pt-7
            sm:px-4
          "
        >
          {currentStep === 1 && (
            <InstitutionDataStep institution={institution} />
          )}

          {currentStep === 2 && (
            <ServicesDocumentsStep
              institution={institution}
              documentUpdatingId={documentUpdatingId}
              fileLoadingId={fileLoadingId}
              onReviewDocument={reviewDocument}
              onViewDocument={viewDocument}
              onDownloadDocument={downloadDocument}
            />
          )}

          {currentStep === 3 && (
            <RequestInformationStep institution={institution} />
          )}

          {currentStep === 4 && (
            <DecisionStep
              decision={decision}
              notes={notes}
              error={validationError}
              canApprove={canApprove}
              onDecisionChange={handleDecisionChange}
              onNotesChange={(value) => {
                setNotes(value);
                setValidationError(undefined);
              }}
            />
          )}

          <ReviewFooter
            previousDisabled={currentStep === 1}
            nextLabel={currentStep < 4 ? current.nextLabel : undefined}
            showConfirm={currentStep === 4 && decision !== null}
            confirmDisabled={decision === "approve" && !canApprove}
            isSubmitting={isSubmittingDecision}
            onPrevious={previousStep}
            onNext={currentStep < 4 ? nextStep : undefined}
            onConfirm={currentStep === 4 ? confirmDecision : undefined}
          />
        </div>
      </section>
    </div>
  );
}

function ReviewPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-72 rounded bg-gray-200" />

        <div className="mt-3 h-4 w-52 rounded bg-gray-100" />
      </div>

      <div
        className="
          h-[600px]
          rounded-[var(--admin-card-radius)]
          bg-white
        "
      />
    </div>
  );
}

function ReviewErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      className="
        admin-card
        flex min-h-[420px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <h2
        className="
          text-lg
          font-bold
          text-[var(--admin-text-primary)]
        "
      >
        تعذر تحميل طلب الاعتماد
      </h2>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-[var(--admin-text-muted)]
        "
      >
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="admin-btn-primary mt-5"
      >
        إعادة المحاولة
      </button>
    </section>
  );
}

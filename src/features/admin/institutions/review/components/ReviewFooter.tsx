import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  previousDisabled?: boolean;

  nextLabel?: string;

  showConfirm?: boolean;
  confirmDisabled?: boolean;

  isSubmitting?: boolean;

  onPrevious: () => void;
  onNext?: () => void;
  onConfirm?: () => void;
}

export default function ReviewFooter({
  previousDisabled = false,

  nextLabel,

  showConfirm = false,
  confirmDisabled = false,

  isSubmitting = false,

  onPrevious,
  onNext,
  onConfirm,
}: Props) {
  return (
    <footer
      dir="rtl"
      className="
        mt-8
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <button
        type="button"
        disabled={previousDisabled}
        onClick={onPrevious}
        className="
          admin-btn-secondary
          inline-flex
          items-center
          gap-2
        "
      >
        <ArrowRight className="h-4 w-4" />
        السابق
      </button>

      {nextLabel && onNext && (
        <button
          type="button"
          onClick={onNext}
          className="
              admin-btn-primary
              inline-flex
              items-center
              gap-2
            "
        >
          التالي: {nextLabel}
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      {showConfirm && onConfirm && (
        <button
          type="button"
          disabled={confirmDisabled || isSubmitting}
          onClick={onConfirm}
          className="
              admin-btn-primary
              inline-flex
              items-center
              gap-2
            "
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          تأكيد
        </button>
      )}
    </footer>
  );
}

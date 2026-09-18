"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { cancelBloodRequest } from "../services/blood-request.service";

import type { BloodRequestDetails } from "../types/blood-request.types";

import styles from "../blood-requests.module.css";

interface Props {
  request: BloodRequestDetails;

  onClose: () => void;

  onSuccess: (request: BloodRequestDetails) => void;
}

export function CancelBloodRequestModal({
  request,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function confirmCancel() {
    const normalized = reason.trim();

    if (!normalized) {
      setError("سبب الإلغاء مطلوب.");

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cancelBloodRequest(request.id, {
        version: request.version,
        cancellation_reason: normalized,
      });

      onSuccess(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "تعذر إلغاء الطلب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section className={styles.cancelModal} dir="rtl">
        <button
          type="button"
          className={styles.cancelModalClose}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h2>تأكيد إلغاء الطلب</h2>

        <p>
          لن يُحذف الطلب، وسيبقى في السجل بحالة «ملغي». لا يمكن التراجع بعد
          التأكيد.
        </p>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            سبب الإلغاء <b className={styles.required}>*</b>
          </span>

          <textarea
            className={styles.cancelTextarea}
            value={reason}
            placeholder="وضح سبب عدم الحاجة للطلب..."
            onChange={(event) => {
              setReason(event.target.value);

              setError(null);
            }}
          />
        </label>

        {error ? <p className={styles.formError}>{error}</p> : null}

        <div className={styles.cancelActions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={loading}
            onClick={() => void confirmCancel()}
          >
            {loading ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            disabled={loading}
            onClick={onClose}
          >
            تراجع
          </button>
        </div>
      </section>
    </div>
  );
}

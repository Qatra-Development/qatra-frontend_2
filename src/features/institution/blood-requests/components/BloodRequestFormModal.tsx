"use client";

import { useEffect } from "react";

import { CalendarDays, Clock3, X } from "lucide-react";

import {
  BLOOD_TYPES,
  type BloodRequestDetails,
} from "../types/blood-request.types";

import { useBloodRequestForm } from "../hooks/useBloodRequestForm";

import { SupplierSelector } from "./SupplierSelector";

import styles from "../blood-requests.module.css";

interface Props {
  mode: "create" | "edit";

  request?: BloodRequestDetails;

  onClose: () => void;

  onSuccess: (request: BloodRequestDetails) => void;
}

export function BloodRequestFormModal({
  mode,
  request,
  onClose,
  onSuccess,
}: Props) {
  const {
    form,
    suppliers,

    loadingSuppliers,
    submitting,

    error,

    updateField,
    toggleRecipient,
    submit,
  } = useBloodRequestForm({
    mode,
    request,
    onSuccess,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className={styles.formModal} dir="rtl">
        <header className={styles.modalHeader}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>

          <div>
            <span className={styles.modalEyebrow}>طلب دم</span>

            <h2 className={styles.modalTitle}>
              {mode === "edit"
                ? `تعديل الطلب ${request?.request_number ?? ""}`
                : "إنشاء طلب دم جديد"}
            </h2>
          </div>
        </header>

        <div className={styles.formModalBody}>
          <div className={styles.formSection}>
            <label className={styles.fieldLabel}>فصيلة الدم</label>

            <div className={styles.bloodTypeFormGrid}>
              {BLOOD_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`${styles.bloodTypeButton} ${
                    form.blood_type === type ? styles.bloodTypeButtonActive : ""
                  }`}
                  onClick={() => updateField("blood_type", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGrid2}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>درجة الاستعجال</span>

              <select
                className={styles.input}
                value={form.priority}
                onChange={(event) =>
                  updateField(
                    "priority",
                    event.target.value as typeof form.priority,
                  )
                }
              >
                <option value="">اختر الدرجة</option>

                <option value="normal">عادي</option>

                <option value="urgent">عاجل</option>

                <option value="emergency">طارئ</option>
              </select>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>عدد الوحدات</span>

              <input
                type="number"
                min="1"
                step="1"
                className={styles.input}
                value={form.units_required}
                onChange={(event) =>
                  updateField("units_required", event.target.value)
                }
              />
            </label>
          </div>

          <div className={styles.formGrid2}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>تاريخ الحاجة</span>

              <span className={styles.inputWithIcon}>
                <CalendarDays size={16} />

                <input
                  type="date"
                  value={form.needed_date}
                  onChange={(event) =>
                    updateField("needed_date", event.target.value)
                  }
                />
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>وقت الحاجة</span>

              <span className={styles.inputWithIcon}>
                <Clock3 size={16} />

                <input
                  type="time"
                  value={form.needed_time}
                  onChange={(event) =>
                    updateField("needed_time", event.target.value)
                  }
                />
              </span>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>سبب الطلب</span>

            <textarea
              className={styles.textarea}
              value={form.description}
              placeholder="اكتب سبب طلب الدم..."
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
          </label>

          <div className={styles.formSection}>
            <label className={styles.fieldLabel}>اختر الجهة المورّدة</label>

            <p className={styles.fieldHint}>
              تظهر فقط الجهات المسجلة التي تملك كامل الكمية المطلوبة، ثم تُرتب
              حسب المنطقة والتوفر.
            </p>

            <SupplierSelector
              suppliers={suppliers}
              existingRecipients={request?.recipients}
              selectedIds={form.recipient_ids}
              loading={loadingSuppliers}
              onToggle={toggleRecipient}
            />
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>ملاحظات الطلب</span>

            <textarea
              className={styles.textarea}
              value={form.notes}
              placeholder="معلومات ضرورية دون بيانات شخصية للمريض"
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </label>

          {error ? <p className={styles.formError}>{error}</p> : null}
        </div>

        <footer className={styles.modalFooter}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={submitting}
            onClick={() => void submit()}
          >
            {submitting
              ? "جاري الحفظ..."
              : mode === "edit"
                ? "تعديل الطلب"
                : "إنشاء الطلب"}
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            disabled={submitting}
            onClick={onClose}
          >
            {mode === "edit" ? "إلغاء التعديل" : "إلغاء"}
          </button>
        </footer>
      </section>
    </div>
  );
}

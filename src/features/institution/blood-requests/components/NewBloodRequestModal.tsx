"use client";

import { Loader2, X } from "lucide-react";

import {
  BLOOD_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
} from "../config/blood-request.config";

import type { BloodRequestPriority } from "../types/blood-request.types";

import { useCreateBloodRequest } from "../hooks/useCreateBloodRequest";
import { SupplierSelector } from "./SupplierSelector";

interface Props {
  open: boolean;

  onClose: () => void;

  onCreated: () => void;
}

export default function NewBloodRequestModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const {
    form,
    errors,

    suppliers,
    loadingSuppliers,

    submitting,
    savingDraft,

    canSubmit,
    canSearchSuppliers,

    updateField,
    toggleSupplier,

    submit,
    saveDraft,
  } = useCreateBloodRequest(onCreated);

  if (!open) {
    return null;
  }

  async function handleSubmit() {
    const success = await submit();

    if (success) {
      onClose();
    }
  }

  async function handleDraft() {
    const success = await saveDraft();

    if (success) {
      onClose();
    }
  }

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-[100]
        flex
        items-center
        justify-center
        bg-[var(--institution-overlay)]
        p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[590px]
          overflow-hidden
          rounded-[22px]
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-[var(--admin-border-soft)]
            px-6 py-5
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-bold
                text-[var(--admin-danger)]
              "
            >
              طلب جديد
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-bold
                text-[var(--admin-text-primary)]
              "
            >
              إنشاء طلب دم
            </h2>
          </div>

          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="
              flex h-8 w-8
              items-center
              justify-center
              rounded-full
              text-gray-400
              transition
              hover:bg-gray-100
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="
            max-h-[72vh]
            overflow-y-auto
            px-6 py-5
          "
        >
          {/* Blood type */}
          <FormGroup label="فصيلة الدم" error={errors.blood_type}>
            <div
              className="
                grid
                grid-cols-4
                gap-2
              "
            >
              {BLOOD_TYPE_OPTIONS.map((option) => {
                const selected = form.blood_type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("blood_type", option.value)}
                    className={`
        rounded-lg
        border
        px-3
        py-2
        text-sm
        font-medium
        transition
        ${
          selected
            ? "border-[var(--institution-chart-primary)] bg-[var(--institution-chart-primary)] text-white"
            : "border-[var(--admin-border)] bg-white text-[var(--admin-text-primary)]"
        }
      `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </FormGroup>

          <div
            className="
              mt-4 grid
              gap-4
              sm:grid-cols-2
            "
          >
            <FormGroup label="درجة الاستعجال" error={errors.priority}>
              <select
                value={form.priority}
                onChange={(event) =>
                  updateField(
                    "priority",
                    event.target.value as BloodRequestPriority | "",
                  )
                }
                className="
                  institution-control
                  w-full
                  px-3
                  text-xs
                  text-[var(--admin-text-secondary)]
                "
              >
                <option value="">اختر الدرجة</option>

                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="عدد الوحدات" error={errors.units_required}>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={form.units_required}
                onChange={(event) =>
                  updateField("units_required", event.target.value)
                }
                placeholder="أدخل العدد"
                className="
                  institution-control
                  w-full
                  px-3
                  text-xs
                "
              />
            </FormGroup>
          </div>

          <div
            className="
              mt-4 grid
              gap-4
              sm:grid-cols-2
            "
          >
            <FormGroup label="تاريخ الحاجة" error={errors.needed_date}>
              <input
                type="date"
                value={form.needed_date}
                onChange={(event) =>
                  updateField("needed_date", event.target.value)
                }
                className="
                  institution-control
                  w-full
                  px-3
                  text-xs
                "
              />
            </FormGroup>

            <FormGroup label="وقت الحاجة" error={errors.needed_time}>
              <input
                type="time"
                value={form.needed_time}
                onChange={(event) =>
                  updateField("needed_time", event.target.value)
                }
                className="
                  institution-control
                  w-full
                  px-3
                  text-xs
                "
              />
            </FormGroup>
          </div>

          <div className="mt-4">
            <FormGroup label="سبب الطلب" error={errors.description}>
              <textarea
                rows={3}
                maxLength={2000}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="مثال: حالة حرجة في غرفة العمليات"
                className="
                  institution-control
                  w-full
                  resize-y
                  px-3 py-3
                  text-xs
                  leading-5
                "
              />
            </FormGroup>
          </div>

          <div className="mt-5">
            <SupplierSelector
              suppliers={suppliers}
              selectedIds={form.recipient_ids}
              loading={loadingSuppliers}
              enabled={canSearchSuppliers}
              onToggle={toggleSupplier}
            />

            {errors.recipient_ids && (
              <p
                className="
                  mt-1.5
                  text-[10px]
                  text-[var(--admin-danger)]
                "
              >
                {errors.recipient_ids}
              </p>
            )}
          </div>

          <div className="mt-5">
            <FormGroup label="ملاحظات الطلب" error={errors.notes}>
              <textarea
                rows={3}
                maxLength={2000}
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="معلومات ضرورية دون بيانات شخصية للمريض"
                className="
                  institution-control
                  w-full
                  resize-y
                  px-3 py-3
                  text-xs
                  leading-5
                "
              />
            </FormGroup>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-[var(--admin-border-soft)]
            px-6 py-4
          "
        >
          <button
            type="button"
            disabled={savingDraft || submitting}
            onClick={handleDraft}
            className="admin-btn-secondary"
          >
            {savingDraft ? "جاري الحفظ..." : "حفظ كمسودة"}
          </button>

          <button
            type="button"
            disabled={!canSubmit || submitting || savingDraft}
            onClick={handleSubmit}
            className="
              admin-btn-primary
              inline-flex
              items-center
              gap-2
            "
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            إرسال الطلب
          </button>
        </div>
      </div>
    </div>
  );
}

function FormGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="
          mb-2 block
          text-xs
          font-bold
          text-[var(--admin-text-primary)]
        "
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          className="
            mt-1.5
            text-[10px]
            text-[var(--admin-danger)]
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

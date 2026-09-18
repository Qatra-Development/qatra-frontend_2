"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createBloodRequest,
  getBloodSuppliers,
  updateBloodRequest,
} from "../services/blood-request.service";

import {
  emptyBloodRequestForm,
  neededAtFromForm,
  requestToFormValues,
} from "../lib/blood-request.utils";

import type {
  BloodRequestDetails,
  BloodRequestFormValues,
  BloodSupplier,
} from "../types/blood-request.types";

interface Options {
  mode: "create" | "edit";

  request?: BloodRequestDetails;

  onSuccess?: (request: BloodRequestDetails) => void;
}

export function useBloodRequestForm({ mode, request, onSuccess }: Options) {
  const [form, setForm] = useState<BloodRequestFormValues>(
    request ? requestToFormValues(request) : emptyBloodRequestForm(),
  );

  const [suppliers, setSuppliers] = useState<BloodSupplier[]>([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const units = Number(form.units_required);

  const supplierQueryReady =
    Boolean(form.blood_type) && Number.isInteger(units) && units > 0;

  useEffect(() => {
    if (!supplierQueryReady) {
      return;
    }

    const controller = new AbortController();

    async function loadSuppliers() {
      setLoadingSuppliers(true);

      try {
        const result = await getBloodSuppliers(
          form.blood_type,
          units,
          controller.signal,
        );

        setSuppliers(result.items);
      } catch {
        if (!controller.signal.aborted) {
          setSuppliers([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSuppliers(false);
        }
      }
    }

    void loadSuppliers();

    return () => controller.abort();
  }, [form.blood_type, form.units_required, supplierQueryReady, units]);

  function updateField<K extends keyof BloodRequestFormValues>(
    field: K,
    value: BloodRequestFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...((field === "blood_type" || field === "units_required") && {
        recipient_ids: [],
      }),
    }));

    setError(null);
  }

  function toggleRecipient(recipientId: number) {
    setForm((current) => {
      const exists = current.recipient_ids.includes(recipientId);

      return {
        ...current,

        recipient_ids: exists
          ? current.recipient_ids.filter((id) => id !== recipientId)
          : [...current.recipient_ids, recipientId],
      };
    });
  }

  const validationError = useMemo(() => {
    if (!form.blood_type) {
      return "اختر فصيلة الدم.";
    }

    if (!Number.isInteger(units) || units <= 0) {
      return "أدخل عدد وحدات صحيح.";
    }

    if (!form.priority) {
      return "اختر درجة الاستعجال.";
    }

    if (!form.needed_date || !form.needed_time) {
      return "حدد تاريخ ووقت الحاجة.";
    }

    const neededAt = neededAtFromForm(form.needed_date, form.needed_time);

    if (!neededAt) {
      return "تاريخ الحاجة غير صحيح.";
    }

    if (!form.description.trim()) {
      return "اكتب سبب الطلب.";
    }

    if (form.recipient_ids.length === 0) {
      return "اختر جهة موردة واحدة على الأقل.";
    }

    return null;
  }, [form, units]);

  async function submit() {
    setError(null);

    if (validationError) {
      setError(validationError);
      return;
    }

    const neededAt = neededAtFromForm(form.needed_date, form.needed_time);

    if (!neededAt || !form.blood_type || !form.priority) {
      return;
    }

    if (new Date(neededAt).getTime() <= Date.now()) {
      setError("وقت الحاجة يجب أن يكون في المستقبل.");
      return;
    }

    setSubmitting(true);

    try {
      let result: BloodRequestDetails;

      if (mode === "edit") {
        if (!request) {
          throw new Error("تعذر تحديد الطلب المطلوب تعديله.");
        }

        result = await updateBloodRequest(request.id, {
          version: request.version,

          blood_type: form.blood_type,

          units_required: units,

          priority: form.priority,

          description: form.description.trim(),

          needed_at: neededAt,

          notes: form.notes.trim() || null,

          recipient_ids: form.recipient_ids,
        });
      } else {
        const createdRequest = await createBloodRequest({
          blood_type: form.blood_type,

          units_required: units,

          priority: form.priority,

          description: form.description.trim(),

          needed_at: neededAt,

          ...(form.notes.trim()
            ? {
                notes: form.notes.trim(),
              }
            : {}),

          recipient_ids: form.recipient_ids,
        });

        result = createdRequest.request;
      }

      onSuccess?.(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "تعذر حفظ الطلب.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    suppliers,

    loadingSuppliers,
    submitting,

    error,
    validationError,

    updateField,
    toggleRecipient,
    submit,
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";

import { createBloodRequestSchema } from "../schemas/blood-request.schema";

import {
  buildCreatePayload,
  buildDraftPayload,
} from "../lib/blood-request.utils";

import {
  createBloodRequest,
  getBloodSuppliers,
  saveBloodRequestDraft,
} from "../services/blood-request.service";

import type {
  BloodRequestFormValues,
  BloodSupplier,
} from "../types/blood-request.types";
import { toast } from "sonner";

const INITIAL_FORM: BloodRequestFormValues = {
  blood_type: "",

  units_required: "",

  priority: "",

  needed_date: "",
  needed_time: "",

  description: "",
  notes: "",

  recipient_ids: [],
};

export function useCreateBloodRequest(onSuccess: () => void) {
  const [form, setForm] = useState<BloodRequestFormValues>(INITIAL_FORM);

  const [suppliers, setSuppliers] = useState<BloodSupplier[]>([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [savingDraft, setSavingDraft] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const units = Number(form.units_required);

  const canSearchSuppliers = Boolean(
    form.blood_type && Number.isInteger(units) && units > 0,
  );

  useEffect(() => {
    if (!canSearchSuppliers) {
      setSuppliers([]);

      setForm((current) => ({
        ...current,
        recipient_ids: [],
      }));

      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setLoadingSuppliers(true);

        const result = await getBloodSuppliers(
          form.blood_type,
          units,
          controller.signal,
        );

        setSuppliers(result.items);

        setForm((current) => ({
          ...current,

          recipient_ids: current.recipient_ids.filter((id) =>
            result.items.some((supplier) => supplier.id === id),
          ),
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "تعذر تحميل الجهات الموردة.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSuppliers(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);

      controller.abort();
    };
  }, [form.blood_type, form.units_required, canSearchSuppliers, units]);

  const canSubmit = useMemo(
    () => createBloodRequestSchema.safeParse(form).success,
    [form],
  );

  function updateField<K extends keyof BloodRequestFormValues>(
    key: K,
    value: BloodRequestFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next[key];

      return next;
    });
  }

  function toggleSupplier(supplierId: number) {
    setForm((current) => {
      const selected = current.recipient_ids.includes(supplierId);

      return {
        ...current,

        recipient_ids: selected
          ? current.recipient_ids.filter((id) => id !== supplierId)
          : [...current.recipient_ids, supplierId],
      };
    });

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next.recipient_ids;

      return next;
    });
  }

  async function submit() {
    const result = createBloodRequestSchema.safeParse(form);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      const nextErrors: Record<string, string> = {};

      Object.entries(flattened).forEach(([key, value]) => {
        if (value?.[0]) {
          nextErrors[key] = value[0];
        }
      });

      setErrors(nextErrors);

      return false;
    }

    try {
      setSubmitting(true);

      const response = await createBloodRequest(buildCreatePayload(form));

      toast.success(response.message || "تم إرسال طلب الدم بنجاح.");

      onSuccess();

      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إرسال الطلب.");

      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function saveDraft() {
    try {
      setSavingDraft(true);

      const response = await saveBloodRequestDraft(buildDraftPayload(form));

      toast.success(response.message || "تم حفظ المسودة.");

      onSuccess();

      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ المسودة.");

      return false;
    } finally {
      setSavingDraft(false);
    }
  }

  return {
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
  };
}

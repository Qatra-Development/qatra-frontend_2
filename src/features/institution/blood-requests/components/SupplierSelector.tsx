"use client";

import { Check } from "lucide-react";

import styles from "../blood-requests.module.css";

import type {
  BloodRequestRecipient,
  BloodSupplier,
} from "../types/blood-request.types";

interface Props {
  suppliers: BloodSupplier[];

  existingRecipients?: BloodRequestRecipient[];

  selectedIds: number[];

  loading: boolean;

  enabled?: boolean;

  onToggle: (id: number) => void;
}

export function SupplierSelector({
  suppliers,
  existingRecipients = [],
  selectedIds,
  loading,
  enabled = true,
  onToggle,
}: Props) {
  const missingExisting = existingRecipients.filter(
    (recipient) =>
      selectedIds.includes(recipient.blood_bank_id) &&
      !suppliers.some((supplier) => supplier.id === recipient.blood_bank_id),
  );

  if (!enabled) {
    return (
      <div className={styles.supplierState}>
        اختر الفصيلة وأدخل عدد الوحدات للبحث عن الجهات المتاحة.
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.supplierState}>
        جاري البحث عن الجهات المتاحة...
      </div>
    );
  }

  if (suppliers.length === 0 && missingExisting.length === 0) {
    return (
      <div className={styles.supplierState}>
        لا توجد جهات تملك كامل الكمية المطلوبة حاليًا.
      </div>
    );
  }

  return (
    <div className={styles.supplierList}>
      {suppliers.map((supplier) => {
        const selected = selectedIds.includes(supplier.id);

        return (
          <button
            key={supplier.id}
            type="button"
            className={`${styles.supplierCard} ${
              selected ? styles.supplierCardSelected : ""
            }`}
            onClick={() => onToggle(supplier.id)}
          >
            <span className={styles.supplierCheck}>
              {selected ? <Check size={12} /> : null}
            </span>

            <span className={styles.supplierContent}>
              <strong>{supplier.institution_name}</strong>

              <small>
                {supplier.institution_type}
                {" · "}
                {supplier.governorate}

                {supplier.same_governorate ? " · ضمن محافظتك" : ""}
              </small>
            </span>

            <span className={styles.supplierUnits}>
              <strong>{supplier.available_units}</strong>

              <small>وحدة متاحة</small>
            </span>
          </button>
        );
      })}

      {missingExisting.map((recipient) => (
        <button
          key={recipient.blood_bank_id}
          type="button"
          className={`${styles.supplierCard} ${styles.supplierCardSelected}`}
          onClick={() => onToggle(recipient.blood_bank_id)}
        >
          <span className={styles.supplierCheck}>
            <Check size={12} />
          </span>

          <span className={styles.supplierContent}>
            <strong>{recipient.institution_name}</strong>

            <small>
              {recipient.governorate}
              {" · "}
              جهة محددة سابقًا
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}

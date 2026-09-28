"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import {
  BLOOD_TYPES,
  type BloodRequestUiFilters,
} from "../types/blood-request.types";

import styles from "../blood-requests.module.css";

interface Props {
  filters: BloodRequestUiFilters;

  onApply: (filters: BloodRequestUiFilters) => void;

  onResetAll: () => void;

  onClose: () => void;
}

export function BloodRequestFiltersDrawer({
  filters,
  onApply,
  onResetAll,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<BloodRequestUiFilters>(filters);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function update<K extends keyof BloodRequestUiFilters>(
    key: K,
    value: BloodRequestUiFilters[K],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
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
      <aside className={styles.filterDrawer} dir="rtl">
        <header className={styles.drawerHeader}>
          <h2>الفلاتر</h2>

          <button type="button" className={styles.iconButton} onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className={styles.drawerContent}>
          <section className={styles.filterSection}>
            <h3>فصيلة الدم</h3>

            <div className={styles.filterBloodTypes}>
              {BLOOD_TYPES.map((bloodType) => (
                <button
                  type="button"
                  key={bloodType}
                  className={`${styles.filterChoice} ${
                    draft.blood_type === bloodType
                      ? styles.filterChoiceActive
                      : ""
                  }`}
                  onClick={() =>
                    update(
                      "blood_type",
                      draft.blood_type === bloodType ? undefined : bloodType,
                    )
                  }
                >
                  {bloodType}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.filterSection}>
            <h3>الأولوية</h3>

            <select
              className={styles.input}
              value={draft.priority ?? ""}
              onChange={(event) =>
                update(
                  "priority",
                  event.target.value
                    ? (event.target.value as NonNullable<
                        BloodRequestUiFilters["priority"]
                      >)
                    : undefined,
                )
              }
            >
              <option value="">الكل</option>

              <option value="normal">عادي</option>

              <option value="urgent">عاجل</option>

              <option value="emergency">طارئ</option>
            </select>
          </section>

          <section className={styles.filterSection}>
            <h3>تاريخ الطلب</h3>

            <div className={styles.datePresetRow}>
              {[
                ["custom", "مخصص"],
                ["last30", "آخر 30 يوم"],
                ["last7", "آخر 7 أيام"],
                ["today", "اليوم"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`${styles.filterChoice} ${
                    draft.date_preset === value ? styles.filterChoiceActive : ""
                  }`}
                  onClick={() =>
                    update(
                      "date_preset",
                      draft.date_preset === value
                        ? undefined
                        : (value as BloodRequestUiFilters["date_preset"]),
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {draft.date_preset === "custom" ? (
              <div className={styles.customDates}>
                <label>
                  من
                  <input
                    type="date"
                    className={styles.input}
                    value={draft.date_from ?? ""}
                    onChange={(event) =>
                      update("date_from", event.target.value || undefined)
                    }
                  />
                </label>

                <label>
                  إلى
                  <input
                    type="date"
                    className={styles.input}
                    value={draft.date_to ?? ""}
                    onChange={(event) =>
                      update("date_to", event.target.value || undefined)
                    }
                  />
                </label>
              </div>
            ) : null}
          </section>
        </div>

        <footer className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onApply(draft)}
          >
            تطبيق الفلاتر
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onResetAll}
          >
            إعادة ضبط
          </button>
        </footer>
      </aside>
    </div>
  );
}

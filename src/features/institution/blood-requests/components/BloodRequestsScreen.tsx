"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Plus, Search, SlidersHorizontal, X } from "lucide-react";

import { REQUEST_STATUS_TABS } from "../config/blood-request.config";

import {
  countAppliedFilters,
  getFilterLabels,
  toApiFilters,
} from "../lib/blood-request.utils";

import { type BloodRequestUiFilters } from "../types/blood-request.types";

import { useBloodRequests } from "../hooks/useBloodRequests";

import { BloodRequestsTable } from "./BloodRequestsTable";
import { BloodRequestFiltersDrawer } from "./BloodRequestFiltersDrawer";
import { BloodRequestFormModal } from "./BloodRequestFormModal";

import styles from "../blood-requests.module.css";

export function BloodRequestsScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<BloodRequestUiFilters>({});

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const apiFilters = useMemo(
    () => toApiFilters(filters, debouncedSearch, page),
    [filters, debouncedSearch, page],
  );

  const {
    items,
    meta,

    loading,
    error,

    refresh,
  } = useBloodRequests(apiFilters);

  const filterCount = countAppliedFilters(filters);

  const labels = getFilterLabels(filters);

  function resetFilters() {
    setFilters({});
    setPage(1);
    setFiltersOpen(false);
  }

  function removeFilter(key: "status" | "blood_type" | "priority" | "date") {
    setFilters((current) => {
      if (key === "date") {
        const {
          date_preset: _preset,
          date_from: _from,
          date_to: _to,
          ...rest
        } = current;

        return rest;
      }

      return {
        ...current,
        [key]: undefined,
      };
    });

    setPage(1);
  }

  return (
    <section className={styles.page} dir="rtl">
      <div className={styles.pageHeader}>
        <div className={styles.headingBlock}>
          <h1 className={styles.pageTitle}>طلباتي</h1>

          <p className={styles.pageSubtitle}>
            متابعة طلبات الدم الخاصة بمؤسستك فقط
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={17} />
          إنشاء طلب
        </button>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchBox}>
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="البحث برقم طلب الدم..."
          />

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="مسح البحث"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>

        <button
          type="button"
          className={styles.filterButton}
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={17} />
          الفلاتر
          {filterCount > 0 ? (
            <span className={styles.filterBadge}>{filterCount}</span>
          ) : null}
        </button>
      </div>

      <div className={styles.statusTabs}>
        {REQUEST_STATUS_TABS.map((tab) => {
          const active = filters.status === tab.value;

          return (
            <button
              key={tab.value ?? "all"}
              type="button"
              className={`${styles.statusTab} ${
                active ? styles.statusTabActive : ""
              }`}
              onClick={() => {
                setFilters((current) => ({
                  ...current,
                  status: tab.value,
                }));

                setPage(1);
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filterCount > 0 ? (
        <div className={styles.appliedFilters}>
          <button
            type="button"
            className={styles.resetAllButton}
            onClick={resetFilters}
          >
            إعادة ضبط الكل
          </button>

          {labels.date ? (
            <FilterChip
              label={labels.date}
              onRemove={() => removeFilter("date")}
            />
          ) : null}

          {labels.priority ? (
            <FilterChip
              label={labels.priority}
              onRemove={() => removeFilter("priority")}
            />
          ) : null}

          {labels.blood_type ? (
            <FilterChip
              label={labels.blood_type}
              onRemove={() => removeFilter("blood_type")}
            />
          ) : null}

          {labels.status ? (
            <FilterChip
              label={labels.status}
              onRemove={() => removeFilter("status")}
            />
          ) : null}
        </div>
      ) : null}

      {error ? <div className={styles.pageError}>{error}</div> : null}

      <BloodRequestsTable
        requests={items}
        loading={loading}
        hasFilters={filterCount > 0 || Boolean(debouncedSearch)}
        onResetFilters={resetFilters}
        onOpenRequest={(requestId) =>
          router.push(`/institution/requests/${requestId}`)
        }
      />

      {meta && meta.last_page > 1 ? (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={meta.current_page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            السابق
          </button>

          <span>
            {meta.current_page} من {meta.last_page}
          </span>

          <button
            type="button"
            className={styles.secondaryButton}
            disabled={meta.current_page >= meta.last_page}
            onClick={() => setPage((current) => current + 1)}
          >
            التالي
          </button>
        </div>
      ) : null}

      {filtersOpen ? (
        <BloodRequestFiltersDrawer
          filters={filters}
          onClose={() => setFiltersOpen(false)}
          onResetAll={resetFilters}
          onApply={(value) => {
            setFilters((current) => ({
              ...value,
              status: current.status,
            }));

            setPage(1);
            setFiltersOpen(false);
          }}
        />
      ) : null}

      {createOpen ? (
        <BloodRequestFormModal
          mode="create"
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            refresh();
          }}
        />
      ) : null}
    </section>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button type="button" className={styles.filterChip} onClick={onRemove}>
      {label}

      <X size={12} />
    </button>
  );
}

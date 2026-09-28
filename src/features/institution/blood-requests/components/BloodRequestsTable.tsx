"use client";

import { MoreHorizontal } from "lucide-react";

import type { BloodRequestListItem } from "../types/blood-request.types";

import {
  formatRelativeTime,
  formatTableDateTime,
} from "../lib/blood-request.utils";

import styles from "../blood-requests.module.css";

interface Props {
  requests: BloodRequestListItem[];

  loading: boolean;

  onOpenRequest: (requestId: number) => void;

  onResetFilters: () => void;

  hasFilters: boolean;
}

function statusClass(status: BloodRequestListItem["status"]) {
  switch (status) {
    case "completed":
      return styles.statusSuccess;

    case "rejected":
      return styles.statusDanger;

    case "cancelled":
      return styles.statusMuted;

    case "pending":
      return styles.statusWarning;

    case "ready":
    case "accepted":
    case "preparing":
      return styles.statusInfo;

    default:
      return "";
  }
}

export function BloodRequestsTable({
  requests,
  loading,
  onOpenRequest,
  onResetFilters,
  hasFilters,
}: Props) {
  if (loading) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.tableLoading}>جاري تحميل الطلبات...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={`${styles.tableCard} ${styles.emptyState}`}>
        <span className={styles.emptyStateIcon}>×</span>

        <p>
          {hasFilters
            ? "لا توجد طلبات تطابق الفلاتر المحددة"
            : "لا توجد طلبات حتى الآن"}
        </p>

        {hasFilters ? (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onResetFilters}
          >
            إعادة ضبط الفلاتر
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableScroll}>
        <table className={styles.requestsTable}>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>الفصيلة</th>
              <th>الوحدات</th>
              <th>الاستعجال</th>
              <th>الحالة</th>
              <th>تاريخ الحاجة</th>
              <th>آخر تحديث</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <button
                    type="button"
                    className={styles.requestNumber}
                    onClick={() => onOpenRequest(request.id)}
                  >
                    {request.request_number}
                  </button>
                </td>

                <td dir="ltr" className={styles.bloodTypeCell}>
                  {request.blood_type}
                </td>

                <td dir="ltr">{request.coverage.label}</td>

                <td
                  className={
                    request.priority === "emergency"
                      ? styles.emergencyPriority
                      : undefined
                  }
                >
                  {request.priority_label}
                </td>

                <td>
                  <span
                    className={`${styles.statusPill} ${statusClass(
                      request.status,
                    )}`}
                  >
                    {request.status_label}
                  </span>
                </td>

                <td dir="ltr">{formatTableDateTime(request.needed_at)}</td>

                <td>{formatRelativeTime(request.updated_at)}</td>

                <td>
                  <button
                    type="button"
                    className={styles.moreButton}
                    aria-label="عرض تفاصيل الطلب"
                    onClick={() => onOpenRequest(request.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import Link from "next/link";

import { LockKeyhole } from "lucide-react";

import { useBloodRequestDetails } from "../hooks/useBloodRequestDetails";

import {
  formatRequestDate,
  formatRequestDateTime,
} from "../lib/blood-request.utils";

import { BloodRequestProgress } from "./BloodRequestProgress";
import { BloodRequestFormModal } from "./BloodRequestFormModal";
import { CancelBloodRequestModal } from "./CancelBloodRequestModal";

import styles from "../blood-requests.module.css";

interface Props {
  requestId: string | number;
}

export function BloodRequestDetailsScreen({ requestId }: Props) {
  const {
    request,
    setRequest,

    loading,
    error,
  } = useBloodRequestDetails(requestId);

  const [editOpen, setEditOpen] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);

  if (loading) {
    return (
      <div className={styles.detailsState}>جاري تحميل تفاصيل الطلب...</div>
    );
  }

  if (error || !request) {
    return (
      <div className={styles.detailsState}>
        {error || "تعذر العثور على الطلب."}
      </div>
    );
  }

  return (
    <section className={styles.page} dir="rtl">
      <div className={styles.breadcrumbs}>
        <Link href="/institution/dashboard">قطرة</Link>

        <span>‹</span>

        <Link href="/institution/requests">طلباتي</Link>

        <span>‹</span>

        <strong>تفاصيل الطلب</strong>
      </div>

      <div className={`float-right${styles.detailsHeader}`}>
        <div>
          <h1 className={styles.detailTitle}>
            تفاصيل الطلب <b dir="ltr">{request.request_number}</b>
          </h1>

          <p className={styles.pageSubtitle}>
            متابعة طلبات الدم الخاصة بمؤسستك فقط
          </p>
        </div>

        <div className={styles.detailActions}>
          {request.available_actions.cancel ? (
            <button
              type="button"
              className={styles.secondaryDangerButton}
              onClick={() => setCancelOpen(true)}
            >
              إلغاء الطلب
            </button>
          ) : null}

          {request.available_actions.edit ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setEditOpen(true)}
            >
              تعديل الطلب
            </button>
          ) : null}
        </div>
      </div>

      <BloodRequestProgress request={request} />

      <div className={styles.detailsColumns}>
        <aside>
          <div className={styles.requestInfoCard}>
            <h2>معلومات الطلب</h2>

            <InfoRow label="رقم الطلب" value={request.request_number} ltr />

            {/*
              Current blood-request detail
              endpoint does not return the
              institution display name.
            */}
            <InfoRow label="المؤسسة" value="مؤسستك" />

            {/*
              Current API does not return
              created_by_name.
            */}
            <InfoRow label="أنشئ بواسطة" value="—" />

            <InfoRow
              label="تاريخ الإنشاء"
              value={formatRequestDateTime(request.created_at)}
            />

            <InfoRow
              label="آخر تحديث"
              value={formatRequestDateTime(request.updated_at)}
            />
          </div>

          <div className={styles.ownershipNotice}>
            <LockKeyhole size={17} />

            <span>
              هذا الطلب تابع لمؤسستك. يتم التحقق من الملكية والصلاحية قبل كل
              عملية.
            </span>
          </div>
        </aside>

        <article className={styles.requestDataCard}>
          <div className={styles.requestDataHeader}>
            <h2>بيانات الطلب</h2>

            <span className={styles.detailsStatus}>{request.status_label}</span>
          </div>

          <div className={styles.requestFacts}>
            <Fact label="فصيلة الدم" value={request.blood_type} large ltr />

            <Fact
              label="عدد الوحدات"
              value={`${request.units_required} وحدات`}
            />

            <Fact label="الأولوية" value={request.priority_label} priority />

            <Fact
              label="تاريخ الحاجة"
              value={formatRequestDate(request.needed_at)}
              ltr
            />
          </div>

          <div className={styles.requestDescription}>
            <div>
              <small>سبب أو وصف الطلب</small>

              <p>{request.description}</p>
            </div>

            <div>
              <small>ملاحظات إضافية</small>

              <p>{request.notes || "لا توجد ملاحظات إضافية."}</p>
            </div>

            {request.cancellation_reason ? (
              <div>
                <small>سبب الإلغاء</small>

                <p>{request.cancellation_reason}</p>
              </div>
            ) : null}

            {request.rejection_reason ? (
              <div>
                <small>سبب الرفض</small>

                <p>{request.rejection_reason}</p>
              </div>
            ) : null}
          </div>
        </article>
      </div>

      {editOpen ? (
        <BloodRequestFormModal
          mode="edit"
          request={request}
          onClose={() => setEditOpen(false)}
          onSuccess={(updated) => {
            setRequest(updated);
            setEditOpen(false);
          }}
        />
      ) : null}

      {cancelOpen ? (
        <CancelBloodRequestModal
          request={request}
          onClose={() => setCancelOpen(false)}
          onSuccess={(updated) => {
            setRequest(updated);
            setCancelOpen(false);
          }}
        />
      ) : null}
    </section>
  );
}

function InfoRow({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className={styles.infoRow}>
      <small>{label}</small>

      <strong dir={ltr ? "ltr" : undefined}>{value}</strong>
    </div>
  );
}

function Fact({
  label,
  value,
  large = false,
  priority = false,
  ltr = false,
}: {
  label: string;
  value: string;
  large?: boolean;
  priority?: boolean;
  ltr?: boolean;
}) {
  return (
    <div className={styles.fact}>
      <small>{label}</small>

      <strong
        dir={ltr ? "ltr" : undefined}
        className={`${large ? styles.factLarge : ""} ${
          priority ? styles.factPriority : ""
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

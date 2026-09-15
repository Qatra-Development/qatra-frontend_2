import { FileSearch } from "lucide-react";

import ApprovalRequestCard from "./ApprovalRequestCard";

import type {
  ApprovalInstitution,
  ApprovalRequestStatus,
} from "../types/approval-requests.types";

interface ApprovalRequestsListProps {
  requests: ApprovalInstitution[];

  status: ApprovalRequestStatus;

  isLoading: boolean;

  hasActiveFilters: boolean;
}

export default function ApprovalRequestsList({
  requests,
  status,
  isLoading,
  hasActiveFilters,
}: ApprovalRequestsListProps) {
  if (isLoading) {
    return <ApprovalRequestsSkeleton />;
  }

  if (!requests.length) {
    return <EmptyState status={status} filtered={hasActiveFilters} />;
  }

  return (
    <div className="space-y-4">
      {requests.map((institution) => (
        <ApprovalRequestCard key={institution.id} institution={institution} />
      ))}
    </div>
  );
}

function EmptyState({
  status,
  filtered,
}: {
  status: ApprovalRequestStatus;
  filtered: boolean;
}) {
  let title: string;
  let description: string;

  if (filtered) {
    title = "لا توجد نتائج";

    description = "لم نجد مؤسسات تطابق البحث أو الفلتر المحدد.";
  } else if (status === "rejected") {
    title = "لا توجد طلبات مرفوضة";

    description = "لا توجد مؤسسات مرفوضة في الوقت الحالي.";
  } else {
    title = "لا توجد طلبات قيد المراجعة";

    description = "لا توجد طلبات اعتماد تنتظر المراجعة حالياً.";
  }

  return (
    <div
      className="
        flex min-h-[280px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div
        className="
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-[#fff2f3]
          text-brand-red
        "
      >
        <FileSearch className="h-6 w-6" strokeWidth={1.7} />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-bold
          text-brand-blue
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-[#8c95a1]
        "
      >
        {description}
      </p>
    </div>
  );
}

function ApprovalRequestsSkeleton() {
  return (
    <div className="space-y-4" aria-label="جاري تحميل الطلبات">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            flex h-[92px]
            animate-pulse
            items-center
            justify-between
            rounded-2xl
            border border-[#eceef1]
            bg-white
            px-5
          "
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100" />

            <div>
              <div className="h-4 w-40 rounded bg-gray-100" />

              <div className="mt-2 h-3 w-56 rounded bg-gray-100" />

              <div className="mt-2 h-2.5 w-32 rounded bg-gray-100" />
            </div>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <div className="h-7 w-24 rounded-full bg-gray-100" />

            <div className="h-10 w-28 rounded-lg bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

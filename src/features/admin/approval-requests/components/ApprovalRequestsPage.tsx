"use client";

import ApprovalRequestsList from "./ApprovalRequestsList";
import ApprovalRequestsTabs from "./ApprovalRequestsTabs";
import ApprovalRequestsToolbar from "./ApprovalRequestsToolbar";

import { useApprovalRequests } from "../hooks/useApprovalRequests";

export default function ApprovalRequestsPage() {
  const {
    activeStatus,
    setActiveStatus,

    searchQuery,
    setSearchQuery,

    serviceScope,
    setServiceScope,

    requests,
    counts,

    isLoading,
    error,

    hasActiveFilters,

    retry,
  } = useApprovalRequests();

  return (
    <div dir="rtl" className="space-y-6">
      {/* Page heading + controls */}
      <section
        className="
          flex flex-col
          gap-5

          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-bold
              text-brand-blue

              sm:text-3xl
            "
          >
            طلبات الاعتماد
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-[#8c95a1]
            "
          >
            إدارة ومراجعة المؤسسات الصحية المعتمدة وسجل المؤسسات المرفوضة.
          </p>
        </div>

        <ApprovalRequestsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          serviceScope={serviceScope}
          onServiceScopeChange={setServiceScope}
        />
      </section>

      {/* Requests panel */}
      <section
        className="
          overflow-hidden
          rounded-[20px]
          border border-[#eceef1]
          bg-white
          shadow-[0_8px_25px_rgba(15,23,42,0.06)]
        "
      >
        <div className="px-4 sm:px-6">
          <ApprovalRequestsTabs
            activeStatus={activeStatus}
            counts={counts}
            onChange={setActiveStatus}
          />
        </div>

        <div className="p-4 sm:p-6">
          {error && !isLoading ? (
            <RequestsErrorState message={error} onRetry={retry} />
          ) : (
            <ApprovalRequestsList
              requests={requests}
              status={activeStatus}
              isLoading={isLoading}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function RequestsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="
        flex min-h-[280px]
        flex-col
        items-center
        justify-center
        px-5
        text-center
      "
    >
      <h3 className="font-bold text-brand-blue">تعذر تحميل طلبات الاعتماد</h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-[#8c95a1]
        "
      >
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-5
          rounded-lg
          bg-brand-red
          px-6 py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-brand-red-dark
        "
      >
        إعادة المحاولة
      </button>
    </div>
  );
}

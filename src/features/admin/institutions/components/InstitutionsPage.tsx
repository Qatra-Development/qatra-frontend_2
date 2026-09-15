"use client";

import InstitutionsSkeleton from "./InstitutionsSkeleton";
import InstitutionsTable from "./InstitutionsTable";
import InstitutionsTabs from "./InstitutionsTabs";
import InstitutionsToolbar from "./InstitutionsToolbar";

import { useInstitutions } from "../hooks/useInstitutions";

export default function InstitutionsPage() {
  const {
    activeTab,
    setActiveTab,

    searchQuery,
    setSearchQuery,

    serviceScope,
    setServiceScope,

    institutions,
    counts,

    isLoading,
    error,

    hasFilters,

    retry,
  } = useInstitutions();

  return (
    <div dir="rtl" className="space-y-6">
      {/* Heading */}
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
            المؤسسات الصحية
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
            إدارة ومراجعة المؤسسات الصحية المعتمدة وسجل المؤسسات التي تمت
            إزالتها.
          </p>
        </div>

        <InstitutionsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          serviceScope={serviceScope}
          onServiceScopeChange={setServiceScope}
        />
      </section>

      {/* Main container */}
      <section
        className="
          min-h-[480px]
          rounded-[20px]
          border border-[#eceef1]
          bg-white
          p-4
          shadow-[0_8px_25px_rgba(15,23,42,0.06)]

          sm:p-6
        "
      >
        {isLoading ? (
          <InstitutionsSkeleton />
        ) : error ? (
          <InstitutionsErrorState message={error} onRetry={retry} />
        ) : (
          <>
            <div
              className="
                flex
                justify-center
                pb-5
              "
            >
              <InstitutionsTabs
                activeTab={activeTab}
                counts={counts}
                onChange={setActiveTab}
              />
            </div>

            <div
              className="
                border-t
                border-[#e9eaed]
                pt-5
              "
            >
              <InstitutionsTable
                institutions={institutions}
                activeTab={activeTab}
                hasFilters={hasFilters}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function InstitutionsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="
        flex min-h-[400px]
        flex-col
        items-center
        justify-center
        text-center
      "
    >
      <h3
        className="
          text-base
          font-bold
          text-brand-blue
        "
      >
        تعذر تحميل المؤسسات
      </h3>

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

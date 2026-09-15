import React from "react";
import { INSTITUTION_STATUS_MAP } from "@/src/features/institution/utils/formatters";
export interface StatusBannerProps {
  status?: string;
  reviewNotes?: string | null;
  customTitle?: string;
  customDescription?: string;
}

export default function StatusBanner({
  status = "needs_completion",
  reviewNotes,
  customTitle,
  customDescription,
}: StatusBannerProps) {
  const statusInfo = INSTITUTION_STATUS_MAP[status] || {
    title: "طلب اعتماد المؤسسة",
    description: "طلبك قيد المتابعة من هيئة الصحة.",
    badge: "حالة الطلب",
    color: "amber",
  };

  const title = customTitle || statusInfo.title;
  const description = customDescription || statusInfo.description;
  const isNeedsCompletion = status === "needs_completion";

  const getGradient = () => {
    if (isNeedsCompletion) {
      return "linear-gradient(139.24deg, #F0D79A 0.25%, #FFFFFF 112.3%)";
    }

    switch (statusInfo.color) {
      case "green":
        return "linear-gradient(134.73deg, rgb(220, 252, 231) 0.23%, rgb(255, 255, 255) 99.77%)";
      case "red":
        return "linear-gradient(134.73deg, rgb(255, 241, 243) 0.23%, rgb(255, 251, 252) 99.77%)";
      case "blue":
        return "linear-gradient(134.73deg, rgb(224, 242, 254) 0.23%, rgb(255, 255, 255) 99.77%)";
      case "amber":
      default:
        return "linear-gradient(134.73deg, rgb(245, 230, 204) 0.23%, rgb(255, 255, 255) 99.77%)";
    }
  };

  const getIconBg = () => {
    switch (statusInfo.color) {
      case "green":
        return "bg-emerald-100 text-emerald-700";
      case "red":
        return "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200";
      case "blue":
        return "bg-blue-100 text-blue-700";
      case "amber":
      default:
        return "bg-[#fae5c7] text-amber-700";
    }
  };

  return (
    <section className="mb-5" data-purpose="status-banner">
      <div
        className="rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-start relative overflow-hidden shadow-sm transition-all"
        style={{
          background: getGradient(),
          border: isNeedsCompletion
            ? "1px solid #F5E6CC"
            : "1px solid rgb(249, 241, 243)",
          borderRadius: "20px",
          padding: "24.8px",
          gap: "18px",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "1122px",
          minHeight: isNeedsCompletion ? "142.6px" : undefined,
        }}
      >
        {/* Status Icon */}
        <div
          className={`w-12 h-12 rounded-2xl ${getIconBg()} flex items-center justify-center flex-shrink-0 shadow-inner`}
        >
          {statusInfo.color === "green" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : statusInfo.color === "red" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <polyline
                points="12 7 12 12 15 14"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </div>

        {/* Text Content */}
        <div
          className={`pr-2 flex-1 ${isNeedsCompletion ? "flex flex-col items-start gap-2" : ""}`}
        >
          <span
            className={
              isNeedsCompletion
                ? "inline-block shrink-0"
                : "inline-block text-[11px] font-bold text-[#83141f] mb-1"
            }
            style={
              isNeedsCompletion
                ? {
                    width: "135px",
                    height: "19px",
                    fontFamily: "var(--font-tajawal)",
                    fontStyle: "normal",
                    fontWeight: 800,
                    fontSize: "12.5px",
                    lineHeight: "19px",
                    letterSpacing: "0.5px",
                    color: "#9E1B32",
                  }
                : undefined
            }
          >
            {statusInfo.badge}
          </span>
          <h2 className="text-base lg:text-lg font-bold text-slate-900 leading-snug">
            {title}
          </h2>
          <p
            className={`text-xs text-slate-500 ${isNeedsCompletion ? "" : "mt-1"}`}
          >
            {description}
          </p>

          {/* If review notes exist from health authority admin */}
          {reviewNotes && (
            <div className="mt-2.5 p-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-xs text-slate-700">
              <span className="font-bold text-[#83141f] ml-1">
                ملاحظات المشرف:
              </span>
              <span>{reviewNotes}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

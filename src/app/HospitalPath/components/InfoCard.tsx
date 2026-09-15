import React from "react";

export interface InfoField {
  label: string;
  value: string;
  isMono?: boolean;
  isLtr?: boolean;
  hasBottomBorder?: boolean;
  smallText?: boolean;
}

export interface InfoCardProps {
  title: string;
  subtitle: string;
  icon: "institution" | "representative";
  fields: InfoField[];
  dataPurpose?: string;
}

export default function InfoCard({
  title,
  subtitle,
  icon,
  fields,
  dataPurpose,
}: InfoCardProps) {
  return (
    <div
      className="border rounded-xl p-4 bg-[#fcfdfe] relative"
      data-purpose={dataPurpose}
      style={{ borderColor: "rgb(228, 222, 216)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 border-b pb-3"
        style={{ borderColor: "rgb(228, 222, 216)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-[#83141f] flex-shrink-0">
            {icon === "institution" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">{title}</h3>
            <p className="text-[10px] text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Field Grid */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[11px]">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className={
              field.hasBottomBorder
                ? "pb-3 border-b"
                : ""
            }
            style={
              field.hasBottomBorder
                ? { borderColor: "rgb(228, 222, 216)" }
                : undefined
            }
          >
            <span className="text-slate-400 block text-[10px] mb-0.5">
              {field.label}
            </span>
            <span
              className={`font-bold text-slate-800 ${
                field.isMono ? "font-mono" : ""
              } ${field.smallText ? "text-[10px]" : ""}`}
              dir={field.isLtr ? "ltr" : undefined}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

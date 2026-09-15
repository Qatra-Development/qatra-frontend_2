import React from "react";
import {
  DOCUMENT_TYPE_MAP,
  DOCUMENT_STATUS_MAP,
} from "@/src/features/institution/utils/formatters";
import type { InstitutionDocument } from "@/src/features/institution/types/institution.types";

export interface DocumentItem {
  id: string | number;
  name: string;
  sizeAndFormat: string;
  status: string;
  rawStatus?: string;
}

const defaultDocuments: DocumentItem[] = [
  {
    id: 1,
    name: "رخصة مزاولة العمل",
    sizeAndFormat: "ميجابايت 1.5 | png",
    status: "مرفق",
    rawStatus: "pending",
  },
  {
    id: 2,
    name: "خطاب تفويض الممثل",
    sizeAndFormat: "ميجابايت 1.5 | png",
    status: "مرفق",
    rawStatus: "pending",
  },
  {
    id: 3,
    name: "شهادة الجودة أو الاعتماد",
    sizeAndFormat: "ميجابايت 1.5 | png",
    status: "مرفق",
    rawStatus: "pending",
  },
  {
    id: 4,
    name: "السجل التجاري",
    sizeAndFormat: "ميجابايت 1.5 | png",
    status: "مرفق",
    rawStatus: "pending",
  },
];

export default function DocumentsGrid({
  rawDocuments,
  documents,
}: {
  rawDocuments?: InstitutionDocument[];
  documents?: DocumentItem[];
}) {
  const displayDocs: DocumentItem[] = React.useMemo(() => {
    if (rawDocuments && rawDocuments.length > 0) {
      return rawDocuments.map((doc) => {
        const typeName =
          DOCUMENT_TYPE_MAP[doc.document_type] || doc.document_type;
        const statusConfig =
          DOCUMENT_STATUS_MAP[doc.status] || DOCUMENT_STATUS_MAP.pending;
        const ext = doc.file_path ? doc.file_path.split(".").pop() : "pdf";
        return {
          id: doc.id,
          name: typeName,
          sizeAndFormat: `مرفوع | ${ext}`,
          status: statusConfig.label,
          rawStatus: doc.status,
        };
      });
    }
    return documents && documents.length > 0 ? documents : defaultDocuments;
  }, [rawDocuments, documents]);

  return (
    <div
      className="border border-slate-200 rounded-xl p-4 bg-[#fcfdfe] mt-4"
      data-purpose="attached-documents"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-[#83141f] flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              الوثائق المرفقة
            </h3>
            <p className="text-[10px] text-slate-400">
              الوثائق التي تم إرفاقها لطلب اعتماد المؤسسة
            </p>
          </div>
        </div>
      </div>

      {/* Document List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {displayDocs.map((doc) => {
          const statusStyle =
            DOCUMENT_STATUS_MAP[doc.rawStatus || "pending"] ||
            DOCUMENT_STATUS_MAP.pending;

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-50 text-[#83141f] flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 leading-none">
                    {doc.name}
                  </h4>
                  <span className="text-[9px] text-slate-400">
                    {doc.sizeAndFormat}
                  </span>
                </div>
              </div>
              <button
                className="cursor-default inline-flex items-center justify-center font-bold transition-colors"
                style={{
                  padding: "5px 9px",
                  minWidth: "55px",
                  height: "23px",
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                  borderRadius: "999px",
                  fontSize: "11.2px",
                  border: "none",
                }}
                type="button"
              >
                {doc.status}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

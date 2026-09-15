import {
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";

import { DOCUMENT_LABELS } from "../../config/review.config";

import {
  getDocumentExtension,
  getRequestedServices,
} from "../../lib/review.utils";

import type {
  AdminInstitution,
  InstitutionDocumentStatus,
} from "../../../types/institutions.types";

interface Props {
  institution: AdminInstitution;

  documentUpdatingId: number | null;

  fileLoadingId: number | null;

  onReviewDocument: (
    documentId: number,
    status: InstitutionDocumentStatus,
  ) => void;

  onViewDocument: (documentId: number) => void;

  onDownloadDocument: (documentId: number, filePath: string) => void;
}

export default function ServicesDocumentsStep({
  institution,

  documentUpdatingId,
  fileLoadingId,

  onReviewDocument,
  onViewDocument,
  onDownloadDocument,
}: Props) {
  const services = getRequestedServices(institution.service_scope);

  return (
    <div className="space-y-5">
      <section className="admin-section">
        <div className="admin-section-header">الخدمات المطلوبة</div>

        <div>
          {services.map((service) => (
            <div
              key={service.key}
              className="
                  grid
                  min-h-[52px]
                  grid-cols-[140px_minmax(0,1fr)_100px]
                  items-center
                  border-b
                  border-[var(--admin-border-soft)]
                  px-4
                  text-xs
                  last:border-b-0
                "
            >
              <span className="font-medium text-[var(--admin-text-secondary)]">
                {service.title}
              </span>

              <span className="text-[var(--admin-text-muted)]">
                {service.description}
              </span>

              <span
                className="
                    justify-self-end
                    rounded-full
                    bg-[var(--admin-status-success-bg)]
                    px-3 py-1
                    text-[10px]
                    font-semibold
                    text-[var(--admin-status-success-text)]
                  "
              >
                مطلوبة
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">الوثائق والمرفقات</div>

        <div className="overflow-x-auto">
          <table
            dir="rtl"
            className="
              w-full
              min-w-[900px]
              border-collapse
              text-right
            "
          >
            <thead>
              <tr className="bg-[#fafafb]">
                <Th>#</Th>
                <Th>اسم المستند</Th>
                <Th>النوع</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>

            <tbody>
              {institution.documents.map((document, index) => {
                const updating = documentUpdatingId === document.id;

                const fileLoading = fileLoadingId === document.id;

                return (
                  <tr
                    key={document.id}
                    className="
                        border-b
                        border-[var(--admin-border-soft)]
                        last:border-b-0
                      "
                  >
                    <Td>{index + 1}</Td>

                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className="
                              flex h-8 w-8
                              items-center
                              justify-center
                              rounded-lg
                              bg-[var(--admin-danger-soft)]
                              text-[var(--admin-danger)]
                            "
                        >
                          <FileText className="h-4 w-4" />
                        </span>

                        <span className="font-semibold text-[var(--admin-text-primary)]">
                          {DOCUMENT_LABELS[document.document_type] ??
                            document.document_type}
                        </span>
                      </div>
                    </Td>

                    <Td>{getDocumentExtension(document.file_path)}</Td>

                    <Td>
                      <DocumentStatusBadge status={document.status} />
                    </Td>

                    <Td>
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                          "
                      >
                        <ActionButton
                          disabled={fileLoading}
                          onClick={() => onViewDocument(document.id)}
                        >
                          {fileLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                          عرض
                        </ActionButton>

                        <ActionButton
                          disabled={fileLoading}
                          onClick={() =>
                            onDownloadDocument(document.id, document.file_path)
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                          تحميل
                        </ActionButton>

                        <button
                          type="button"
                          disabled={updating}
                          title="اعتماد المستند"
                          onClick={() =>
                            onReviewDocument(document.id, "approved")
                          }
                          className={`
                              flex h-8 w-8
                              items-center
                              justify-center
                              rounded-lg
                              border
                              transition

                              ${
                                document.status === "approved"
                                  ? `
                                    border-[var(--admin-success)]
                                    bg-[var(--admin-success)]
                                    text-white
                                  `
                                  : `
                                    border-[#cce4dd]
                                    bg-white
                                    text-[#4b9a80]
                                    hover:bg-[#edf8f4]
                                  `
                              }

                              disabled:opacity-50
                            `}
                        >
                          {updating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={updating}
                          title="رفض المستند"
                          onClick={() =>
                            onReviewDocument(document.id, "rejected")
                          }
                          className={`
                              flex h-8 w-8
                              items-center
                              justify-center
                              rounded-lg
                              border
                              transition

                              ${
                                document.status === "rejected"
                                  ? `
                                    border-[var(--admin-danger)]
                                    bg-[var(--admin-danger)]
                                    text-white
                                  `
                                  : `
                                    border-[#f0ccd4]
                                    bg-white
                                    text-[var(--admin-danger)]
                                    hover:bg-[var(--admin-danger-soft)]
                                  `
                              }

                              disabled:opacity-50
                            `}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DocumentStatusBadge({
  status,
}: {
  status: InstitutionDocumentStatus;
}) {
  const styles = {
    pending: "bg-[#f2f3f5] text-[#7f8995]",

    approved:
      "bg-[var(--admin-status-success-bg)] text-[var(--admin-status-success-text)]",

    rejected:
      "bg-[var(--admin-status-danger-bg)] text-[var(--admin-status-danger-text)]",
  };

  const labels = {
    pending: "قيد المراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3 py-1
        text-[10px]
        font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
        inline-flex
        h-8
        items-center
        gap-1.5
        rounded-lg
        border
        border-[var(--admin-border)]
        bg-white
        px-3
        text-[10px]
        font-medium
        text-[var(--admin-text-secondary)]
        transition
        hover:bg-[#f8f8f9]
        disabled:opacity-50
      "
    >
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="
        px-4 py-3
        text-xs
        font-semibold
        text-[var(--admin-text-muted)]
      "
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      className="
        px-4 py-3.5
        text-xs
        text-[var(--admin-text-secondary)]
      "
    >
      {children}
    </td>
  );
}

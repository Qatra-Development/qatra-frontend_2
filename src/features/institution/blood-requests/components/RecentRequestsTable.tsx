import Link from "next/link";

import { MoreHorizontal } from "lucide-react";

import { formatRequestDate } from "../lib/blood-request.utils";

import type {
  BloodRequestListItem,
  BloodRequestStatus,
} from "../types/blood-request.types";

const STATUS_STYLES: Record<BloodRequestStatus, string> = {
  draft: "bg-[#fff5df] text-[#a97c27]",

  pending: "bg-[#edf5f7] text-[#5d8590]",

  accepted: "bg-[#fff4df] text-[#a27c38]",

  preparing: "bg-[#eef4ff] text-[#567aaa]",

  ready: "bg-[#eaf8f3] text-[#429477]",

  completed: "bg-[#e9f8f2] text-[#429477]",

  rejected: "bg-[#fff0f2] text-[#c43b51]",

  cancelled: "bg-[#f0f1f3] text-[#7d858f]",
};

interface Props {
  requests: BloodRequestListItem[];
}

export default function RecentRequestsTable({ requests }: Props) {
  return (
    <section
      className="
        institution-card
        overflow-hidden
        p-4
        sm:p-5
      "
    >
      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            text-lg
            font-bold
            text-[var(--admin-text-primary)]
          "
        >
          طلبات مؤسستي
        </h2>

        <Link
          href="/institution/requests"
          className="
            text-xs
            font-semibold
            text-[var(--admin-danger)]
          "
        >
          عرض كل طلباتي
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table
          dir="rtl"
          className="
            w-full
            min-w-[820px]
            border-separate
            border-spacing-0
            text-right
          "
        >
          <thead>
            <tr
              className="
                bg-[var(--institution-table-head)]
              "
            >
              <Th first>رقم الطلب</Th>

              <Th>الفصيلة</Th>

              <Th>الوحدات</Th>

              <Th>الاستعجال</Th>

              <Th>الحالة</Th>

              <Th>تاريخ الحاجة</Th>

              <Th last>آخر تحديث</Th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="
                    transition
                    hover:bg-[#fdfdfd]
                  "
              >
                <Td>
                  <Link
                    href={`/institution/requests/${request.id}`}
                    className="
                        font-bold
                        text-[var(--admin-danger)]
                      "
                  >
                    {request.request_number}
                  </Link>
                </Td>

                <Td>
                  <bdi dir="ltr">{request.blood_type}</bdi>
                </Td>

                <Td>
                  <bdi dir="ltr">
                    {request.coverage?.label ??
                      `${request.units_provided}/${request.units_required}`}
                  </bdi>
                </Td>

                <Td>{request.priority_label}</Td>

                <Td>
                  <span
                    className={`
                        rounded-full
                        px-3 py-1
                        text-[10px]
                        font-semibold
                        ${STATUS_STYLES[request.status]}
                      `}
                  >
                    {request.status_label}
                  </span>
                </Td>

                <Td>{formatRequestDate(request.needed_at)}</Td>

                <Td>
                  <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                      "
                  >
                    <span>{formatRequestDate(request.updated_at)}</span>

                    <Link
                      href={`/institution/requests/${request.id}`}
                      aria-label="عرض الطلب"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Link>
                  </div>
                </Td>
              </tr>
            ))}

            {!requests.length && (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-12
                    text-center
                    text-sm
                    text-[var(--admin-text-muted)]
                  "
                >
                  لا توجد طلبات حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  children,
  first,
  last,
}: {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <th
      className={`
        px-3 py-3
        text-[11px]
        font-bold
        text-[var(--admin-text-secondary)]
        sm:px-4

        ${first ? "rounded-r-xl" : ""}
        ${last ? "rounded-l-xl" : ""}
      `}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      className="
        border-b
        border-[var(--admin-border-soft)]
        px-3 py-4
        text-xs
        text-[var(--admin-text-secondary)]
        sm:px-4
      "
    >
      {children}
    </td>
  );
}

import { Building2, Check, Loader2, MapPin } from "lucide-react";

import { getInstitutionTypeLabel } from "../lib/blood-request.utils";

import type { BloodSupplier } from "../types/blood-request.types";

interface Props {
  suppliers: BloodSupplier[];

  selectedIds: number[];

  loading: boolean;

  enabled: boolean;

  onToggle: (id: number) => void;
}

export default function SupplierSelector({
  suppliers,
  selectedIds,
  loading,
  enabled,
  onToggle,
}: Props) {
  return (
    <section>
      <div>
        <h3
          className="
            text-xs
            font-bold
            text-[var(--admin-text-primary)]
          "
        >
          اختر الجهة المورّدة
        </h3>

        <p
          className="
            mt-1
            text-[10px]
            leading-5
            text-[var(--admin-text-muted)]
          "
        >
          تظهر الجهات التي تملك كامل الكمية المطلوبة، مرتبة حسب المحافظة
          والتوفر. ويمكن اختيار أكثر من جهة.
        </p>
      </div>

      {!enabled && (
        <div
          className="
            mt-3
            flex min-h-[54px]
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--admin-border)]
            bg-[#fafafb]
            px-4
            text-center
            text-[11px]
            text-[var(--admin-text-muted)]
          "
        >
          اختر فصيلة الدم وأدخل عدد الوحدات المطلوبة لعرض الجهات التي تستطيع
          تغطية الطلب.
        </div>
      )}

      {enabled && loading && (
        <div
          className="
            mt-3
            flex min-h-[90px]
            items-center
            justify-center
            text-[var(--admin-text-muted)]
          "
        >
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {enabled && !loading && !suppliers.length && (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-[var(--admin-border)]
            bg-[#fafafb]
            px-4 py-6
            text-center
            text-xs
            text-[var(--admin-text-muted)]
          "
        >
          لا توجد حالياً جهة موردة تملك كامل الكمية المطلوبة لهذه الفصيلة.
        </div>
      )}

      {enabled && !loading && suppliers.length > 0 && (
        <div
          className="
            mt-3
            max-h-[250px]
            space-y-2
            overflow-y-auto
            pl-1
          "
        >
          {suppliers.map((supplier) => {
            const selected = selectedIds.includes(supplier.id);

            return (
              <label
                key={supplier.id}
                className={`
                    flex cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    border
                    px-3 py-3
                    transition

                    ${
                      selected
                        ? `
                          border-[var(--admin-danger)]
                          bg-[var(--admin-danger-soft)]
                        `
                        : `
                          border-[var(--admin-border)]
                          bg-white
                          hover:bg-[#fafafa]
                        `
                    }
                  `}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onToggle(supplier.id)}
                  className="sr-only"
                />

                <span
                  className={`
                      flex h-5 w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border

                      ${
                        selected
                          ? `
                            border-[var(--admin-danger)]
                            bg-[var(--admin-danger)]
                            text-white
                          `
                          : `
                            border-[#cfd4da]
                            bg-white
                          `
                      }
                    `}
                >
                  {selected && <Check className="h-3 w-3" />}
                </span>

                <span
                  className="
                      flex h-9 w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#f7f7f8]
                      text-[var(--admin-text-muted)]
                    "
                >
                  <Building2 className="h-4 w-4" />
                </span>

                <div
                  className="
                      min-w-0
                      flex-1
                    "
                >
                  <p
                    className="
                        truncate
                        text-xs
                        font-bold
                        text-[var(--admin-text-primary)]
                      "
                  >
                    {supplier.institution_name}
                  </p>

                  <div
                    className="
                        mt-1
                        flex flex-wrap
                        items-center
                        gap-x-2
                        text-[10px]
                        text-[var(--admin-text-muted)]
                      "
                  >
                    <span>
                      {getInstitutionTypeLabel(supplier.institution_type)}
                    </span>

                    <span>·</span>

                    <span
                      className="
                          inline-flex
                          items-center
                          gap-1
                        "
                    >
                      <MapPin className="h-3 w-3" />

                      {supplier.governorate}
                    </span>

                    {supplier.same_governorate && (
                      <>
                        <span>·</span>

                        <span className="text-[var(--institution-green)]">
                          ضمن محافظتك
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="
                      shrink-0
                      text-left
                    "
                >
                  <strong
                    className="
                        block
                        text-base
                        text-[var(--institution-green)]
                      "
                  >
                    {supplier.available_units}
                  </strong>

                  <span
                    className="
                        text-[9px]
                        text-[var(--admin-text-muted)]
                      "
                  >
                    وحدة متاحة
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { Ban, ShieldCheck, SquarePen } from "lucide-react";

import type { InstitutionDecision } from "../../types/review.types";

interface Props {
  decision: InstitutionDecision | null;

  notes: string;

  error?: string;

  canApprove: boolean;

  onDecisionChange: (value: InstitutionDecision) => void;

  onNotesChange: (value: string) => void;
}

export default function DecisionStep({
  decision,
  notes,
  error,

  canApprove,

  onDecisionChange,
  onNotesChange,
}: Props) {
  return (
    <div
      className="
        mx-auto
        max-w-5xl
        py-2
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex h-16 w-16
          items-center
          justify-center
          rounded-full
          bg-[#eef7f8]
          ring-8
          ring-[#f5fafb]
        "
      >
        <ShieldCheck
          className="
            h-7 w-7
            text-[#438ca0]
          "
        />
      </div>

      <p
        className="
          mt-5
          text-xs
          font-bold
          text-[var(--admin-danger)]
        "
      >
        قرار القبول
      </p>

      <h2
        className="
          mt-3
          text-xl
          font-bold
          text-[var(--admin-text-primary)]
          sm:text-2xl
        "
      >
        تبقّت خطوة واحدة لتصبح المؤسسة جزءًا من قطرة
      </h2>

      <p
        className="
          mt-3
          text-sm
          text-[var(--admin-text-muted)]
        "
      >
        اعتمد، اطلب بيانات أو ارفض المؤسسة
      </p>

      <div
        className="
          mt-7
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <DecisionCard
          type="approve"
          selected={decision === "approve"}
          title="اعتماد المؤسسة"
          description="الموافقة على طلب الاعتماد"
          icon={ShieldCheck}
          onClick={() => onDecisionChange("approve")}
        />

        <DecisionCard
          type="request_completion"
          selected={decision === "request_completion"}
          title="طلب استكمال"
          description="إعادة الطلب للمراجعة"
          icon={SquarePen}
          onClick={() => onDecisionChange("request_completion")}
        />

        <DecisionCard
          type="reject"
          selected={decision === "reject"}
          title="رفض المؤسسة"
          description="رفض طلب الاعتماد"
          icon={Ban}
          onClick={() => onDecisionChange("reject")}
        />
      </div>

      {decision === "approve" && !canApprove && (
        <div
          className="
              mt-5
              rounded-xl
              border
              border-[#f1ddae]
              bg-[var(--admin-warning-soft)]
              px-4 py-3
              text-right
              text-xs
              leading-6
              text-[#9b6e22]
            "
        >
          لا يمكن اعتماد المؤسسة قبل اعتماد المستندات الأربعة المطلوبة والتأكد
          أن حالة الطلب قيد المراجعة.
        </div>
      )}

      {(decision === "request_completion" || decision === "reject") && (
        <div
          className="
            mt-5
            overflow-hidden
            rounded-xl
            border
            border-[var(--admin-border)]
            text-right
          "
        >
          <div
            className="
              border-b
              border-[var(--admin-border)]
              bg-[#fafafb]
              px-4 py-3
              text-xs
              font-semibold
              text-[var(--admin-text-primary)]
            "
          >
            {decision === "request_completion"
              ? "ملاحظات القرار وشرح البيانات المطلوب استكمالها"
              : "ملاحظات القرار وسبب الرفض"}
          </div>

          <div className="p-4">
            <textarea
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder={
                decision === "request_completion"
                  ? "اشرح البيانات أو المستندات المطلوب استكمالها..."
                  : "اكتب سبب رفض المؤسسة..."
              }
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-[var(--admin-border)]
                bg-white
                px-4 py-3
                text-sm
                leading-6
                text-[var(--admin-text-primary)]
                outline-none
                transition

                placeholder:text-[#b1b7bf]

                focus:border-[var(--admin-danger)]
                focus:ring-2
                focus:ring-[#b51f3b14]
              "
            />

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
              "
            >
              {error ? (
                <p className="text-xs text-[var(--admin-danger)]">{error}</p>
              ) : (
                <span />
              )}

              <span
                className="
                  text-[10px]
                  text-[var(--admin-text-muted)]
                "
              >
                {notes.length}/2000
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionCard({
  type,
  selected,
  title,
  description,
  icon: Icon,
  onClick,
}: {
  type: InstitutionDecision;
  selected: boolean;
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  const styles = {
    approve: {
      selected:
        "border-[var(--admin-success)] bg-[var(--admin-success-soft)] shadow-[0_7px_18px_rgba(68,139,139,0.12)]",

      iconSelected: "bg-[var(--admin-success)] text-white",

      iconDefault: "bg-[#f1f7f7] text-[var(--admin-success)]",
    },

    request_completion: {
      selected:
        "border-[var(--admin-warning)] bg-[var(--admin-warning-soft)] shadow-[0_7px_18px_rgba(193,138,46,0.12)]",

      iconSelected: "bg-[var(--admin-warning)] text-white",

      iconDefault: "bg-[#fff3dc] text-[var(--admin-warning)]",
    },

    reject: {
      selected:
        "border-[var(--admin-danger)] bg-[var(--admin-danger-soft)] shadow-[0_7px_18px_rgba(181,31,59,0.12)]",

      iconSelected: "bg-[var(--admin-danger)] text-white",

      iconDefault: "bg-[#fff1f3] text-[var(--admin-danger)]",
    },
  };

  const style = styles[type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-[150px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        px-5 py-5
        text-center
        transition-all
        duration-200

        ${
          selected
            ? style.selected
            : `
              border-[var(--admin-border)]
              bg-white
              hover:border-[#d9dade]
              hover:shadow-sm
            `
        }
      `}
    >
      <span
        className={`
          flex h-12 w-12
          items-center
          justify-center
          rounded-xl
          transition-colors

          ${selected ? style.iconSelected : style.iconDefault}
        `}
      >
        <Icon className="h-5 w-5" />
      </span>

      <strong
        className="
          mt-3
          text-sm
          text-[var(--admin-text-primary)]
        "
      >
        {title}
      </strong>

      <span
        className="
          mt-1
          text-[10px]
          text-[var(--admin-text-muted)]
        "
      >
        {description}
      </span>
    </button>
  );
}

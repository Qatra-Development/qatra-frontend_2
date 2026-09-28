"use client";

import { TriangleAlert } from "lucide-react";

interface Props {
  currentValue: boolean;
  submitting: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function AvailabilityConfirmModal({
  currentValue,
  submitting,
  onConfirm,
  onCancel,
}: Props) {
  const targetValue = !currentValue;

  return (
    <div
      className="
        fixed inset-0 z-[130]
        flex items-center
        justify-center
        bg-[#17232c]/50
        px-4
        backdrop-blur-[1px]
      "
    >
      <div
        className="
          w-full
          max-w-[390px]
          rounded-[20px]
          bg-white
          px-7 py-8
          text-center
          shadow-[0_28px_80px_rgba(23,35,44,0.25)]
        "
      >
        <span
          className="
            mx-auto grid
            h-14 w-14
            place-items-center
            rounded-full
            bg-[#fbedf0]
            text-[#ad1e38]
          "
        >
          <TriangleAlert className="h-6 w-6" />
        </span>

        <h2
          className="
            mt-5
            text-[18px]
            font-extrabold
            text-[#2f4149]
          "
        >
          تغيير حالة الاستقبال
        </h2>

        <p
          className="
            mx-auto mt-3
            max-w-[280px]
            text-xs
            leading-6
            text-[#879399]
          "
        >
          {targetValue
            ? "هل أنت متأكد أنك تريد تفعيل استقبال نداءات التبرع الجديدة؟"
            : "هل أنت متأكد أنك تريد تغيير حالتك إلى غير متاح؟ لن تتلقى نداءات تبرع جديدة."}
        </p>

        <span
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#f0f2f3]
            px-4 py-2
            text-xs
            font-bold
            text-[#64737a]
          "
        >
          <span
            className={`
              h-2 w-2
              rounded-full
              ${targetValue ? "bg-[#2ca36b]" : "bg-[#7b8990]"}
            `}
          />

          {targetValue ? "متاح" : "غير متاح"}
        </span>

        <div
          className="
            mt-7
            grid grid-cols-2
            gap-3
          "
        >
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="
              min-h-[44px]
              rounded-xl
              bg-[#ad1e38]
              text-sm
              font-bold
              text-white
              disabled:opacity-60
            "
          >
            {submitting ? "جارٍ الحفظ..." : "نعم، تأكيد"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="
              min-h-[44px]
              rounded-xl
              border
              border-[#e0e5e7]
              bg-white
              text-sm
              font-bold
              text-[#64737a]
            "
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

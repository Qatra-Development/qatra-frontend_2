import { CalendarDays, MapPin } from "lucide-react";

import type { DonorDonationCall } from "../types/donor.types";

interface Props {
  call: DonorDonationCall;
  targeted?: boolean;
  onDetails: () => void;
}

function priorityLabel(priority: DonorDonationCall["priority"]) {
  if (priority === "emergency") {
    return "عاجل جدًا";
  }

  if (priority === "urgent") {
    return "عاجل";
  }

  return "عادي";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", " ·");
}

export default function DonorCallCard({
  call,
  targeted = false,
  onDetails,
}: Props) {
  return (
    <article
      className="
        relative
        min-h-[210px]
        overflow-hidden
        rounded-[18px]
        border
        border-[#e1e6e8]
        bg-white
        p-5
        shadow-[0_4px_18px_rgba(28,50,58,0.025)]
      "
    >
      {targeted && (
        <span
          className="
            absolute
            right-0 top-0
            rounded-bl-lg
            bg-[#ad1e38]
            px-3 py-1.5
            text-[9px]
            font-bold
            text-white
          "
        >
          موجه إليك
        </span>
      )}

      <div
        className="
          flex items-start
          justify-between
          gap-3
        "
      >
        <span
          className="
            grid h-[48px]
            min-w-[48px]
            place-items-center
            rounded-xl
            bg-[#fcedf0]
            px-2
            text-sm
            font-extrabold
            text-[#ad1e38]
          "
          dir="ltr"
        >
          {call.blood_type}
        </span>

        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-[#fdecef]
            px-2.5 py-1
            text-[10px]
            font-bold
            text-[#c02d47]
          "
        >
          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-current
            "
          />

          {priorityLabel(call.priority)}
        </span>
      </div>

      <h3
        className="
          mt-6
          text-[14px]
          font-extrabold
          text-[#293b43]
        "
      >
        {call.title}
      </h3>

      <div
        className="
          mt-3
          space-y-2
          text-[10px]
          text-[#879399]
        "
      >
        <p
          className="
            flex items-center
            gap-2
          "
        >
          <MapPin className="h-3.5 w-3.5" />

          {call.institution?.name ?? "المؤسسة"}

          {call.institution?.governorate
            ? ` — ${call.institution.governorate}`
            : ""}
        </p>

        <p
          className="
            flex items-center
            gap-2
          "
        >
          <CalendarDays className="h-3.5 w-3.5" />

          {formatDate(call.needed_at)}
        </p>
      </div>

      <button
        type="button"
        onClick={onDetails}
        className="
          mt-6
          text-[10px]
          font-bold
          text-[#ad1e38]
          transition
          hover:text-[#8f192f]
        "
      >
        عرض التفاصيل ←
      </button>
    </article>
  );
}

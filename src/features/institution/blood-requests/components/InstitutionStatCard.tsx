import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;

  tone: "neutral" | "warning" | "success" | "danger";
}

const styles = {
  neutral: {
    icon: "text-[#788692]",

    decoration: "bg-[#f4f6f7]",
  },

  warning: {
    icon: "text-[var(--institution-yellow)]",

    decoration: "bg-[var(--institution-yellow-soft)]",
  },

  success: {
    icon: "text-[var(--institution-green)]",

    decoration: "bg-[var(--institution-green-soft)]",
  },

  danger: {
    icon: "text-[var(--admin-danger)]",

    decoration: "bg-[var(--admin-danger-soft)]",
  },
};

export default function InstitutionStatCard({
  title,
  value,
  icon: Icon,
  tone,
}: Props) {
  const style = styles[tone];

  return (
    <div
      className="
        institution-card
        relative
        min-h-[125px]
        overflow-hidden
        p-5
      "
    >
      <div
        className="
          relative z-10
          flex
          items-start
          justify-between
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-[var(--admin-text-secondary)]
          "
        >
          {title}
        </p>

        <Icon
          className={`
            h-5 w-5
            ${style.icon}
          `}
          strokeWidth={1.8}
        />
      </div>

      <strong
        className="
          relative z-10
          mt-6 block
          text-4xl
          font-bold
          text-[var(--admin-text-primary)]
        "
      >
        {value}
      </strong>

      <div
        aria-hidden="true"
        className={`
          absolute
          -bottom-10
          -left-10
          h-28 w-28
          rounded-full
          ${style.decoration}
        `}
      />
    </div>
  );
}

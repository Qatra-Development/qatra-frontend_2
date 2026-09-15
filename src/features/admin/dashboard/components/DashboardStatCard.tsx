import type { LucideIcon } from "lucide-react";

import DashboardCard from "./DashboardCard";

type Tone = "neutral" | "warning" | "success" | "danger";

interface DashboardStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: Tone;
}

const styles: Record<
  Tone,
  {
    icon: string;
    decoration: string;
  }
> = {
  neutral: {
    icon: "text-[#9f7379]",
    decoration: "bg-[#f5f2f3]",
  },

  warning: {
    icon: "text-[#f3a000]",
    decoration: "bg-[#fffbea]",
  },

  success: {
    icon: "text-[#17b984]",
    decoration: "bg-[#effbf6]",
  },

  danger: {
    icon: "text-[#ef3434]",
    decoration: "bg-[#fff0f0]",
  },
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  tone,
}: DashboardStatCardProps) {
  const style = styles[tone];

  return (
    <DashboardCard className="relative min-h-[125px] overflow-hidden p-5">
      <div className="relative z-10 flex items-start justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>

        <Icon className={`h-5 w-5 ${style.icon}`} strokeWidth={1.8} />
      </div>

      <p className="relative z-10 mt-6 text-4xl font-bold tracking-tight text-brand-blue">
        {value}
      </p>

      <div
        aria-hidden="true"
        className={`
          absolute -bottom-10 -right-10
          h-28 w-28 rounded-full
          ${style.decoration}
        `}
      />
    </DashboardCard>
  );
}

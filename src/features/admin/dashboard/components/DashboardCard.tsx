import type { HTMLAttributes, ReactNode } from "react";

interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function DashboardCard({
  children,
  className = "",
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={`
        rounded-[20px]
        border border-[#eceef1]
        bg-white
        shadow-[0_8px_25px_rgba(15,23,42,0.07)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

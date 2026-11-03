"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import MobileNavigation from "@/src/components/layout/MobileNavigation";

export default function DonorMobileNavigation({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname !== "/donor/dashboard") {
    return <MobileNavigation>{children}</MobileNavigation>;
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح قائمة التنقل"
        aria-expanded={isOpen}
        className="fixed right-4 top-5 z-50 grid h-10 w-10 place-items-center rounded-xl border border-[#edf0f1] bg-white text-[#6f7e84] shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="إغلاق قائمة التنقل"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#26373e]/35"
          />

          <div
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) {
                setIsOpen(false);
              }
            }}
            className="absolute inset-y-0 right-0 w-[68vw] max-w-[280px] overflow-y-auto border-l border-[#edf0f1] bg-white shadow-2xl [&>aside]:!fixed [&>aside]:!inset-y-0 [&>aside]:!right-0 [&>aside]:!z-[71] [&>aside]:!flex [&>aside]:!h-dvh [&>aside]:!min-h-0 [&>aside]:!w-[68vw] [&>aside]:!max-w-[280px] [&>aside]:!flex-col [&>aside]:!border-0 [&>aside]:!px-0 [&>aside]:!py-0 [&>aside]:!pt-16 [&>aside]:!shadow-none [&>aside>div:first-child]:!absolute [&>aside>div:first-child]:!inset-x-0 [&>aside>div:first-child]:!top-0 [&>aside>div:first-child]:!h-14 [&>aside>div:first-child]:!px-4 [&>aside>div:first-child]:!border-b [&>aside>div:first-child]:!border-[#edf0f1] [&>aside>div:first-child_a>div]:!px-0 [&>aside>div:first-child_a>div]:!pb-0 [&_nav]:!min-h-0 [&_nav]:!w-full [&_nav]:!flex-none [&_nav]:!overflow-y-auto [&_nav]:!px-3 [&_nav]:!pt-2 [&_nav_a]:!h-11 [&_nav_a]:!rounded-xl [&_nav_a]:!px-4 [&_nav_a]:!text-xs [&>aside>div:last-child]:!mt-auto [&>aside>div:last-child]:!w-full [&>aside>div:last-child]:!flex-none [&>aside>div:last-child]:!border-t [&>aside>div:last-child]:!border-[#edf0f1] [&>aside>div:last-child]:!px-3 [&>aside>div:last-child]:!pb-5 [&>aside>div:last-child]:!pt-3 [&>aside>div:last-child_button]:!h-10 [&>aside>div:last-child_button]:!rounded-xl [&>aside>div:last-child_button]:!px-4 [&>aside>div:last-child_button]:!text-xs"
          >
            {children}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق قائمة التنقل"
              className="absolute left-3 top-3 z-[72] grid h-9 w-9 place-items-center rounded-full border border-[#edf0f1] bg-white text-[#6f7e84] shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";

export default function MobileNavigation({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح قائمة التنقل"
        aria-expanded={isOpen}
        className="fixed right-4 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="إغلاق قائمة التنقل"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/35"
          />
          <div
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 w-[280px] max-w-[85vw] overflow-y-auto border-l border-slate-200 bg-white shadow-2xl [&>aside]:!fixed [&>aside]:!inset-y-0 [&>aside]:!right-0 [&>aside]:!z-[71] [&>aside]:!flex [&>aside]:!h-dvh [&>aside]:!min-h-0 [&>aside]:!w-[280px] [&>aside]:!max-w-[85vw] [&>aside]:!flex-col [&>aside]:!items-stretch [&>aside]:!border-0 [&>aside]:!px-0 [&>aside]:!py-0 [&>aside]:!pt-16 [&>aside]:!shadow-none [&_nav]:!min-h-0 [&_nav]:!w-full [&_nav]:!flex-none [&_nav]:!overflow-y-auto [&_nav]:!px-4 [&_nav]:!pt-2 [&_nav>div]:!w-full [&_nav_a]:!h-12 [&_nav_a]:!w-full [&_nav_a]:!justify-start [&_nav_a]:!rounded-xl [&_nav_a]:!px-4 [&_nav_a]:!text-[14px] [&_nav_a]:!gap-3 [&>aside>div:first-child]:!h-14 [&>aside>div:first-child]:!w-full [&>aside>div:first-child]:!flex-none [&>aside>div:first-child]:!absolute [&>aside>div:first-child]:!inset-x-0 [&>aside>div:first-child]:!top-0 [&>aside>div:first-child]:!px-4 [&>aside>div:first-child]:!border-b [&>aside>div:first-child]:!border-slate-100 [&>aside>div:first-child_a>div]:!px-0 [&>aside>div:first-child_a>div]:!pb-0 [&>aside>div:last-child]:!mt-auto [&>aside>div:last-child]:!flex [&>aside>div:last-child]:!w-full [&>aside>div:last-child]:!flex-none [&>aside>div:last-child]:!flex-col [&>aside>div:last-child]:!items-stretch [&>aside>div:last-child]:!px-4 [&>aside>div:last-child]:!pb-5 [&>aside>div:last-child]:!pt-3 [&>aside>div:last-child]:!border-t [&>aside>div:last-child]:!border-slate-100 [&>aside>div:last-child_button]:!h-11 [&>aside>div:last-child_button]:!w-full [&>aside>div:last-child_button]:!justify-start [&>aside>div:last-child_button]:!rounded-xl [&>aside>div:last-child_button]:!px-4"
          >
            {children}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق قائمة التنقل"
              className="absolute left-3 top-3 z-[72] flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

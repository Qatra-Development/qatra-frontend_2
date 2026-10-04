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
            className="absolute inset-y-0 right-0 w-[280px] max-w-[85vw] bg-white shadow-2xl [&>aside]:!fixed [&>aside]:!inset-y-0 [&>aside]:!right-0 [&>aside]:!z-[71] [&>aside]:!flex [&>aside]:!h-dvh [&>aside]:!min-h-0 [&>aside]:!w-[280px] [&>aside]:!max-w-[85vw]"
          >
            {children}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق قائمة التنقل"
              className="absolute left-4 top-4 z-[72] flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Bell, ChevronDown, UserRound } from "lucide-react";

import { usePathname } from "next/navigation";

interface Props {
  userName?: string;
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/donor/history")) {
    return "سجل تبرعاتي";
  }

  return "لوحة التحكم";
}

export default function DonorHeader({ userName = "المتبرع" }: Props) {
  const pathname = usePathname();

  return (
    <header
      className="
        px-5 pt-6
        lg:px-8 lg:pt-8
      "
    >
      <div
        className="
          mx-auto
          flex max-w-[1240px]
          items-center
          justify-between
        "
      >
        <div
          className="
            text-xs
            text-[#849197]
          "
        >
          قطرة
          <span className="mx-2">‹</span>
          <strong
            className="
              font-medium
              text-[#4b5c63]
            "
          >
            {getPageTitle(pathname)}
          </strong>
        </div>

        <div
          className="
            flex items-center
            gap-4
          "
        >
          <button
            type="button"
            aria-label="الإشعارات"
            className="
              grid h-10 w-10
              place-items-center
              rounded-full
              border
              border-[#edf0f1]
              bg-white
              text-[#6f7e84]
            "
          >
            <Bell className="h-4 w-4" />
          </button>

          <div
            className="
              hidden h-[54px]
              min-w-[190px]
              items-center
              gap-3
              rounded-full
              bg-white
              px-4
              shadow-[0_5px_22px_rgba(28,50,58,0.04)]
              sm:flex
            "
          >
            <ChevronDown
              className="
                h-4 w-4
                text-[#879399]
              "
            />

            <div className="mr-auto">
              <strong
                className="
                  block
                  text-xs
                  text-[#293b43]
                "
              >
                {userName}
              </strong>

              <span
                className="
                  mt-0.5 block
                  text-[10px]
                  text-[#849197]
                "
              >
                متبرع
              </span>
            </div>

            <span
              className="
                grid h-9 w-9
                place-items-center
                rounded-full
                bg-[#fbedf0]
                text-[#ad1e38]
              "
            >
              <UserRound className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

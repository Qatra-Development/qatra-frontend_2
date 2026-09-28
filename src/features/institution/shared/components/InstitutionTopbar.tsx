"use client";

import Link from "next/link";

import { Bell, ChevronDown, ChevronLeft } from "lucide-react";

import { usePathname } from "next/navigation";

import { getCurrentInstitutionRoute } from "../config/institution-navigation";

import { useInstitutionIdentity } from "../hooks/useInstitutionIdentity";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export default function InstitutionTopbar() {
  const pathname = usePathname();

  const { user } = useInstitutionIdentity();

  const route = getCurrentInstitutionRoute(pathname);

  const name = user?.name || "مسؤول المؤسسة";

  const image = user?.avatar_url || user?.image_url;

  return (
    <header
      dir="rtl"
      className="
        sticky top-0 z-30
        bg-[var(--admin-page-bg)]/90
        px-4 pt-5 pb-3
        backdrop-blur-md
        sm:px-6
        xl:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1500px]
          items-center
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex items-center
            gap-2 text-sm
          "
        >
          <span className="text-gray-400">قطرة</span>

          <ChevronLeft
            className="
              h-4 w-4
              text-gray-300
            "
          />

          <span
            className="
              font-medium
              text-[var(--admin-text-primary)]
            "
          >
            {route.label}
          </span>
        </div>

        <div
          dir="ltr"
          className="
            flex items-center
            gap-4
          "
        >
          <Link
            href="/institution/notifications"
            aria-label="الإشعارات"
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-full
              border
              border-[var(--admin-border-soft)]
              bg-white
              text-gray-500
              shadow-sm
              transition

              hover:text-[var(--admin-danger)]
            "
          >
            <Bell className="h-[17px] w-[17px]" />
          </Link>

          <Link
            href="/institution/profile"
            className="
              flex
              min-w-[190px]
              items-center
              gap-3
              rounded-full
              border
              border-[var(--admin-border-soft)]
              bg-white
              py-1.5 pr-2 pl-4
              shadow-sm
            "
          >
            {image ? (
              <img
                src={image}
                alt={name}
                className="
                  h-10 w-10
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex h-10 w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f3e6e8]
                  text-sm
                  font-bold
                  text-[var(--admin-danger)]
                "
              >
                {initials(name)}
              </div>
            )}

            <div
              dir="rtl"
              className="
                min-w-0
                flex-1
                text-right
              "
            >
              <p
                className="
                  truncate
                  text-sm
                  font-bold
                  text-[var(--admin-text-primary)]
                "
              >
                {name}
              </p>

              <p
                className="
                  truncate
                  text-[11px]
                  text-gray-400
                "
              >
                مسؤول المؤسسة
              </p>
            </div>

            <ChevronDown
              className="
                h-4 w-4
                text-gray-400
              "
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

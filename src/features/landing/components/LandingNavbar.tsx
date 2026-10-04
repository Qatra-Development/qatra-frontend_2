"use client";

import Link from "next/link";

import { Menu, X } from "lucide-react";

import { useEffect, useState } from "react";

import { LANDING_ROUTES, LANDING_SECTIONS } from "../config/landing.config";

import QatraBrand from "./QatraBrand";

interface Props {
  isAuthenticated: boolean;
  dashboardHref: string;
}

export default function LandingNavbar({
  isAuthenticated,
  dashboardHref,
}: Props) {
  const [activeSection, setActiveSection] = useState("home");

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const elements = LANDING_SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.4],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  function scrollToSection(sectionId: string) {
    setMobileOpen(false);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <header
      className="
        sticky top-0 z-50
        border-b
        border-[#f0f1f2]
        bg-white/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex h-[84px]
          max-w-[1360px]
          items-center
          justify-between
          px-5
          lg:px-8
        "
      >
        <QatraBrand />

        <nav
          className="
            hidden
            items-center
            gap-10
            lg:flex
          "
          aria-label="القائمة الرئيسية"
        >
          {LANDING_SECTIONS.map(({ id, label }) => {
            const active = activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`
                    relative
                    h-[84px]
                    text-[14px]
                    font-semibold
                    transition-colors
                    ${
                      active
                        ? "text-[#a71931]"
                        : "text-[#665b58] hover:text-[#a71931]"
                    }
                  `}
              >
                {label}

                <span
                  className={`
                      absolute
                      bottom-[20px]
                      right-1/2
                      h-[2px]
                      -translate-x-[-50%]
                      rounded-full
                      bg-[#a71931]
                      transition-all
                      ${active ? "w-full opacity-100" : "w-0 opacity-0"}
                    `}
                />
              </button>
            );
          })}
        </nav>

        <div
          className="
            hidden
            items-center
            gap-3
            lg:flex
          "
        >
          {isAuthenticated ? (
            <Link
              href={dashboardHref}
              className="
                inline-flex
                min-h-[44px]
                items-center
                justify-center
                rounded-full
                bg-[#a50022]
                px-8
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:bg-[#8e001d]
                hover:shadow-md
              "
            >
              لوحة التحكم
            </Link>
          ) : (
            <>
              <Link
                href={LANDING_ROUTES.login}
                className="
                  inline-flex
                  min-h-[44px]
                  items-center
                  rounded-full
                  bg-[#fff4f5]
                  px-7
                  text-sm
                  font-bold
                  text-[#a71931]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#fdebed]
                "
              >
                تسجيل الدخول
              </Link>

              <Link
                href={LANDING_ROUTES.register}
                className="
                  inline-flex
                  min-h-[44px]
                  items-center
                  rounded-full
                  bg-[#a50022]
                  px-8
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#8e001d]
                  hover:shadow-md
                "
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="
            grid h-10 w-10
            place-items-center
            rounded-xl
            border
            border-[#eceff0]
            text-[#34474e]
            lg:hidden
          "
          aria-label="فتح القائمة"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="
            border-t
            border-[#edf0f1]
            bg-white
            px-5 py-5
            lg:hidden
          "
        >
          <nav className="space-y-1">
            {LANDING_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`
                    block w-full
                    rounded-xl
                    px-4 py-3
                    text-right
                    text-sm
                    font-semibold
                    ${
                      activeSection === id
                        ? "bg-[#fff0f2] text-[#a71931]"
                        : "text-[#5f6e74]"
                    }
                  `}
              >
                {label}
              </button>
            ))}
          </nav>

          <div
            className="
              mt-4 grid
              grid-cols-2
              gap-2
            "
          >
            {isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="
                  col-span-2
                  rounded-xl
                  bg-[#a50022]
                  px-4 py-3
                  text-center
                  text-sm
                  font-bold
                  text-white
                "
              >
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  href={LANDING_ROUTES.login}
                  className="
                    rounded-xl
                    bg-[#fff2f4]
                    px-4 py-3
                    text-center
                    text-sm
                    font-bold
                    text-[#a71931]
                  "
                >
                  تسجيل الدخول
                </Link>

                <Link
                  href={LANDING_ROUTES.register}
                  className="
                    rounded-xl
                    bg-[#a50022]
                    px-4 py-3
                    text-center
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

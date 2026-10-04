import Link from "next/link";

import { Building2, Droplet } from "lucide-react";

import { LANDING_ROUTES } from "../config/landing.config";

import styles from "../styles/landing.module.css";

export default function LandingHero() {
  return (
    <section
      id="home"
      className="
        scroll-mt-[90px]
        pt-12
        lg:pt-20
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-[650px]
          max-w-[1360px]
          items-center
          gap-14
          px-5
          lg:grid-cols-2
          lg:px-8
        "
      >
        <div>
          <h1
            className="
              max-w-[620px]
              text-[46px]
              font-black
              leading-[1.22]
              tracking-[-0.035em]
              text-[#181818]
              sm:text-[58px]
              lg:text-[66px]
            "
          >
            تبرعك اليوم
            <span
              className="
                block
                text-[#a50022]
              "
            >
              حياة تنبض غداً
            </span>
          </h1>

          <p
            className="
              mt-8
              max-w-[620px]
              text-[15px]
              leading-[2]
              text-[#6e625f]
              sm:text-[16px]
            "
          >
            منصة رائدة لربط المتبرعين بالمؤسسات الصحية بسلاسة وموثوقية. نحن نسهل
            عملية التبرع بالدم لضمان وصوله لمن هم في أمس الحاجة إليه.
          </p>

          <div
            className="
              mt-9
              flex flex-wrap
              gap-4
            "
          >
            <Link
              href={LANDING_ROUTES.donorRegister}
              className="
                inline-flex
                min-h-[54px]
                items-center
                gap-3
                rounded-xl
                bg-[#a50022]
                px-7
                text-[14px]
                font-bold
                text-white
                shadow-[0_10px_24px_rgba(165,0,34,0.15)]
                transition
                duration-300
                hover:-translate-y-1
                hover:bg-[#8e001d]
                hover:shadow-[0_14px_28px_rgba(165,0,34,0.2)]
              "
            >
              <Droplet className="h-5 w-5" />
              تبرع بالدم
            </Link>

            <Link
              href={LANDING_ROUTES.institutionRegister}
              className="
                inline-flex
                min-h-[54px]
                items-center
                gap-3
                rounded-xl
                border
                border-[#efd9dc]
                bg-white
                px-7
                text-[14px]
                font-bold
                text-[#a71931]
                transition
                duration-300
                hover:-translate-y-1
                hover:border-[#a71931]/30
                hover:bg-[#fff7f8]
              "
            >
              <Building2 className="h-5 w-5" />
              أنا مؤسسة صحية
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        h-[500px]
        w-full
        max-w-[590px]
        sm:h-[560px]
      "
    >
      <div
        className={`
          absolute
          left-1/2 top-1/2
          h-[400px] w-[400px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#fff1f3]
          sm:h-[455px]
          sm:w-[455px]
          ${styles.heroGlow}
        `}
      />

      <div
        className={`
          absolute
          left-1/2 top-1/2
          h-[455px] w-[455px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-dashed
          border-[#e9a9b4]
          sm:h-[520px]
          sm:w-[520px]
          ${styles.orbitOne}
        `}
      />

      <div
        className={`
          absolute
          left-1/2 top-1/2
          h-[330px] w-[330px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#f0b8c1]/60
          sm:h-[385px]
          sm:w-[385px]
          ${styles.orbitTwo}
        `}
      />

      <svg
        viewBox="0 0 430 310"
        aria-hidden="true"
        className={`
          absolute
          left-1/2 top-1/2
          z-10
          w-[350px]
          -translate-x-1/2
          -translate-y-1/2
          drop-shadow-[0_28px_28px_rgba(160,0,34,0.15)]
          sm:w-[420px]
          ${styles.heroDrop}
        `}
      >
        <defs>
          <linearGradient id="qatra-drop" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#d13c55" />

            <stop offset="58%" stopColor="#bb1735" />

            <stop offset="100%" stopColor="#a70a29" />
          </linearGradient>

          <linearGradient id="qatra-shine" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />

            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.38" />
          </linearGradient>
        </defs>

        <path
          d="
            M74 228
            C20 183 38 103 122 62
            C202 23 317 34 369 101
            C414 159 372 229 292 260
            C216 291 121 268 74 228Z
          "
          fill="url(#qatra-drop)"
        />

        <rect
          x="268"
          y="91"
          width="42"
          height="105"
          rx="21"
          transform="rotate(45 268 91)"
          fill="url(#qatra-shine)"
        />
      </svg>

      <div
        className={`
          absolute
          right-[1%]
          top-[13%]
          z-20
          flex min-w-[220px]
          items-center
          gap-3
          rounded-2xl
          bg-white
          px-4 py-3
          shadow-[0_12px_30px_rgba(30,45,50,0.09)]
          sm:right-[4%]
          ${styles.floatCardOne}
        `}
      >
        <span
          className="
            grid h-10 w-10
            place-items-center
            rounded-xl
            bg-[#a71931]
            text-sm
            font-black
            text-white
          "
        >
          !
        </span>

        <div className="flex-1">
          <strong
            className="
              block
              text-[11px]
              font-black
              text-[#26373e]
            "
          >
            لا توجد طلبات دم
          </strong>

          <span
            className="
              mt-1 block
              text-[9px]
              text-[#9ba5a9]
            "
          >
            ستظهر الطلبات بعد إنشائها
          </span>
        </div>

        <span
          className="
            grid h-8 w-8
            place-items-center
            rounded-xl
            bg-[#eaf8f3]
            text-[10px]
            font-black
            text-[#159568]
          "
        >
          0
        </span>
      </div>

      <div
        className={`
          absolute
          bottom-[12%]
          left-0
          z-20
          flex min-w-[230px]
          items-center
          gap-3
          rounded-2xl
          bg-white
          px-4 py-3
          shadow-[0_12px_30px_rgba(30,45,50,0.09)]
          sm:left-[1%]
          ${styles.floatCardTwo}
        `}
      >
        <div
          className="
            flex -space-x-2
            rtl:space-x-reverse
          "
        >
          <span
            className="
              grid h-8 w-8
              place-items-center
              rounded-full
              bg-[#f9d9de]
              text-[9px]
              font-bold
              text-[#a71931]
            "
          >
            م
          </span>

          <span
            className="
              grid h-8 w-8
              place-items-center
              rounded-full
              bg-[#e5edf4]
              text-[9px]
              font-bold
              text-[#647887]
            "
          >
            ل
          </span>

          <span
            className="
              grid h-8 w-8
              place-items-center
              rounded-full
              bg-[#fdeff1]
              text-[9px]
              font-bold
              text-[#c54a5e]
            "
          >
            أ
          </span>
        </div>

        <div>
          <strong
            className="
              block
              text-[11px]
              font-black
              text-[#26373e]
            "
          >
            10 متبرع
          </strong>

          <span
            className="
              mt-1 block
              text-[9px]
              text-[#9ba5a9]
            "
          >
            من مختلف المحافظات
          </span>
        </div>
      </div>

      <span
        className={`
          absolute
          bottom-[20%]
          right-[8%]
          z-20
          h-[16px] w-[16px]
          rounded-full
          bg-[#149a70]
          ${styles.greenDot}
        `}
      />
    </div>
  );
}

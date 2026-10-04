import Image from "next/image";
import Link from "next/link";

interface Props {
  showEnglish?: boolean;
  className?: string;
}

export default function QatraBrand({
  showEnglish = true,
  className = "",
}: Props) {
  return (
    <Link
      href="/#home"
      className={`
        inline-flex
        items-center
        gap-3
        ${className}
      `}
    >
      <Image
        src="/img/logo.png"
        alt="قطرة"
        width={42}
        height={42}
        priority
        className="
          h-[42px] w-[42px]
          object-contain
        "
      />

      <span
        className="
          flex flex-col
          leading-none
        "
      >
        <strong
          className="
            text-[21px]
            font-black
            text-[#123f42]
          "
        >
          قطرة
        </strong>

        {showEnglish && (
          <span
            className="
              mt-1
              text-[8px]
              font-bold
              tracking-[0.38em]
              text-[#65757c]
            "
          >
            QATRA
          </span>
        )}
      </span>
    </Link>
  );
}

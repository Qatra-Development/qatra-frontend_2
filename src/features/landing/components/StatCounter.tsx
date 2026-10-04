"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
}

function formatValue(value: number) {
  if (value >= 1000) {
    const compact = new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(value);

    return `+${compact}`;
  }

  return `+${value}`;
}

export default function StatCounter({ target }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();

        const duration = 1200;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);

          const eased = 1 - Math.pow(1 - progress, 3);

          setValue(Math.round(target * eased));

          if (progress < 1) {
            frame = requestAnimationFrame(animate);
          }
        };

        frame = requestAnimationFrame(animate);
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      cancelAnimationFrame(frame);
    };
  }, [target]);

  return <span ref={ref}>{formatValue(value)}</span>;
}

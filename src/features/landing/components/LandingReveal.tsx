"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import styles from "../styles/landing.module.css";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function LandingReveal({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.14,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        ${styles.reveal}
        ${visible ? styles.revealVisible : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

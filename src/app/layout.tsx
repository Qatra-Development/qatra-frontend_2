import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppToaster } from "@/components/shared/AppToaster";

export const metadata: Metadata = { 
  title: "قطرة - منصة التبرع بالدم", 
  description: "منصة ذكية تربط بين المتبرعين والمحتاجين للدم في فلسطين" 
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" className="font-sans"><body className="antialiased">{children}<AppToaster /></body></html>;
}

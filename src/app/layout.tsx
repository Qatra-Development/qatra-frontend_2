import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  return <html lang="ar" dir="rtl"><body className="antialiased">{children}</body></html>;
}

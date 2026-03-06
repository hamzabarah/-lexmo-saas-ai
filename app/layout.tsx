import type { Metadata } from "next";
import { Cairo, Orbitron } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECOMY",
  description: "Next Generation E-commerce Training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${orbitron.variable} antialiased bg-[#0A0A0A] text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

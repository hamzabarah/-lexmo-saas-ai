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
  title: "LEXMO.AI",
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
        className={`${cairo.variable} ${orbitron.variable} antialiased bg-[#030712] text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

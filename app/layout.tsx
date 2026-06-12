import type { Metadata } from "next";
import { Cairo, Orbitron } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  metadataBase: new URL("https://www.ecomy.ai"),
  title: "ECOMY",
  description: "Next Generation E-commerce Training",
  openGraph: {
    title: "أكاديمية إيكومي — ECOMY",
    description: "التجارة الإلكترونية بالعربي — تكوين، مرافقة، و+300 دليل مجاني.",
    url: "https://www.ecomy.ai",
    siteName: "ECOMY",
    locale: "ar_AR",
    type: "website",
    images: [
      {
        url: "/images/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "أكاديمية إيكومي — ECOMY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية إيكومي — ECOMY",
    description: "التجارة الإلكترونية بالعربي — تكوين، مرافقة، و+300 دليل مجاني.",
    images: ["/images/brand/og-image.png"],
  },
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
      <GoogleAnalytics gaId="G-P3LDE3ME0N" />
    </html>
  );
}

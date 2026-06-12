import type { Metadata } from "next";

// Canonical dédié (page client). Résolu via metadataBase ->
// https://www.ecomy.ai/diagnostic
export const metadata: Metadata = {
  alternates: { canonical: "/diagnostic" },
};

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

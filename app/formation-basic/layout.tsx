import type { Metadata } from "next";

// Canonical dédié (page client). Résolu via metadataBase ->
// https://www.ecomy.ai/formation-basic
export const metadata: Metadata = {
  alternates: { canonical: "/formation-basic" },
};

export default function FormationBasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

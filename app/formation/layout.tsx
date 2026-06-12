import type { Metadata } from "next";

// Canonical dédié (la page est un client component et ne peut pas exporter de
// metadata). Résolu en absolu via metadataBase -> https://www.ecomy.ai/formation
export const metadata: Metadata = {
  alternates: { canonical: "/formation" },
};

export default function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

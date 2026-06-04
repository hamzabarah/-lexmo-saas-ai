import type { Metadata } from "next";
import AvisPreviewClient from "./AvisPreviewClient";

// Page privée de vérification : jamais indexée, jamais dans le sitemap.
export const metadata: Metadata = {
  title: "Aperçu témoignages (privé)",
  robots: { index: false, follow: false, nocache: true },
};

export default function AvisPreviewPage() {
  return <AvisPreviewClient />;
}

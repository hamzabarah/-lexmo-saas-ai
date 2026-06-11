import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les fichiers de public/ sont servis en statique par le CDN Vercel : ils ne
  // doivent JAMAIS être embarqués dans le bundle des fonctions serverless.
  // Sans cette exclusion, le traceur de fichiers de Next (qui ne peut pas
  // résoudre statiquement les accès fs de lib/blog via process.cwd()) embarque
  // tout public/images/** (~400 Mo de covers) dans chaque fonction qui importe
  // ce lib (robots, sitemap, /blog/[slug]…), ce qui dépasse la limite Vercel de
  // 300 Mo (« robots.txt.rsc 577mb »).
  outputFileTracingExcludes: {
    "*": ["public/**"],
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private / member / API areas out of the index.
      disallow: [
        "/api/",
        "/dashboard/",
        "/avis-preview",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/auth/",
        "/payment-success",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

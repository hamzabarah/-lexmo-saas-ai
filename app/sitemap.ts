import type { MetadataRoute } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  // Public static pages of the site.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/formation`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/formation-basic`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/diagnostic`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/legal/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/refund`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Published blog articles, lastModified from front-matter `updated`.
  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}

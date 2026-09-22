import type { MetadataRoute } from "next";
import { card } from "@/app/_config/card";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = card.site.url || "https://moneyplantfx.com";
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ceo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/head-of-marketing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}

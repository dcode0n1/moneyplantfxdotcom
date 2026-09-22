import type { MetadataRoute } from "next";
import { card } from "@/app/_config/card";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = card.site.url || "https://moneyplantfx.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

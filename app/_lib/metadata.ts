import type { Metadata } from "next";
import { card, Person } from "@/app/_config/card";

export function buildPersonMetadata(person: Person, path: string): Metadata {
  const title = `${person.name} — ${person.title} | Digital Executive Card`;
  const description = `${card.brand.name} Digital Executive Card for ${person.name}, ${person.title}. CMA Category 1 & Category 5 compliant institutional trading platform. Connect, save contact, and access the official platform.`;
  const baseUrl = card.site.url || "https://moneyplantfx.com";
  const canonicalUrl = `${baseUrl}${path}`;

  const portraitImage = {
    url: person.portrait,
    alt: person.portraitAlt,
  };

  const ogImageUrl = person.ogImage ?? card.site.ogImage;
  const personOgImage = {
    url: ogImageUrl,
    width: 1200,
    height: 630,
    alt: `${person.name} — ${person.title}`,
  };

  return {
    title,
    description,
    applicationName: card.site.appName,
    authors: [{ name: person.name }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: canonicalUrl,
      siteName: card.brand.name,
      images: [personOgImage, portraitImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl, person.portrait],
    },
    other: {
      "profile:first_name": person.name.split(" ")[0] || person.name,
      "profile:last_name": person.name.split(" ").slice(1).join(" ") || "",
      "profile:role": person.role,
    },
  };
}

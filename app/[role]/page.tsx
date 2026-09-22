import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { card, profiles } from "@/app/_config/card";
import { CardView } from "@/app/_components/CardView";

interface RolePageProps {
  params: Promise<{ role: string }>;
}

export async function generateStaticParams() {
  return [
    { role: "ceo" },
    { role: "head-of-marketing" },
    { role: "marketing" },
  ];
}

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { role } = await params;
  const person = profiles[role.toLowerCase()];
  if (!person) return {};

  const title = `${person.name} — ${person.title} | Digital Executive Card`;
  const description = `${card.brand.name} Digital Executive Card for ${person.name}, ${person.title}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  const person = profiles[role.toLowerCase()];

  if (!person) {
    notFound();
  }

  return <CardView person={person} />;
}

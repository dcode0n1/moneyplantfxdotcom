import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profiles } from "@/app/_config/card";
import { CardView } from "@/app/_components/CardView";
import { buildPersonMetadata } from "@/app/_lib/metadata";

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

  return buildPersonMetadata(person, `/${role.toLowerCase()}`);
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  const person = profiles[role.toLowerCase()];

  if (!person) {
    notFound();
  }

  return <CardView person={person} />;
}

import type { Metadata } from "next";
import { card, profiles } from "@/app/_config/card";
import { CardView } from "@/app/_components/CardView";
import { buildPersonMetadata } from "@/app/_lib/metadata";

export const metadata: Metadata = buildPersonMetadata(profiles.ceo, "/");

export default function Home() {
  return <CardView person={card.person} />;
}

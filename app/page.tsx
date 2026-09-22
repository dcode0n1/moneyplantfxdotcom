import { card } from "@/app/_config/card";
import { CardView } from "@/app/_components/CardView";

export default function Home() {
  return <CardView person={card.person} />;
}

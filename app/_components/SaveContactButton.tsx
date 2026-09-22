import { UserPlus } from "lucide-react";
import { card, Person } from "@/app/_config/card";

interface SaveContactButtonProps {
  person?: Person;
}

export function SaveContactButton({ person = card.person }: SaveContactButtonProps) {
  const { contact } = card;
  const vcardUrl = person.vcard || contact.vcard;
  const filename = person.filename || contact.filename;
  const mime = person.mime || contact.mime;

  return (
    <a href={vcardUrl} download={filename} type={mime} className="btn-accent w-full">
      <UserPlus className="size-5" aria-hidden="true" />
      {contact.cta}
    </a>
  );
}

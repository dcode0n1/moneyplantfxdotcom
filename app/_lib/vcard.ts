interface VCardPerson {
  name: string;
  role: string;
  organization: string;
  url?: string;
  email?: string;
  phone?: string;
}

function escape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([,;])/g, "\\$1");
}

/**
 * Builds the vCard 3.0 text for an executive.
 */
export function buildVCard(person: VCardPerson): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${escape(person.name)};;;`,
    `FN:${escape(person.name)}`,
    `ORG:${escape(person.organization)}`,
    `TITLE:${escape(person.role)}`,
  ];

  if (person.email) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${escape(person.email)}`);
  }
  if (person.phone) {
    lines.push(`TEL;TYPE=CELL,PREF:${escape(person.phone)}`);
  }

  lines.push(`URL:${person.url || "https://moneyplantfx.com/"}`);
  lines.push("END:VCARD");
  lines.push("");

  return lines.join("\r\n");
}

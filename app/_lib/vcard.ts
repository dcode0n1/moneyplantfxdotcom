interface VCardPerson {
  name: string;
  role: string;
  organization: string;
  url?: string;
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
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${escape(person.name)};;;`,
    `FN:${escape(person.name)}`,
    `ORG:${escape(person.organization)}`,
    `TITLE:${escape(person.role)}`,
    `URL:${person.url || "https://moneyplantfx.com/"}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

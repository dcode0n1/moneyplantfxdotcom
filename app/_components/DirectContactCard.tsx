"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { card, Person } from "@/app/_config/card";
import { useClipboard } from "@/app/_hooks/useClipboard";
import { CopyButton } from "./CopyButton";
import { SurfaceCard } from "./SurfaceCard";

interface DirectContactCardProps {
  person?: Person;
}

function DirectContactInner({ person }: { person: Person }) {
  const { copy, isCopied } = useClipboard();

  const cleanPhone = person.phone ? person.phone.replace(/[^0-9+]/g, "") : "";
  const waPhone = person.phone ? person.phone.replace(/[^0-9]/g, "") : "";

  return (
    <SurfaceCard labelledBy="direct-contact-title" className="space-y-3.5">
      <header className="flex items-center justify-between border-b border-line pb-2.5">
        <h2 id="direct-contact-title" className="font-mono text-xs font-semibold tracking-wider text-ink uppercase">
          Direct Executive Contact
        </h2>
        <span className="rounded-md border border-telemetry/30 bg-telemetry/10 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-telemetry uppercase">
          Verified
        </span>
      </header>

      <div className="space-y-3">
        {person.phone && (
          <div className="flex flex-col gap-2 rounded-xl border border-line/60 bg-canvas-2/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-telemetry/15 text-telemetry">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-medium tracking-wider text-ink-muted uppercase">
                    Direct Line
                  </p>
                  <p className="truncate font-mono text-sm font-semibold text-ink">
                    {person.phoneFormatted ?? person.phone}
                  </p>
                </div>
              </div>
              <CopyButton
                label="Copy phone number"
                copied={isCopied("phone")}
                onCopy={() => copy("phone", person.phone!, "Phone number")}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${cleanPhone}`}
                className="btn-secondary min-h-10 text-xs py-2"
                aria-label={`Call ${person.name}`}
              >
                <Phone className="size-3.5" aria-hidden="true" />
                Call Direct
              </a>
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-10 text-xs py-2 hover:border-emerald-500 hover:text-emerald-400"
                aria-label={`Message ${person.name} on WhatsApp`}
              >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {person.email && (
          <div className="flex flex-col gap-2 rounded-xl border border-line/60 bg-canvas-2/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-telemetry/15 text-telemetry">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-medium tracking-wider text-ink-muted uppercase">
                    Executive Email
                  </p>
                  <p className="truncate font-mono text-sm font-semibold text-ink">
                    {person.email}
                  </p>
                </div>
              </div>
              <CopyButton
                label="Copy email address"
                copied={isCopied("email")}
                onCopy={() => copy("email", person.email!, "Email address")}
              />
            </div>

            <div className="pt-1">
              <a
                href={`mailto:${person.email}`}
                className="btn-secondary min-h-10 w-full text-xs py-2"
                aria-label={`Send email to ${person.name}`}
              >
                <Mail className="size-3.5" aria-hidden="true" />
                Send Email
              </a>
            </div>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}

export function DirectContactCard({ person = card.person }: DirectContactCardProps) {
  if (!person.phone && !person.email) {
    return null;
  }

  return <DirectContactInner person={person} />;
}

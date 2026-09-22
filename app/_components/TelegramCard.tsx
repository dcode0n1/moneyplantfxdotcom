"use client";

import { Send } from "lucide-react";
import { card, Person } from "@/app/_config/card";
import { useClipboard } from "@/app/_hooks/useClipboard";
import { CopyButton } from "./CopyButton";
import { ExternalAction } from "./ExternalAction";
import { SurfaceCard } from "./SurfaceCard";

interface TelegramCardProps {
  person?: Person;
}

export function TelegramCard({ person = card.person }: TelegramCardProps) {
  const { telegramCard } = card;
  const { copy, isCopied } = useClipboard();
  const handle = `@${person.telegram}`;

  return (
    <SurfaceCard labelledBy="telegram-heading">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-telemetry/15 text-telemetry">
          <Send className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="telegram-heading" className="text-xs font-medium tracking-wider text-ink-muted uppercase">
            {telegramCard.heading}
          </h2>
          <p className="truncate font-mono text-base text-ink">{handle}</p>
        </div>
        <CopyButton
          label={telegramCard.copyLabel}
          copied={isCopied("telegram")}
          onCopy={() => copy("telegram", handle, telegramCard.toastLabel)}
        />
      </div>
      <ExternalAction url={person.telegramUrl} className="btn-secondary mt-3 w-full">
        <Send className="size-4" aria-hidden="true" />
        {telegramCard.openCta}
      </ExternalAction>
    </SurfaceCard>
  );
}

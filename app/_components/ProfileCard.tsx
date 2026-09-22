import Image from "next/image";
import { card, Person } from "@/app/_config/card";
import { SurfaceCard } from "./SurfaceCard";

interface ProfileCardProps {
  /** Resolved server-side; null when the portrait asset is not deployed yet. */
  portraitSrc: string | null;
  person?: Person;
}

export function ProfileCard({ portraitSrc, person = card.person }: ProfileCardProps) {
  const isCompanyLogo = person.portrait.includes("MoneyplantFX") || person.portrait.includes("android-chrome");

  return (
    <SurfaceCard labelledBy="profile-name" className="relative overflow-hidden text-center">
      <div
        className="lux-hero-bg pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)_0%,transparent_65%)] opacity-25"
        aria-hidden="true"
      />
      <div className="relative mx-auto size-28">
        <div className="portrait-glow absolute -inset-1.5 rounded-full" aria-hidden="true" />
        <div className="relative size-28 overflow-hidden rounded-full border-2 border-primary bg-canvas-2">
          {portraitSrc ? (
            <Image
              src={portraitSrc}
              alt={person.portraitAlt}
              width={224}
              height={224}
              sizes="112px"
              preload
              loading="eager"
              fetchPriority="high"
              className={`size-full ${isCompanyLogo ? "object-contain p-3.5 bg-canvas" : "object-cover"}`}
              style={{ objectPosition: person.portraitPosition ?? "center" }}
            />
          ) : (
            <span
              role="img"
              aria-label={person.portraitAlt}
              className="flex size-full items-center justify-center text-4xl font-bold text-ink"
            >
              {person.initials}
            </span>
          )}
        </div>
        <span
          className="absolute right-1.5 bottom-1.5 size-4 rounded-full border-2 border-surface bg-telemetry"
          aria-hidden="true"
        />
      </div>
      <h2 id="profile-name" className="lux-mask relative mt-4 text-2xl font-bold text-ink">
        <span>{person.name}</span>
      </h2>
      <p className="lux-mask relative mt-0.5 text-base text-ink-muted">
        <span>{person.title}</span>
      </p>
    </SurfaceCard>
  );
}

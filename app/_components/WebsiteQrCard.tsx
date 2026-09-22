import { Globe, ArrowUpRight } from "lucide-react";
import { card } from "@/app/_config/card";
import { ExternalAction } from "./ExternalAction";
import { QrTile } from "./QrTile";
import { SurfaceCard } from "./SurfaceCard";

export function WebsiteQrCard() {
  const url = card.brand.websiteUrl;

  return (
    <SurfaceCard labelledBy="website-qr-heading" className="text-center">
      <div className="flex items-center justify-center gap-2 text-ink-muted">
        <Globe className="size-4 text-telemetry" aria-hidden="true" />
        <span className="font-mono text-xs tracking-wider uppercase">Official Website</span>
      </div>

      <h2 id="website-qr-heading" className="mt-1 text-lg font-semibold text-ink">
        moneyplantfx.com
      </h2>
      <p className="mt-0.5 text-xs text-ink-muted">
        Scan QR code or click below to visit our official website
      </p>

      <div className="my-4 flex justify-center">
        <div className="rounded-2xl border border-line bg-canvas-2 p-3 shadow-inner">
          <QrTile url={url} label="QR code for moneyplantfx.com" size={144} />
        </div>
      </div>

      <ExternalAction url={url} className="btn-accent w-full">
        <span>Visit moneyplantfx.com</span>
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </ExternalAction>
    </SurfaceCard>
  );
}

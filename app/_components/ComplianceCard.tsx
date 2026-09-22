import { ShieldCheck } from "lucide-react";
import { card } from "@/app/_config/card";
import { SurfaceCard } from "./SurfaceCard";

export function ComplianceCard() {
  const { compliance } = card;

  return (
    <SurfaceCard labelledBy="compliance-title" className="space-y-3.5">
      <header className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-telemetry" aria-hidden="true" />
          <h2 id="compliance-title" className="font-mono text-xs font-semibold tracking-wider text-ink uppercase">
            {compliance.title}
          </h2>
        </div>
        <span className="rounded-md border border-telemetry/30 bg-telemetry/10 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-telemetry uppercase">
          {compliance.badge}
        </span>
      </header>

      <p className="text-xs font-medium text-ink/90">
        {compliance.summary}
      </p>

      <div className="space-y-2.5 text-xs">
        {compliance.categories.map((cat) => (
          <div key={cat.name} className="rounded-xl border border-line/60 bg-canvas-2/80 p-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
              <span className="font-semibold text-ink">{cat.name}</span>
              <span className="font-mono text-[10px] text-telemetry font-medium">
                {cat.subtitle}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {cat.description}
            </p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

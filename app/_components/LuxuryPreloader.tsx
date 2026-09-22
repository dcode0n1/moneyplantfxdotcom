"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { card } from "@/app/_config/card";
import { INTRO_ACTIVE_CLASS, INTRO_SKIP_CLASS, isIntroActive } from "@/app/_lib/intro";
import { setRevealed } from "@/app/_lib/reveal";
import { LogoMark } from "./LogoMark";

export type PreloaderPhase = "idle" | "counting" | "fadeUi" | "revealed" | "done";

export interface LuxuryPreloaderProps {
  /** Length of the counting phase in ms. */
  duration?: number;
  /** Play even when the session has already seen the intro. */
  forceShow?: boolean;
}

export const LOGO_TARGET_ID = "header-brand-logo-mark";
export const FADE_UI_MS = 350;
export const REVEAL_MS = 1000;
/** Extra headroom before the safety timeout force-reveals the app. */
export const SAFETY_MARGIN_MS = 1500;

/**
 * MoneyplantFX cinematic intro: telemetry count → UI fade → curtain reveal while the
 * logo flies into the AppBar (#header-brand-logo-mark) → card revealed.
 * The Digital Card is rendered behind it from the first byte; this only
 * choreographs the reveal and can never trap the user (safety timeout).
 */
export function LuxuryPreloader({ duration = 1600, forceShow = false }: LuxuryPreloaderProps) {
  const [phase, setPhase] = useState<PreloaderPhase>("idle");
  const [progress, setProgress] = useState(0);
  const flyerRef = useRef<HTMLDivElement>(null);

  // Decide on mount (the <head> boot script already chose; forceShow overrides).
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (forceShow) {
      root.classList.remove(INTRO_SKIP_CLASS);
      root.classList.add(INTRO_ACTIVE_CLASS);
    }
    // Client-only decision; server HTML always renders the idle overlay.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(forceShow || isIntroActive() ? "counting" : "done");
  }, [forceShow]);

  // Safety net: whatever happens, the app is revealed.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setPhase("done"),
      duration + FADE_UI_MS + REVEAL_MS + SAFETY_MARGIN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [duration]);

  // Phase timeline.
  useEffect(() => {
    if (phase === "counting") {
      const start = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        const value = Math.min(100, Math.round(((now - start) / duration) * 100));
        setProgress(value);
        if (value < 100) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      const timer = window.setTimeout(() => {
        setProgress(100);
        setPhase("fadeUi");
      }, duration);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }
    if (phase === "fadeUi") {
      const timer = window.setTimeout(() => setPhase("revealed"), FADE_UI_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "revealed") {
      const timer = window.setTimeout(() => setPhase("done"), REVEAL_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase, duration]);

  // Logo flight: measure the AppBar target, never hard-coded coordinates.
  useLayoutEffect(() => {
    if (phase !== "revealed") return;
    setRevealed(true);
    const flyer = flyerRef.current;
    const target = document.getElementById(LOGO_TARGET_ID);
    if (!flyer) return;
    const to = target?.getBoundingClientRect();
    const from = flyer.getBoundingClientRect();
    if (!to || to.width === 0 || from.width === 0) {
      flyer.classList.add("lux-flyer-fade"); // Missing target: fade out gracefully.
      return;
    }
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    flyer.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
  }, [phase]);

  // Handoff: in the same commit the overlay unmounts, the AppBar logo reappears.
  useLayoutEffect(() => {
    if (phase !== "done") return;
    const root = document.documentElement;
    root.classList.remove(INTRO_ACTIVE_CLASS);
    root.classList.add(INTRO_SKIP_CLASS);
    setRevealed(true);
  }, [phase]);

  if (phase === "done") return null;

  const stepIndex = Math.min(
    card.intro.steps.length - 1,
    Math.floor((progress / 100) * card.intro.steps.length),
  );

  return (
    <div
      className={`lux-preloader phase-${phase}${phase === "revealed" ? " curtains-open" : ""}`}
      data-phase={phase}
    >
      <div className="lux-curtain lux-curtain-left" aria-hidden="true" />
      <div className="lux-curtain lux-curtain-right" aria-hidden="true" />

      <div className="lux-stage">
        <div ref={flyerRef} className="lux-flyer" aria-hidden="true">
          <LogoMark className="size-full" />
        </div>

        <div className="lux-ui" aria-hidden="true">
          <p className="lux-mask mt-6 text-2xl font-bold tracking-[0.2em] text-ink">
            <span>{card.intro.brand}</span>
          </p>
          <p className="lux-mask mt-1 font-mono text-[11px] tracking-[0.4em] text-ink-muted">
            <span>{card.intro.tagline}</span>
          </p>
          <p className="mt-8 font-mono text-[11px] tracking-[0.35em] text-telemetry">{card.intro.access}</p>
        </div>

        <div className="lux-ui lux-telemetry">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={card.intro.access}
            className="h-px w-48 overflow-hidden bg-line"
          >
            <div className="lux-bar h-full bg-telemetry" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <p
            className="mt-3 flex w-48 justify-between font-mono text-[10px] tracking-widest text-ink-muted"
            aria-hidden="true"
          >
            <span>{card.intro.steps[stepIndex]}</span>
            <span>{String(progress).padStart(3, "0")}%</span>
          </p>
          <p className="mt-10 font-mono text-[10px] tracking-[0.3em] text-ink-muted" aria-hidden="true">
            {card.intro.motto}
          </p>
        </div>
      </div>

      <button type="button" className="lux-skip-btn" onClick={() => setPhase("done")}>
        {card.intro.skipLabel}
      </button>
    </div>
  );
}

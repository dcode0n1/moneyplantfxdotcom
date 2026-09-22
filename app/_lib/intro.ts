export const INTRO_SESSION_KEY = "mpfx_intro_seen";

/** Class on <html> while the cinematic intro plays (hides AppBar logo, locks scroll). */
export const INTRO_ACTIVE_CLASS = "lux-active";
/** Class on <html> when the intro is skipped (preloader hidden, hero revealed pre-hydration). */
export const INTRO_SKIP_CLASS = "lux-skip";

/**
 * Inline <head> script — the single place the intro decision is made.
 * It runs before first paint so server-rendered HTML never flashes the
 * wrong state:
 *
 *   reduced motion            → skip
 *   ?intro=1 / ?preview=1     → play
 *   first visit this session  → play (and mark seen)
 *   otherwise                 → skip
 */
export const introBootScript = `(function(){var d=document.documentElement,k=${JSON.stringify(
  INTRO_SESSION_KEY,
)},r=false,s=false,p;try{r=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}try{p=new URLSearchParams(location.search)}catch(e){p=null}var f=!!p&&(p.get("intro")==="1"||p.get("preview")==="1");try{s=sessionStorage.getItem(k)==="1"}catch(e){}if(!r&&(f||!s)){d.classList.add(${JSON.stringify(
  INTRO_ACTIVE_CLASS,
)});try{sessionStorage.setItem(k,"1")}catch(e){}}else{d.classList.add(${JSON.stringify(
  INTRO_SKIP_CLASS,
)})}})();`;

/** Read the decision made by `introBootScript`. */
export function isIntroActive(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains(INTRO_ACTIVE_CLASS);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

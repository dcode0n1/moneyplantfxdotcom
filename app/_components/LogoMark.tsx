interface LogoMarkProps {
  className?: string;
  title?: string;
}

/** MoneyplantFX mark (inline SVG with clip-path so the preloader handoff can target the <svg>). */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 192 192"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <clipPath id="logo-rounded">
        <rect width="192" height="192" rx="42" />
      </clipPath>
      <g clipPath="url(#logo-rounded)">
        <image
          href="/MoneyplantFX/android-chrome-192x192.png"
          width="192"
          height="192"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
}

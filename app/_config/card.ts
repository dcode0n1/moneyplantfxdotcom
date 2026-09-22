/**
 * Single source of truth for all business content.
 * Components must never hard-code names, URLs, credentials or copy.
 *
 * Empty-string URLs are stakeholder TODOs — the UI renders an
 * "unavailable" state for them. Never invent a destination.
 */

const telegram = "adamken0007";

export interface Person {
  slug: string;
  name: string;
  title: string;
  role: string;
  organization: string;
  initials: string;
  portrait: string;
  portraitPosition?: string;
  portraitAlt: string;
  ogImage?: string;
  email?: string;
  phone?: string;
  phoneFormatted?: string;
  telegram: string;
  telegramUrl: string;
  vcard: string;
  filename: string;
  mime: string;
}

export const profiles: Record<string, Person> = {
  ceo: {
    slug: "ceo",
    name: "Harsh Agarwal",
    title: "CEO @ MoneyplantFX",
    role: "CEO",
    organization: "MoneyplantFX",
    initials: "HA",
    portrait: "/img/harsh-agarwal.png",
    portraitPosition: "center",
    portraitAlt: "Portrait of Harsh Agarwal, CEO of MoneyplantFX",
    ogImage: "/harsh-og.png",
    email: "harsh@harshgroups.com",
    phone: "+971501424308",
    phoneFormatted: "+971 50 142 4308",
    telegram,
    telegramUrl: `https://t.me/${telegram}`,
    vcard: "/harsh-agarwal.vcf",
    filename: "Harsh-Agarwal-MoneyplantFX.vcf",
    mime: "text/vcard",
  },
  "head-of-marketing": {
    slug: "head-of-marketing",
    name: "Mariia Moroz",
    title: "Head of Marketing @ MoneyplantFX",
    role: "Head of Marketing",
    organization: "MoneyplantFX",
    initials: "MM",
    portrait: "/img/mariia-moroz.jpg",
    portraitPosition: "50% 25%",
    portraitAlt: "Portrait of Mariia Moroz, Head of Marketing of MoneyplantFX",
    ogImage: "/maria-og.png",
    phone: "+971503794342",
    phoneFormatted: "+971 50 379 4342",
    telegram,
    telegramUrl: `https://t.me/${telegram}`,
    vcard: "/mariia-moroz.vcf",
    filename: "Mariia-Moroz-MoneyplantFX.vcf",
    mime: "text/vcard",
  },
};

// Friendly alias for marketing role
profiles["marketing"] = profiles["head-of-marketing"];

export const defaultProfile = profiles.ceo;

export const card = {
  site: {
    // Canonical/OG base URL comes from deployment config, never hard-coded.
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://moneyplantfx.com"),
    title: "MoneyplantFX | Digital Executive Card",
    description:
      "MoneyplantFX Digital Executive Card — CMA Category 1 & Category 5 compliant institutional trading platform. Trade with zero brokerage, download the platform, access client portal and instant demo account.",
    ogImage: "/moneyplantfx-og.png",
    ogImageAlt: "MoneyplantFX — CMA 1 & 5 Compliant Zero Brokerage Trading Platform",
    appName: "MoneyplantFX Digital Card",
    shortName: "MoneyplantFX",
    manifestDescription: "MoneyplantFX Digital Executive Card — CMA 1 & CMA 5 Compliant",
  },

  icons: {
    favicon: "/MoneyplantFX/favicon.ico",
    favicon16: "/MoneyplantFX/favicon-16x16.png",
    favicon32: "/MoneyplantFX/favicon-32x32.png",
    appleTouch: "/MoneyplantFX/apple-touch-icon.png",
    android192: "/MoneyplantFX/android-chrome-192x192.png",
    android512: "/MoneyplantFX/android-chrome-512x512.png",
  },

  person: defaultProfile,
  profiles,

  brand: {
    name: "MoneyplantFX",
    tagline: "Zero Brokerage Trading Platform",
    compliancePill: "CMA 1 & CMA 5 COMPLIANT",
    websiteUrl: "https://moneyplantfx.com/",
    logo: "/MoneyplantFX/android-chrome-192x192.png",
    logoAlt: "MoneyplantFX",
    statusLabel: "MPFX NODES ACTIVE",
    appBarTitle: "Digital Card",
    notificationsLabel: "Notifications (coming soon)",
  },

  compliance: {
    badge: "CMA CAT 1 & 5",
    title: "Regulatory Compliance",
    heading: "CMA Category 1 & Category 5 Compliant",
    summary: "MoneyplantFX is CMA Category 1 and CMA Category 5 Compliant.",
    categories: [
      {
        name: "CMA Category 1 Compliant",
        subtitle: "Full Brokerage Authorization",
        description:
          "A firm authorized with a full brokerage license. This allows the entity to execute trades directly and securely hold client funds.",
      },
      {
        name: "CMA Category 5 Compliant",
        subtitle: "Marketing & Financial Introduction Authorization",
        description:
          "A firm that only holds a legal marketing and introduction authorization. They can provide financial advice and arrange deals, but they are restricted from directly holding customer funds or processing trades.",
      },
    ],
  },

  intro: {
    brand: "MONEYPLANT FX",
    tagline: "ZERO BROKERAGE TRADING",
    access: "INSTITUTIONAL ACCESS",
    motto: "PRECISION. LIQUIDITY. EXECUTION.",
    steps: ["INITIALIZING", "LOADING CARD", "READY"],
    skipLabel: "Skip intro",
  },

  telegramCard: {
    heading: "Telegram",
    openCta: "Open Telegram",
    copyLabel: "Copy Telegram handle",
    toastLabel: "Telegram handle",
  },

  apps: {
    heading: "Trading App",
    version: "v4.2 PRO",
    subtitle: "Download the trading platform",
    ios: {
      store: "App Store",
      badgeTop: "Download on the",
      url: "https://moneyplantfx.com/",
      qrLabel: "QR code for MoneyplantFX",
    },
    android: {
      store: "Google Play",
      badgeTop: "Get it on",
      url: "https://moneyplantfx.com/",
      qrLabel: "QR code for MoneyplantFX",
    },
  },

  crm: {
    portal: {
      title: "Client Portal",
      copy: "Manage your trading account, multi-currency wallets, and instant withdrawals.",
      cta: "Open Portal",
      url: "https://wallet.fxcapital24.com",
      qrLabel: "QR code for opening the MoneyplantFX Client Portal",
      demoCredentials: {
        tag: "DEMO ACCESS",
        email: {
          label: "Email",
          value: "demouser@gmail.com",
          copyLabel: "Copy client portal email",
        },
        password: {
          label: "Password",
          value: "Demouser@123",
          copyLabel: "Copy client portal password",
        },
      },
    },
    admin: {
      title: "Admin Dashboard",
      // PRD copy — kept verbatim ("route routing" flagged for stakeholder review).
      copy: "Brokerage liquidity route routing, compliance, and user telemetry console.",
      cta: "Open Dashboard",
      badge: "RESTRICTED",
      url: "https://admin.fxcapital24.com",
      qrLabel: "QR code for opening the MoneyplantFX Admin Dashboard login",
      demoCredentials: {
        tag: "DEMO ACCESS",
        email: {
          label: "User / Email",
          value: "GlobalApexAdmin",
          copyLabel: "Copy admin dashboard user",
        },
        password: {
          label: "Password",
          value: "GlobalApex@123",
          copyLabel: "Copy admin dashboard password",
        },
      },
    },
  },

  demo: {
    heading: "Demo Sandbox",
    tag: "LIVE INSTANT ACCESS",
    accountId: "77777",
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Test@12345",
    passwordUnavailable: "Request from Executive",
    server: "MoneyplantFX-Demo01",
    labels: {
      accountId: "Account ID",
      password: "Password",
      server: "Server",
    },
    copyLabels: {
      accountId: "Copy account ID",
      password: "Copy password",
      server: "Copy server",
    },
    copyAllCta: "Copy credentials",
    toastLabel: "Credentials",
  },

  contact: {
    cta: "Save Contact",
    vcard: defaultProfile.vcard,
    filename: defaultProfile.filename,
    mime: "text/vcard",
  },

  install: {
    cta: "Install MoneyplantFX",
    iosHint: "On iPhone: tap Share, then “Add to Home Screen”.",
  },

  ui: {
    unavailable: "Coming soon",
    copied: "copied",
    copyFailed: "Couldn't copy — long-press to select",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },

  legal:
    "© MoneyplantFX • CMA Category 1 & Category 5 Compliant. Category 1: Full brokerage license to execute trades directly and hold client funds. Category 5: Legal marketing and introduction authorization to provide advice and arrange deals (restricted from holding customer funds or processing trades). High-performance liquidity & institutional trading infrastructure.",
} as const;

export type Card = typeof card;

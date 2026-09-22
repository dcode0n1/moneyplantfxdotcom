# HANDOFF — MoneyplantFX Digital Executive Hub

> Status date: 2026-09-22.
> Rebranded to MoneyplantFX with dedicated role pages for executive leadership.

---

## 1. Executive Identities & Dedicated Pages

- **Harsh Agarwal** — CEO of MoneyplantFX
  - Dedicated Route: `/ceo` (also default `/`)
  - Profile Image: MoneyplantFX Company Logo (`public/MoneyplantFX/android-chrome-512x512.png`)
  - vCard: `/harsh-agarwal.vcf` (`Harsh-Agarwal-MoneyplantFX.vcf`)
  - Title: CEO @ MoneyplantFX

- **Mariia Moroz** — Head of Marketing of MoneyplantFX
  - Dedicated Route: `/head-of-marketing` (alias `/marketing`)
  - Profile Image: Mariia Moroz portrait (`public/img/Mariia Moroz.jpg` and `public/img/mariia-moroz.jpg`)
  - vCard: `/mariia-moroz.vcf` (`Mariia-Moroz-MoneyplantFX.vcf`)
  - Title: Head of Marketing @ MoneyplantFX

No page toggler — each executive has their own dedicated URL.

---

## 2. Brand & Website QR

- **Brand Label**: MoneyplantFX
- **Website URL**: `https://moneyplantfx.com/`
- **QR Code**: Prominent scannable QR tile directing to `https://moneyplantfx.com/` with "Visit moneyplantfx.com" CTA.
- **Removed Lower Cards**: Removed AppStoreHub, CRM Portal, CRM Admin Dashboard, Demo Sandbox, and Telegram cards per stakeholder instructions. The card is ultra-clean and executive-focused.
- **Brand Assets**: Replaced all favicons and application icons with `public/MoneyplantFX/` assets.
- **OpenGraph**: Generated 1200×630 luxury OG image at `public/moneyplantfx-og.png`.
- **9xTechnology Purge**: Zero traces of 9xTechnology in app code, configs, public files, or test suites.

---

## 3. Verification

- `bun run typecheck` ✔ (0 errors)
- `node ./node_modules/vitest/vitest.mjs run` ✔ (54/54 tests passing)
- `bun run build` ✔ (Next.js 16 SSG static generation of `/`, `/ceo`, `/head-of-marketing`, `/marketing`)

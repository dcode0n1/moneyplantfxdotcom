import { expect, test } from "@playwright/test";

const WIDTHS = [360, 370, 390, 414, 430];

test("first session: intro → logo flight → card → website QR → vCard", async ({ page }) => {
  await page.goto("/");

  // Preloader appears on first session, then the curtains open.
  const preloader = page.locator(".lux-preloader");
  await expect(preloader).toBeVisible();
  await expect(page.locator(".lux-preloader.curtains-open")).toBeAttached();

  // Hero revealed and the overlay is gone.
  await expect(page.locator(".lux-hero-target.revealed").first()).toBeVisible();
  await expect(preloader).toHaveCount(0);

  // Logo landed: the permanent AppBar mark is visible again.
  await expect(page.locator("html")).not.toHaveClass(/lux-active/);
  await expect(page.locator("#header-brand-logo-mark svg")).toHaveCSS("opacity", "1");

  // Digital Card is visible with default executive (CEO).
  await expect(page.getByRole("heading", { name: "Harsh Agarwal" })).toBeVisible();
  await expect(page.getByText("CEO @ MoneyplantFX")).toBeVisible();



  // Website QR card is visible with link to moneyplantfx.com.
  const websiteLink = page.getByRole("link", { name: /Visit moneyplantfx.com/i });
  await expect(websiteLink).toBeVisible();
  await expect(websiteLink).toHaveAttribute("href", "https://moneyplantfx.com/");

  // vCard download attributes.
  const save = page.getByRole("link", { name: "Save Contact" });
  await expect(save).toHaveAttribute("download", "Harsh-Agarwal-MoneyplantFX.vcf");
  await expect(save).toHaveAttribute("href", "/harsh-agarwal.vcf");
  const vcf = await page.request.get("/harsh-agarwal.vcf");
  expect(vcf.headers()["content-type"]).toContain("text/vcard");
});

test("role slug navigation: /head-of-marketing shows Mariia Moroz", async ({ page }) => {
  await page.goto("/head-of-marketing?intro=0");
  await expect(page.getByRole("heading", { name: "Mariia Moroz" })).toBeVisible();
  await expect(page.getByText("Head of Marketing @ MoneyplantFX")).toBeVisible();

  const save = page.getByRole("link", { name: "Save Contact" });
  await expect(save).toHaveAttribute("download", "Mariia-Moroz-MoneyplantFX.vcf");
  await expect(save).toHaveAttribute("href", "/mariia-moroz.vcf");
});

test("role slug navigation: /ceo shows Harsh Agarwal with company logo", async ({ page }) => {
  await page.goto("/ceo?intro=0");
  await expect(page.getByRole("heading", { name: "Harsh Agarwal" })).toBeVisible();
  await expect(page.getByText("CEO @ MoneyplantFX")).toBeVisible();
  const img = page.locator("img[alt='Harsh Agarwal, CEO of MoneyplantFX']");
  await expect(img).toBeVisible();
});

test("intro is skipped on repeat visits in the same session", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/lux-skip/);
  await expect(page.locator(".lux-preloader")).toHaveCount(0);
});

test("?intro=1 forces the intro", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
  await page.goto("/?intro=1");
  await expect(page.locator(".lux-preloader")).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("skips the cinematic intro and reveals immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".lux-preloader")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Harsh Agarwal" })).toBeVisible();
  });
});

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { card, profiles } from "@/app/_config/card";
import { copyText } from "@/app/_lib/clipboard";
import { formatCredentials } from "@/app/_lib/credentials";
import { resolvePublicUrl } from "@/app/_lib/url";
import { buildVCard } from "@/app/_lib/vcard";
import { colors } from "@/app/_theme/tokens";

describe("resolvePublicUrl", () => {
  it("accepts public https URLs", () => {
    expect(resolvePublicUrl("https://t.me/ada2en0007")).toBe("https://t.me/ada2en0007");
  });

  it.each(["", "not a url", "http://example.com", "javascript:alert(1)", "https://user:pw@example.com"])(
    "rejects %j",
    (url) => expect(resolvePublicUrl(url)).toBeNull(),
  );

  it.each(["token", "access_token", "jwt", "session", "Token"])("rejects URLs carrying ?%s=", (key) => {
    expect(resolvePublicUrl(`https://admin.example.com/login?${key}=abc`)).toBeNull();
    expect(resolvePublicUrl(`https://admin.example.com/login#${key}=abc`)).toBeNull();
  });
});

describe("copyText", () => {
  it("uses the Clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await expect(copyText("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to a hidden textarea + execCommand", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;
    await expect(copyText("fallback")).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("reports failure when both paths fail", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    document.execCommand = vi.fn().mockReturnValue(false);
    await expect(copyText("x")).resolves.toBe(false);
  });
});

describe("formatCredentials", () => {
  it("formats the full payload", () => {
    expect(formatCredentials({ accountId: "21777", password: "secret", server: "MoneyplantFX-Demo01" })).toBe(
      "Account: 21777\nPassword: secret\nServer: MoneyplantFX-Demo01",
    );
  });

  it("omits the password when unavailable", () => {
    expect(formatCredentials({ accountId: "21777", password: "", server: "S" })).toBe(
      "Account: 21777\nServer: S",
    );
  });
});

describe("vCard", () => {
  it("public/harsh-agarwal.vcf matches the CEO card config", () => {
    const file = readFileSync("public/harsh-agarwal.vcf", "utf8");
    expect(file).toBe(buildVCard(profiles.ceo));
  });

  it("public/mariia-moroz.vcf matches the Head of Marketing card config", () => {
    const file = readFileSync("public/mariia-moroz.vcf", "utf8");
    expect(file).toBe(buildVCard(profiles["head-of-marketing"]));
  });

  it("contains verified contact details for CEO and Head of Marketing", () => {
    const ceoVcf = buildVCard(profiles.ceo);
    expect(ceoVcf).toContain("FN:Harsh Agarwal");
    expect(ceoVcf).toContain("EMAIL;TYPE=INTERNET,PREF:harsh@harshgroups.com");
    expect(ceoVcf).toContain("TEL;TYPE=CELL,PREF:+971501424308");

    const marketingVcf = buildVCard(profiles["head-of-marketing"]);
    expect(marketingVcf).toContain("FN:Mariia Moroz");
    expect(marketingVcf).toContain("TEL;TYPE=CELL,PREF:+971503794342");
    expect(marketingVcf).not.toMatch(/^EMAIL/m);
  });
});

describe("design tokens", () => {
  it("globals.css @theme mirrors tokens.ts", () => {
    const css = readFileSync("app/globals.css", "utf8");
    for (const [name, value] of Object.entries(colors)) {
      expect(css).toContain(`--color-${name}: ${value};`);
    }
  });
});

describe("card config", () => {
  it("has no fake or authenticated destinations", () => {
    const urls: string[] = [card.apps.ios.url, card.apps.android.url, card.crm.portal.url, card.crm.admin.url];
    for (const url of urls) {
      expect(url === "" || resolvePublicUrl(url) !== null).toBe(true);
      expect(url).not.toBe("#");
    }
  });

  it("redirects trading app QR to moneyplantfx.com", () => {
    expect(card.apps.ios.url).toBe("https://moneyplantfx.com/");
    expect(card.apps.android.url).toBe("https://moneyplantfx.com/");
  });
});

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CredentialField } from "@/app/_components/CredentialField";
import { CrmCard } from "@/app/_components/CrmCard";
import { QrTile } from "@/app/_components/QrTile";
import { SaveContactButton } from "@/app/_components/SaveContactButton";
import { TOAST_DURATION_MS, ToastProvider, useToast } from "@/app/_components/Toast";
import { WebsiteQrCard } from "@/app/_components/WebsiteQrCard";
import { card, profiles } from "@/app/_config/card";

describe("Toast", () => {
  function Trigger() {
    const show = useToast();
    return <button onClick={() => show("Hello")}>go</button>;
  }

  it("announces politely and dismisses after 2s", async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");

    act(() => screen.getByText("go").click());
    expect(region).toHaveTextContent("Hello");

    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS));
    expect(region).toBeEmptyDOMElement();
  });
});

describe("CredentialField", () => {
  const base = { id: "pw", label: "Password", copyLabel: "Copy password", copied: false, onCopy: () => {} };

  it("starts masked and toggles visibility with aria-pressed", async () => {
    render(<CredentialField {...base} value="s3cret" secret />);
    expect(screen.queryByText("s3cret")).toBeNull();
    expect(screen.getByText("•••••••••")).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: card.ui.showPassword });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(screen.getByText("s3cret")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: card.ui.hidePassword })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows the fallback and hides copy/toggle when the password is missing", () => {
    render(<CredentialField {...base} value="" secret fallback={card.demo.passwordUnavailable} />);
    expect(screen.getByText(card.demo.passwordUnavailable)).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("copies via its labelled button", async () => {
    const onCopy = vi.fn();
    render(
      <CredentialField
        {...base}
        value="21777"
        label="Account ID"
        copyLabel="Copy account ID"
        onCopy={onCopy}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Copy account ID" }));
    expect(onCopy).toHaveBeenCalled();
  });
});

describe("DemoSandbox", () => {
  async function renderSandbox(password: string) {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_DEMO_PASSWORD", password);
    const { DemoSandbox } = await import("@/app/_components/DemoSandbox");
    const Toasts = (await import("@/app/_components/Toast")).ToastProvider;
    render(
      <Toasts>
        <DemoSandbox />
      </Toasts>,
    );
  }

  it("copies the full credential payload", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    await renderSandbox("demo-pass");

    await userEvent.click(screen.getByRole("button", { name: card.demo.copyAllCta }));
    expect(writeText).toHaveBeenCalledWith(
      "Account: 77777\nPassword: demo-pass\nServer: MoneyplantFX-Demo01",
    );
    expect(screen.getByRole("status")).toHaveTextContent(`${card.demo.toastLabel} ${card.ui.copied}`);
    vi.unstubAllEnvs();
  });

  it("renders fallback without a password copy action", async () => {
    await renderSandbox("");
    expect(screen.getByText(card.demo.passwordUnavailable)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy password" })).toBeNull();
    expect(screen.getByRole("button", { name: "Copy account ID" })).toBeInTheDocument();
    vi.unstubAllEnvs();
  });
});

describe("CrmCard", () => {
  it("renders portal card with title, copy, demo credentials, and action link", () => {
    render(
      <ToastProvider>
        <CrmCard id="portal" entry={card.crm.portal} variant="primary" />
      </ToastProvider>,
    );
    expect(screen.getByRole("heading", { name: card.crm.portal.title })).toBeInTheDocument();
    expect(screen.getByText(card.crm.portal.copy)).toBeInTheDocument();
    expect(screen.getByText("demouser@gmail.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(card.crm.portal.cta) })).toHaveAttribute(
      "href",
      "https://wallet.fxcapital24.com/",
    );
  });

  it("renders admin card with restricted badge and admin credentials", () => {
    render(
      <ToastProvider>
        <CrmCard id="admin" entry={card.crm.admin} variant="secondary" />
      </ToastProvider>,
    );
    expect(screen.getByRole("heading", { name: card.crm.admin.title })).toBeInTheDocument();
    expect(screen.getByText("RESTRICTED")).toBeInTheDocument();
    expect(screen.getByText("GlobalApexAdmin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(card.crm.admin.cta) })).toHaveAttribute(
      "href",
      "https://admin.fxcapital24.com/",
    );
  });
});

describe("QrTile", () => {
  it("renders an accessible SVG QR for a valid destination", () => {
    render(<QrTile url="https://moneyplantfx.com/" label="QR code for MoneyplantFX" />);
    const qr = screen.getByRole("img", { name: "QR code for MoneyplantFX" });
    expect(qr.tagName.toLowerCase()).toBe("svg");
    expect(qr).toHaveAttribute("data-qr-value", "https://moneyplantfx.com/");
  });

  it("renders an unavailable state for a TODO URL instead of a fake QR", () => {
    const { container } = render(<QrTile url="" label="QR code for the app" />);
    expect(screen.getByRole("img", { name: /QR code for the app — Coming soon/ })).toBeInTheDocument();
    expect(container.querySelector("svg[data-qr-value]")).toBeNull();
  });

  it("refuses URLs carrying auth tokens", () => {
    const { container } = render(<QrTile url="https://admin.example.com/?token=abc" label="Admin" />);
    expect(container.querySelector("svg[data-qr-value]")).toBeNull();
  });
});

describe("WebsiteQrCard", () => {
  it("renders QR linking to moneyplantfx.com and direct action button", () => {
    render(<WebsiteQrCard />);
    expect(screen.getByRole("heading", { name: "moneyplantfx.com" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Visit moneyplantfx.com/i })).toHaveAttribute(
      "href",
      "https://moneyplantfx.com/",
    );
    const qr = screen.getByRole("img", { name: "QR code for moneyplantfx.com" });
    expect(qr).toHaveAttribute("data-qr-value", "https://moneyplantfx.com/");
  });
});

describe("SaveContactButton", () => {
  it("downloads the CEO vCard by default with expected filename and MIME", () => {
    render(<SaveContactButton />);
    const link = screen.getByRole("link", { name: card.contact.cta });
    expect(link).toHaveAttribute("href", "/harsh-agarwal.vcf");
    expect(link).toHaveAttribute("download", "Harsh-Agarwal-MoneyplantFX.vcf");
    expect(link).toHaveAttribute("type", "text/vcard");
  });

  it("downloads Mariia Moroz vCard when configured for marketing", () => {
    render(<SaveContactButton person={profiles["head-of-marketing"]} />);
    const link = screen.getByRole("link", { name: card.contact.cta });
    expect(link).toHaveAttribute("href", "/mariia-moroz.vcf");
    expect(link).toHaveAttribute("download", "Mariia-Moroz-MoneyplantFX.vcf");
    expect(link).toHaveAttribute("type", "text/vcard");
  });
});

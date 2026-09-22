import { Person } from "@/app/_config/card";
import { publicAssetOrNull } from "@/app/_lib/preload";
import { AppBar } from "@/app/_components/AppBar";
import { ComplianceCard } from "@/app/_components/ComplianceCard";
import { CorporateIdentity } from "@/app/_components/CorporateIdentity";
import { HeroReveal } from "@/app/_components/HeroReveal";
import { LegalFooter } from "@/app/_components/LegalFooter";
import { LuxuryPreloader } from "@/app/_components/LuxuryPreloader";
import { NodesStatusPill } from "@/app/_components/NodesStatusPill";
import { ProfileCard } from "@/app/_components/ProfileCard";
import { SaveContactButton } from "@/app/_components/SaveContactButton";
import { ServiceWorkerRegister } from "@/app/_components/ServiceWorkerRegister";
import { ToastProvider } from "@/app/_components/Toast";
import { WebsiteQrCard } from "@/app/_components/WebsiteQrCard";

interface CardViewProps {
  person: Person;
}

export function CardView({ person }: CardViewProps) {
  const portraitSrc = publicAssetOrNull(person.portrait);

  const sections = [
    <div key="status" className="flex justify-center">
      <NodesStatusPill />
    </div>,
    <CorporateIdentity key="identity" />,
    <ProfileCard key="profile" person={person} portraitSrc={portraitSrc} />,
    <SaveContactButton key="contact" person={person} />,
    <WebsiteQrCard key="website-qr" />,
    <ComplianceCard key="compliance" />,
    <LegalFooter key="legal" />,
  ];

  return (
    <ToastProvider>
      <div className="page-shell mx-auto w-full max-w-card">
        <AppBar />
        <main className="flex flex-col gap-4 pt-4">
          {sections.map((section, index) => (
            <HeroReveal key={section.key} index={index}>
              {section}
            </HeroReveal>
          ))}
        </main>
      </div>
      <LuxuryPreloader />
      <ServiceWorkerRegister />
    </ToastProvider>
  );
}

import { CtaBanner } from "@/components/cta-banner";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { SiteHeader } from "@/components/site-header";
import { TrustStrip } from "@/components/trust-strip";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <TrustStrip />
        <HowItWorks />
        <CtaBanner />
      </main>
    </div>
  );
}

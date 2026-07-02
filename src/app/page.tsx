import { CtaBanner } from "@/components/site/cta-banner";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorks } from "@/components/site/how-it-works";
import { SiteHeader } from "@/components/site/site-header";
import { TrustStrip } from "@/components/site/trust-strip";

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

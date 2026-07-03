import { CtaBanner } from "@/components/site/cta-banner";
import { HeroSection } from "@/components/site/hero-section";
import { HowItWorks } from "@/components/site/how-it-works";
import { TrustStrip } from "@/components/site/trust-strip";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}

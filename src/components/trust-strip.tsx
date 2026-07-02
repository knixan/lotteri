import { HeartHandshake, MapPin, Sparkles } from "lucide-react";

const points = [
  {
    icon: MapPin,
    title: "Lokal förening",
    description: "Vi verkar i Mjölby med hjärtat i bygden.",
  },
  {
    icon: Sparkles,
    title: "Överskottet stannar lokalt",
    description: "Pengarna går till träning, utrustning och cuper.",
  },
  {
    icon: HeartHandshake,
    title: "Gemenskap & utveckling",
    description: "Vi skapar trygghet, glädje och framtidstro.",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <h2 className="mb-8 text-lg font-semibold text-brand-foreground/90">
          Tack för att du stöttar Mjölby Idrottsförbund!
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="flex items-start gap-3">
              <point.icon className="mt-0.5 size-5 shrink-0 text-brand-accent" />
              <div>
                <p className="font-semibold">{point.title}</p>
                <p className="text-sm text-brand-foreground/70">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

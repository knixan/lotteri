import { Gift, HeartHandshake, ShieldCheck, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: HeartHandshake,
    title: "Stöd barn och ungdomar",
    description: "Ditt köp går direkt till våra föreningars verksamhet.",
  },
  {
    icon: Ticket,
    title: "Fina vinster varje vecka",
    description: "Chans att vinna presentkort, produkter och mycket mer.",
  },
  {
    icon: ShieldCheck,
    title: "Enkelt och tryggt",
    description: "100% digitalt lotteri – smidigt och säkert.",
  },
];

export function HeroSection() {
  return (
    <section
      id="hem"
      className="relative isolate flex min-h-180 items-center overflow-hidden bg-brand text-brand-foreground"
    >
      <Image
        src="/hero-lotteri.png"
        alt="Ungdomar från Mjölby Idrottsförbund samlade på plan"
        fill
        priority
        className="-z-20 object-cover object-[center_35%]"
      />
      {/* Scrim so headline/buttons stay legible over the photo regardless of
          how bright the underlying image is. */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand/95 via-brand/60 to-brand/10" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-brand/80 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Vinn fina priser och stöd Mjölby Idrottsförbund
          </h1>
          <p className="max-w-xl text-lg text-brand-foreground/80">
            Varje lott du köper gör skillnad för barn- och ungdomsidrotten i
            Mjölby. Tillsammans skapar vi fler glädjeämnen, gemenskap och
            möjlighet till en aktiv fritid.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
            >
              <Link href="/lotteriet">
                <Ticket className="size-4" />
                Köp lotter
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <Link href="/lotteriet">
                <Gift className="size-4" />
                Se veckans vinster
              </Link>
            </Button>
          </div>

          <dl className="grid gap-6 pt-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-2">
                <feature.icon className="size-5 text-brand-accent" />
                <dt className="font-semibold">{feature.title}</dt>
                <dd className="text-sm text-brand-foreground/70">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="absolute right-6 bottom-8 w-64 rounded-2xl bg-card p-5 text-card-foreground shadow-xl sm:right-10 sm:w-72">
        <span className="inline-flex items-center rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-accent-foreground">
          Veckans höjdvinst
        </span>
        <p className="mt-3 text-3xl font-bold">10 000 kr</p>
        <p className="text-sm text-muted-foreground">Presentkort ICA</p>
        <Button
          asChild
          className="mt-4 w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
        >
          <Link href="/lotteriet/veckans-lotteri">Köp din lott idag!</Link>
        </Button>
      </div>
    </section>
  );
}

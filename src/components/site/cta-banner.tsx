import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-brand px-8 py-10 text-brand-foreground sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-foreground/10 ring-1 ring-brand-foreground/20">
            <Shield className="size-7" />
          </span>
          <div>
            <p className="text-xl font-bold">Tillsammans gör vi skillnad!</p>
            <p className="text-brand-foreground/70">
              Köp en lott idag och var med och stötta framtidens Mjölby.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          asChild
          className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 sm:w-auto"
        >
          <Link href="/lotteriet">
            Köp lotter nu
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

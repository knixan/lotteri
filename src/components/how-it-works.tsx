import { CreditCard, Heart, Ticket, Trophy } from "lucide-react";

const steps = [
  {
    icon: Ticket,
    title: "Välj dina lotter",
    description: "Välj hur många lotter du vill köpa.",
  },
  {
    icon: CreditCard,
    title: "Betala säkert",
    description: "Betala enkelt med Swish eller kort.",
  },
  {
    icon: Trophy,
    title: "Var med och tävla",
    description: "Du är med i dragningen varje vecka.",
  },
  {
    icon: Heart,
    title: "Vi vinner tillsammans",
    description: "Överskottet går till vår verksamhet för barn och ungdomar.",
  },
];

export function HowItWorks() {
  return (
    <section id="sa-funkar-det" className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <h2 className="mb-12 text-2xl font-bold tracking-tight sm:text-3xl">
          Så funkar lotteriet
        </h2>
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-background ring-1 ring-border">
                <step.icon className="size-5 text-primary" />
              </span>
              <p className="font-semibold">
                {index + 1}. {step.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { Shield } from "lucide-react";
import Link from "next/link";

import { HeaderAuthActions } from "@/components/site/header-auth-actions";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Hem" },
  { href: "/lotteriet", label: "Lotteriet" },
  { href: "/#sa-funkar-det", label: "Så funkar det" },
  { href: "/#om-oss", label: "Om oss" },
  { href: "/#nyheter", label: "Nyheter" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-brand text-brand-foreground">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-foreground/10 ring-1 ring-brand-foreground/20">
            <Shield className="size-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold">Mjölby Idrottsförbund</span>
            <span className="text-xs text-brand-foreground/70">
              Tillsammans för framtiden
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-foreground/80 transition-colors hover:text-brand-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <HeaderAuthActions />
        </div>
      </div>
    </header>
  );
}

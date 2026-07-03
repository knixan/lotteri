import { Shield } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-muted/40 px-6 py-16">
      <Link href="/" className="mb-6 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-brand text-brand-foreground ring-1 ring-brand-foreground/20">
          <Shield className="size-6" />
        </span>
        <span className="text-lg font-bold">Mjölby Idrottsförbund</span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {children}
          <p className="text-center text-sm text-muted-foreground">
            {footer}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

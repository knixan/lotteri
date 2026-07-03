import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Skapa konto – Mjölby Idrottslotteri",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Skapa konto"
      description="Skapa ett konto för att köpa lotter och följa dina köp."
      footer={
        <>
          Har du redan ett konto?{" "}
          <Link href="/logga-in" className="font-medium text-primary underline underline-offset-4">
            Logga in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}

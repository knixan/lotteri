import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Logga in – Mjölby Idrottslotteri",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Logga in"
      description="Logga in för att se dina lotter och köpa fler."
      footer={
        <>
          Inget konto än?{" "}
          <Link href="/registrera" className="font-medium text-primary underline underline-offset-4">
            Skapa konto
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

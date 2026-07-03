"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const ready = !loading && profile !== null;
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/logga-in");
      return;
    }
    if (ready && !isAdmin) {
      router.replace("/");
    }
  }, [loading, user, ready, isAdmin, router]);

  if (!ready || !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="text-muted-foreground">Laddar…</p>
      </div>
    );
  }

  return <>{children}</>;
}

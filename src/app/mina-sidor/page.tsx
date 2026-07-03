import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { MyTickets } from "@/components/mina-sidor/my-tickets";

export const metadata: Metadata = {
  title: "Mina sidor – Mjölby Idrottslotteri",
};

export default function MinaSidorPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Mina sidor</h1>
        <p className="mt-2 text-muted-foreground">
          Här ser du dina köpta lotter.
        </p>
        <div className="mt-8">
          <MyTickets />
        </div>
      </div>
    </RequireAuth>
  );
}

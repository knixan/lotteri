import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireAdmin } from "@/components/auth/require-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDrawDate } from "@/lib/date";
import { getLotteries } from "@/lib/firestore/lotteries";

// Admin data (ticket sales, buyer info) must never be baked into a static
// build shared across all requests.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin – Mjölby Idrottslotteri",
};

export default async function AdminPage() {
  const lotteries = await getLotteries();

  return (
    <RequireAdmin>
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
            <p className="mt-2 text-muted-foreground">
              Hantera lotterier och dra vinnare.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/lotterier/ny">
              <Plus className="size-4" />
              Nytt lotteri
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {lotteries.map((lottery) => (
            <Link key={lottery.id} href={`/admin/lotterier/${lottery.id}`}>
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg">{lottery.title}</CardTitle>
                  <Badge
                    variant={
                      lottery.status === "open" ? "default" : "secondary"
                    }
                  >
                    {lottery.status === "open" ? "Öppet" : "Stängt"}
                  </Badge>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {lottery.ticketsSold} sålda lotter · Dragning{" "}
                  {formatDrawDate(lottery.drawAt)}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </RequireAdmin>
  );
}

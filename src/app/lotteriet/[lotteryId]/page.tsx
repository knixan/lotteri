import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PurchaseForm } from "@/components/lotteries/purchase-form";
import { formatDrawCountdown, formatDrawDate } from "@/lib/date";
import { getLotteryById } from "@/lib/firestore/lotteries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lotteryId: string }>;
}): Promise<Metadata> {
  const { lotteryId } = await params;
  const lottery = await getLotteryById(lotteryId);
  return { title: lottery ? `${lottery.title} – Mjölby Idrottslotteri` : "Lotteri" };
}

export default async function LotteryDetailPage({
  params,
}: {
  params: Promise<{ lotteryId: string }>;
}) {
  const { lotteryId } = await params;
  const lottery = await getLotteryById(lotteryId);

  if (!lottery) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{lottery.title}</h1>
          <p className="mt-2 text-muted-foreground">{lottery.description}</p>
        </div>
        <Badge variant={lottery.status === "open" ? "default" : "secondary"}>
          {lottery.status === "open" ? "Öppet" : "Stängt"}
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent-foreground">
            <Trophy className="size-6 text-brand-accent" />
          </span>
          <div>
            <p className="font-semibold">{lottery.prizeTitle}</p>
            <p className="text-sm text-muted-foreground">
              Värde {lottery.prizeValueSek.toLocaleString("sv-SE")} kr
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-4 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Pris per lott</p>
              <p className="font-semibold">{lottery.ticketPriceSek} kr</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sålda lotter</p>
              <p className="font-semibold">{lottery.ticketsSold}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dragning</p>
              <p className="font-semibold">{formatDrawDate(lottery.drawAt)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDrawCountdown(lottery.drawAt)}
              </p>
            </div>
          </div>

          <PurchaseForm
            lotteryId={lottery.id}
            ticketPriceSek={lottery.ticketPriceSek}
            isOpen={lottery.status === "open"}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DrawWinnerButton } from "@/components/admin/draw-winner-button";
import { LotteryForm } from "@/components/admin/lottery-form";
import { RequireAdmin } from "@/components/auth/require-admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDrawDate } from "@/lib/date";
import {
  getLotteryById,
  getTicketsForLottery,
} from "@/lib/firestore/lotteries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lotteryId: string }>;
}): Promise<Metadata> {
  const { lotteryId } = await params;
  const lottery = await getLotteryById(lotteryId);
  return { title: lottery ? `${lottery.title} – Admin` : "Admin" };
}

export default async function EditLotteryPage({
  params,
}: {
  params: Promise<{ lotteryId: string }>;
}) {
  const { lotteryId } = await params;
  const [lottery, tickets] = await Promise.all([
    getLotteryById(lotteryId),
    getTicketsForLottery(lotteryId),
  ]);

  if (!lottery) {
    notFound();
  }

  const winner = tickets.find((ticket) => ticket.isWinner);

  return (
    <RequireAdmin>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{lottery.title}</h1>
          <DrawWinnerButton
            lotteryId={lottery.id}
            disabled={lottery.status === "closed"}
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Redigera</CardTitle>
          </CardHeader>
          <CardContent>
            <LotteryForm lottery={lottery} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Sålda lotter ({tickets.length})
            </CardTitle>
            {winner && <Badge>Vinnare: lott #{winner.ticketNumber}</Badge>}
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Inga lotter sålda än.
              </p>
            ) : (
              <div className="flex flex-col">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between py-2 text-sm">
                      <span>
                        #{ticket.ticketNumber} · {ticket.buyerName} (
                        {ticket.buyerEmail})
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {formatDrawDate(ticket.purchasedAt)}
                        {ticket.isWinner && (
                          <Badge variant="secondary">Vinnare</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}

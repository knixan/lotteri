"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { getTicketsForLotteryAdmin } from "@/lib/actions/admin";
import { formatDrawDate } from "@/lib/date";
import type { Ticket } from "@/lib/types/lottery";

export function LotteryTickets({ lotteryId }: { lotteryId: string }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    async function load() {
      const idToken = await user!.getIdToken();
      const result = await getTicketsForLotteryAdmin(idToken, lotteryId);
      if (!cancelled && result.success) {
        setTickets(result.tickets);
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [user, lotteryId]);

  const winner = tickets?.find((ticket) => ticket.isWinner);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Sålda lotter {tickets ? `(${tickets.length})` : ""}
        </CardTitle>
        {winner && <Badge>Vinnare: lott #{winner.ticketNumber}</Badge>}
      </CardHeader>
      <CardContent>
        {tickets === null ? (
          <p className="text-sm text-muted-foreground">Laddar…</p>
        ) : tickets.length === 0 ? (
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
  );
}

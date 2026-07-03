"use client";

import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { formatDrawDate } from "@/lib/date";
import { db } from "@/lib/firebase/client";
import {
  lotterySchema,
  ticketSchema,
  type Lottery,
  type Ticket,
} from "@/lib/types/lottery";

export function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [lotteries, setLotteries] = useState<Record<string, Lottery>>({});

  useEffect(() => {
    if (!user) return;

    async function load() {
      const ticketsSnapshot = await getDocs(
        query(collectionGroup(db, "tickets"), where("userId", "==", user!.uid)),
      );
      const parsedTickets = ticketsSnapshot.docs
        .map((doc) => ticketSchema.safeParse({ id: doc.id, ...doc.data() }))
        .filter((result) => result.success)
        .map((result) => result.data)
        .sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt));
      setTickets(parsedTickets);

      const lotteriesSnapshot = await getDocs(collection(db, "lotteries"));
      const lotteryMap: Record<string, Lottery> = {};
      for (const doc of lotteriesSnapshot.docs) {
        const result = lotterySchema.safeParse({ id: doc.id, ...doc.data() });
        if (result.success) lotteryMap[doc.id] = result.data;
      }
      setLotteries(lotteryMap);
    }

    load();
  }, [user]);

  if (tickets === null) {
    return <p className="text-muted-foreground">Laddar dina lotter…</p>;
  }

  if (tickets.length === 0) {
    return (
      <p className="text-muted-foreground">Du har inte köpt några lotter än.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket) => {
        const lottery = lotteries[ticket.lotteryId];
        return (
          <Card key={ticket.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                {lottery?.title ?? "Lotteri"} · Lott #{ticket.ticketNumber}
              </CardTitle>
              {ticket.isWinner && <Badge>Vinnare!</Badge>}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Köpt {formatDrawDate(ticket.purchasedAt)}
              {lottery && <> · Dragning {formatDrawDate(lottery.drawAt)}</>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

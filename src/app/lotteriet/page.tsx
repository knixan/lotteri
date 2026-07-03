import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDrawDate } from "@/lib/date";
import { getLotteries } from "@/lib/firestore/lotteries";

export const metadata: Metadata = {
  title: "Lotteriet – Mjölby Idrottslotteri",
};

export default async function LotteriesPage() {
  const lotteries = await getLotteries();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Våra lotterier</h1>
        <p className="mt-2 text-muted-foreground">
          Välj ett lotteri och köp dina lotter – hela överskottet går till
          barn- och ungdomsidrotten i Mjölby.
        </p>
      </div>

      {lotteries.length === 0 ? (
        <p className="text-muted-foreground">
          Inga lotterier just nu. Kom tillbaka snart!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lotteries.map((lottery) => (
            <Card key={lottery.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{lottery.title}</CardTitle>
                  <Badge variant={lottery.status === "open" ? "default" : "secondary"}>
                    {lottery.status === "open" ? "Öppet" : "Stängt"}
                  </Badge>
                </div>
                <CardDescription>{lottery.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Vinst: </span>
                  {lottery.prizeTitle} (
                  {lottery.prizeValueSek.toLocaleString("sv-SE")} kr)
                </p>
                <p>
                  <span className="text-muted-foreground">Pris per lott: </span>
                  {lottery.ticketPriceSek} kr
                </p>
                <p>
                  <span className="text-muted-foreground">Dragning: </span>
                  {formatDrawDate(lottery.drawAt)}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/lotteriet/${lottery.id}`}>Visa lotteri</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

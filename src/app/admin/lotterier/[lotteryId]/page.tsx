import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DrawWinnerButton } from "@/components/admin/draw-winner-button";
import { LotteryForm } from "@/components/admin/lottery-form";
import { LotteryTickets } from "@/components/admin/lottery-tickets";
import { RequireAdmin } from "@/components/auth/require-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLotteryById } from "@/lib/firestore/lotteries";

// Admin data (ticket sales, buyer info) must never be baked into a static
// build shared across all requests.
export const dynamic = "force-dynamic";

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
  const lottery = await getLotteryById(lotteryId);

  if (!lottery) {
    notFound();
  }

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

        <LotteryTickets lotteryId={lottery.id} />
      </div>
    </RequireAdmin>
  );
}

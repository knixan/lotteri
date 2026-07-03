"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { drawWinner } from "@/lib/actions/admin";

export function DrawWinnerButton({
  lotteryId,
  disabled,
}: {
  lotteryId: string;
  disabled?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleDraw() {
    if (!user) return;
    if (
      !window.confirm(
        "Är du säker? Det här stänger lotteriet för köp och drar en vinnare bland sålda lotter.",
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const result = await drawWinner(idToken, lotteryId);
      if (result.success) {
        toast.success(`Vinnare dragen: lott #${result.winnerTicketNumber}!`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button
      variant="destructive"
      disabled={disabled || submitting}
      onClick={handleDraw}
    >
      {submitting ? "Drar vinnare…" : "Dra vinnare"}
    </Button>
  );
}

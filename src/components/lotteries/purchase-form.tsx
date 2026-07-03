"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { purchaseTickets } from "@/lib/actions/purchase-tickets";

export function PurchaseForm({
  lotteryId,
  ticketPriceSek,
  isOpen,
}: {
  lotteryId: string;
  ticketPriceSek: number;
  isOpen: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function handlePurchase() {
    if (!user) {
      router.push("/logga-in");
      return;
    }

    setSubmitting(true);
    try {
      // Force a refresh: the cached token from sign-up/sign-in can predate
      // updateProfile(), so it may still be missing the display name claim
      // the purchase action uses for buyerName.
      const idToken = await user.getIdToken(true);
      const result = await purchaseTickets(idToken, { lotteryId, quantity });
      if (result.success) {
        toast.success(
          `Du köpte ${quantity} ${quantity === 1 ? "lott" : "lotter"}! Lycka till.`,
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <p className="text-sm text-muted-foreground">
        Det här lotteriet är stängt för köp just nu.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Antal lotter</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(event) =>
            setQuantity(
              Math.min(20, Math.max(1, Number(event.target.value) || 1)),
            )
          }
          className="w-24"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {quantity} × {ticketPriceSek} kr ={" "}
        <span className="font-semibold text-foreground">
          {(quantity * ticketPriceSek).toLocaleString("sv-SE")} kr
        </span>
      </p>
      <Button
        size="lg"
        disabled={submitting || loading}
        onClick={handlePurchase}
        className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
      >
        {submitting ? "Köper…" : user ? "Köp lotter" : "Logga in för att köpa"}
      </Button>
    </div>
  );
}

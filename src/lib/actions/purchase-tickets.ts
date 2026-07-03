"use server";

import { revalidatePath } from "next/cache";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { purchaseTicketSchema } from "@/lib/types/lottery";

type PurchaseResult = { success: true } | { success: false; error: string };

export async function purchaseTickets(
  idToken: string,
  input: { lotteryId: string; quantity: number },
): Promise<PurchaseResult> {
  const parsed = purchaseTicketSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ogiltig beställning." };
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return {
      success: false,
      error: "Du måste vara inloggad för att köpa lotter.",
    };
  }

  const { lotteryId, quantity } = parsed.data;
  const lotteryRef = adminDb.collection("lotteries").doc(lotteryId);

  try {
    await adminDb.runTransaction(async (tx) => {
      const lotteryDoc = await tx.get(lotteryRef);
      if (!lotteryDoc.exists) {
        throw new Error("NOT_FOUND");
      }

      const lottery = lotteryDoc.data();
      if (lottery?.status !== "open") {
        throw new Error("CLOSED");
      }

      const startNumber = (lottery.ticketsSold ?? 0) + 1;
      const purchasedAt = new Date().toISOString();

      for (let i = 0; i < quantity; i++) {
        const ticketRef = lotteryRef.collection("tickets").doc();
        tx.set(ticketRef, {
          lotteryId,
          userId: decoded.uid,
          buyerName: decoded.name ?? decoded.email ?? "Okänd",
          buyerEmail: decoded.email ?? "",
          ticketNumber: startNumber + i,
          purchasedAt,
          isWinner: false,
        });
      }

      tx.update(lotteryRef, { ticketsSold: startNumber - 1 + quantity });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CLOSED") {
      return { success: false, error: "Det här lotteriet är stängt för köp." };
    }
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { success: false, error: "Lotteriet kunde inte hittas." };
    }
    return { success: false, error: "Något gick fel, försök igen." };
  }

  revalidatePath(`/lotteriet/${lotteryId}`);
  return { success: true };
}

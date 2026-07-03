"use server";

import { randomInt } from "node:crypto";

import { revalidatePath } from "next/cache";

import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getTicketsForLottery } from "@/lib/firestore/lotteries";
import {
  adminLotteryInputSchema,
  type AdminLotteryInput,
  type Ticket,
} from "@/lib/types/lottery";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdminUid(idToken: string): Promise<string> {
  const decoded = await getAdminAuth().verifyIdToken(idToken, true);
  const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();
  if (userDoc.data()?.role !== "admin") {
    throw new Error("NOT_ADMIN");
  }
  return decoded.uid;
}

// Ticket buyer names/emails are PII, so they must never be fetched in a
// Server Component (RequireAdmin only gates rendering client-side, after
// the sensitive data has already been serialized into the RSC payload).
// Routing this through the same idToken-verified pattern as the mutations
// above means the data is only ever sent to a caller already proven admin.
export async function getTicketsForLotteryAdmin(
  idToken: string,
  lotteryId: string,
): Promise<
  { success: true; tickets: Ticket[] } | { success: false; error: string }
> {
  try {
    await requireAdminUid(idToken);
  } catch {
    return {
      success: false,
      error: "Du har inte behörighet att göra det här.",
    };
  }

  const tickets = await getTicketsForLottery(lotteryId);
  return { success: true, tickets };
}

function revalidateLotteryPaths(lotteryId?: string) {
  revalidatePath("/admin");
  revalidatePath("/lotteriet");
  if (lotteryId) {
    revalidatePath(`/admin/lotterier/${lotteryId}`);
    revalidatePath(`/lotteriet/${lotteryId}`);
  }
}

export async function createLottery(
  idToken: string,
  input: AdminLotteryInput,
): Promise<ActionResult & { id?: string }> {
  const parsed = adminLotteryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga uppgifter." };
  }

  try {
    await requireAdminUid(idToken);
  } catch {
    return {
      success: false,
      error: "Du har inte behörighet att göra det här.",
    };
  }

  const ref = getAdminDb().collection("lotteries").doc();
  await ref.set({
    ...parsed.data,
    ticketsSold: 0,
    createdAt: new Date().toISOString(),
  });

  revalidateLotteryPaths();
  return { success: true, id: ref.id };
}

export async function updateLottery(
  idToken: string,
  lotteryId: string,
  input: AdminLotteryInput,
): Promise<ActionResult> {
  const parsed = adminLotteryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga uppgifter." };
  }

  try {
    await requireAdminUid(idToken);
  } catch {
    return {
      success: false,
      error: "Du har inte behörighet att göra det här.",
    };
  }

  await getAdminDb()
    .collection("lotteries")
    .doc(lotteryId)
    .update(parsed.data);

  revalidateLotteryPaths(lotteryId);
  return { success: true };
}

export async function drawWinner(
  idToken: string,
  lotteryId: string,
): Promise<ActionResult & { winnerTicketNumber?: number }> {
  try {
    await requireAdminUid(idToken);
  } catch {
    return {
      success: false,
      error: "Du har inte behörighet att göra det här.",
    };
  }

  const lotteryRef = getAdminDb().collection("lotteries").doc(lotteryId);
  const lotteryDoc = await lotteryRef.get();
  if (!lotteryDoc.exists) {
    return { success: false, error: "Lotteriet kunde inte hittas." };
  }

  // Close the lottery for purchases first so no new tickets can land while
  // we're picking a winner from the current set.
  await lotteryRef.update({ status: "closed" });

  const ticketsSnapshot = await lotteryRef.collection("tickets").get();
  if (ticketsSnapshot.empty) {
    return { success: false, error: "Inga sålda lotter att dra bland." };
  }

  // A fair draw needs a CSPRNG, not Math.random() - its PRNG state isn't
  // meant to be unpredictable, so a winner picked from it is in theory
  // predictable/manipulable.
  const winnerDoc = ticketsSnapshot.docs[randomInt(ticketsSnapshot.docs.length)];
  await winnerDoc.ref.update({ isWinner: true });

  revalidateLotteryPaths(lotteryId);
  revalidatePath("/mina-sidor");

  return { success: true, winnerTicketNumber: winnerDoc.data().ticketNumber };
}

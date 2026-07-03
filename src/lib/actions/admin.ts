"use server";

import { revalidatePath } from "next/cache";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { adminLotteryInputSchema, type AdminLotteryInput } from "@/lib/types/lottery";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdminUid(idToken: string): Promise<string> {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (userDoc.data()?.role !== "admin") {
    throw new Error("NOT_ADMIN");
  }
  return decoded.uid;
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
  input: AdminLotteryInput
): Promise<ActionResult & { id?: string }> {
  const parsed = adminLotteryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga uppgifter." };
  }

  try {
    await requireAdminUid(idToken);
  } catch {
    return { success: false, error: "Du har inte behörighet att göra det här." };
  }

  const ref = adminDb.collection("lotteries").doc();
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
  input: AdminLotteryInput
): Promise<ActionResult> {
  const parsed = adminLotteryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga uppgifter." };
  }

  try {
    await requireAdminUid(idToken);
  } catch {
    return { success: false, error: "Du har inte behörighet att göra det här." };
  }

  await adminDb.collection("lotteries").doc(lotteryId).update(parsed.data);

  revalidateLotteryPaths(lotteryId);
  return { success: true };
}

export async function drawWinner(
  idToken: string,
  lotteryId: string
): Promise<ActionResult & { winnerTicketNumber?: number }> {
  try {
    await requireAdminUid(idToken);
  } catch {
    return { success: false, error: "Du har inte behörighet att göra det här." };
  }

  const lotteryRef = adminDb.collection("lotteries").doc(lotteryId);
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

  const winnerDoc =
    ticketsSnapshot.docs[Math.floor(Math.random() * ticketsSnapshot.docs.length)];
  await winnerDoc.ref.update({ isWinner: true });

  revalidateLotteryPaths(lotteryId);
  revalidatePath("/mina-sidor");

  return { success: true, winnerTicketNumber: winnerDoc.data().ticketNumber };
}

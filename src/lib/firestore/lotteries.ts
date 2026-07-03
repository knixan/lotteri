import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import { lotterySchema, ticketSchema, type Lottery, type Ticket } from "@/lib/types/lottery";

export async function getLotteries(): Promise<Lottery[]> {
  const snapshot = await adminDb.collection("lotteries").orderBy("drawAt").get();

  return snapshot.docs
    .map((doc) => lotterySchema.safeParse({ id: doc.id, ...doc.data() }))
    .filter((result) => result.success)
    .map((result) => result.data);
}

export async function getLotteryById(id: string): Promise<Lottery | null> {
  const doc = await adminDb.collection("lotteries").doc(id).get();
  if (!doc.exists) return null;

  const result = lotterySchema.safeParse({ id: doc.id, ...doc.data() });
  return result.success ? result.data : null;
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const snapshot = await adminDb
    .collectionGroup("tickets")
    .where("userId", "==", userId)
    .get();

  return snapshot.docs
    .map((doc) => ticketSchema.safeParse({ id: doc.id, ...doc.data() }))
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt));
}

export async function getTicketsForLottery(lotteryId: string): Promise<Ticket[]> {
  const snapshot = await adminDb
    .collection("lotteries")
    .doc(lotteryId)
    .collection("tickets")
    .get();

  return snapshot.docs
    .map((doc) => ticketSchema.safeParse({ id: doc.id, ...doc.data() }))
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((a, b) => a.ticketNumber - b.ticketNumber);
}

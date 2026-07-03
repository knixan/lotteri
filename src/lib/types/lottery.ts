import { z } from "zod";

export const lotterySchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  ticketPriceSek: z.number().int().positive(),
  prizeTitle: z.string().min(1),
  prizeValueSek: z.number().int().positive(),
  status: z.enum(["open", "closed"]),
  // Stored as an ISO string (UTC) in Firestore; always render it through
  // date-fns with timeZone "Europe/Stockholm" so CET/CEST is handled.
  drawAt: z.string(),
  ticketsSold: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export type Lottery = z.infer<typeof lotterySchema>;

export const ticketSchema = z.object({
  id: z.string(),
  lotteryId: z.string(),
  userId: z.string(),
  buyerName: z.string().min(1),
  buyerEmail: z.string().email(),
  ticketNumber: z.number().int().positive(),
  purchasedAt: z.string(),
  isWinner: z.boolean(),
});

export type Ticket = z.infer<typeof ticketSchema>;

export const purchaseTicketSchema = z.object({
  lotteryId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export type PurchaseTicketInput = z.infer<typeof purchaseTicketSchema>;

export const adminLotteryInputSchema = z.object({
  title: z.string().min(1, "Ange en titel"),
  description: z.string().min(1, "Ange en beskrivning"),
  ticketPriceSek: z.number().int().positive("Måste vara ett positivt tal"),
  prizeTitle: z.string().min(1, "Ange vinsten"),
  prizeValueSek: z.number().int().positive("Måste vara ett positivt tal"),
  status: z.enum(["open", "closed"]),
  drawAt: z.string().min(1, "Ange datum för dragning"),
});

export type AdminLotteryInput = z.infer<typeof adminLotteryInputSchema>;

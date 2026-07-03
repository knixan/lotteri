import { z } from "zod";

export const userProfileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["member", "admin"]),
  createdAt: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Ange för- och efternamn"),
    email: z.string().email("Ange en giltig e-postadress"),
    password: z.string().min(8, "Minst 8 tecken"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress"),
  password: z.string().min(1, "Ange ditt lösenord"),
});

export type SignInInput = z.infer<typeof signInSchema>;

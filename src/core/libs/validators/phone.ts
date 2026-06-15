import z from "zod";

export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 10 || v.length === 11, "Telefone inválido");

export type PhoneSchema = z.infer<typeof phoneSchema>;

import z from "zod";

export const fullNameSchema = z
  .string()
  .trim()
  .min(4, "Nome deve possuir pelo menos 4 caracteres")
  .max(250, "Nome muito grande")
  .regex(/^[A-Za-zÀ-ÿ]+(?:[\s'-][A-Za-zÀ-ÿ]+)*$/, "Informe um nome válido");

export const institutionNameSchema = z
  .string()
  .trim()
  .min(4, "Nome da instituição deve possuir pelo menos 4 caracteres")
  .max(250, "Nome da instituição muito grande");

export type FullNameSchema = z.infer<typeof fullNameSchema>;

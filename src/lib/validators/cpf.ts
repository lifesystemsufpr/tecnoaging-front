import z from "zod";

export const cpfSchema = z.object({
  cpf: z
    .string({ required_error: "CPF é obrigatório." })
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 11, "CPF deve conter 11 dígitos.")
    .refine((value) => /^\d+$/.test(value), "CPF deve conter apenas números."),
});

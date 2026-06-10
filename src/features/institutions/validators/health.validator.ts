import { fullNameSchema } from "@/core/libs/validators";
import z from "zod";

export const healthUnitSchema = z.object({
  id: z.string().optional(),
  name: fullNameSchema,
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, "CEP deve conter 8 dígitos."),
  street: z.string().trim().min(1, "Rua é obrigatória."),
  number: z.string().trim().min(1, "Número é obrigatório."),
  complement: z.string().trim().optional().nullable(),
  city: z.string().trim().min(1, "Cidade é obrigatória."),
  state: z.string().trim().min(1, "UF obrigatória"),
  neighborhood: z.string().trim().min(1, "Bairro é obrigatório."),
});

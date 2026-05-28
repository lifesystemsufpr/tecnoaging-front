import z from "zod";

export const healthUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP deve conter 8 dígitos (somente números)."),
  street: z.string().min(1, "Rua é obrigatória."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "UF obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
});

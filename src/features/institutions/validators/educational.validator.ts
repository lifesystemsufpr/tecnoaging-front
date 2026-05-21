import z from "zod";

export const educationalUnitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
});

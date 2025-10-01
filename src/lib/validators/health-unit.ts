import z from "zod";

export const UF_LIST = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
] as const;

export const healthUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres."),
  zipCode: z
    .string()
    .regex(/^\d{8}$/, "CEP deve conter 8 dígitos (somente números)."),
  street: z.string().min(1, "Rua é obrigatória."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.enum(UF_LIST, { errorMap: () => ({ message: "Selecione a UF" }) }),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
});

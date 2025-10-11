// schemas/user.ts
import { ScholarShip } from "@/types/enums/scholar-ship";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { SystemRoles } from "@/types/enums/system-roles";
import { emptyToUndefined } from "@/utils/zod";
import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/;

const baseRequired = z.object({
  role: z.enum([
    SystemRoles.RESEARCHER,
    SystemRoles.PATIENT,
    SystemRoles.HEALTH_PROFESSIONAL,
  ]),
  fullName: z.string().min(1, "Informe o nome"),
  cpf: z.string().regex(cpfRegex, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gênero é obrigatório",
  }),
});

const baseCreate = baseRequired.extend({
  password: z.string().min(8, "Mínimo de 8 caracteres").optional().nullable(),
});

const baseUpdate = baseRequired.extend({
  password: emptyToUndefined(
    z.string().min(8, "Mínimo de 8 caracteres")
  ).nullable(),
});

export const researcherCreateSchema = baseCreate.extend({
  role: z.literal(SystemRoles.RESEARCHER),
  email: z.string().email("Email inválido"),
  institution: z.string().min(1, "Required"),
  fieldOfStudy: z.string().optional().nullable(),
});

export const patientCreateSchema = baseCreate.extend({
  role: z.literal(SystemRoles.PATIENT),
  birthDate: z.string().min(1, "Required"),
  weight: z.number().min(0, "Required"),
  height: z.number().min(0, "Required"),
  scholarShip: z.enum(
    Object.keys(ScholarShip) as [keyof typeof ScholarShip, ...string[]],
    { errorMap: () => ({ message: "Required" }) }
  ),

  socioEconomicLevel: z.nativeEnum(SocioEconomicLevel, {
    errorMap: () => ({ message: "Required" }),
  }),

  zipCode: z.string().min(1, "Required"),
  street: z.string().min(1, "Required"),
  number: z.string().min(1, "Required"),
  complement: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  neighborhood: z.string().min(1, "Required"),
});

export const healthProCreateSchema = baseCreate.extend({
  role: z.literal(SystemRoles.HEALTH_PROFESSIONAL),
  email: z.string().email("Email inválido"),
  specialization: z.string().min(1, "Required"),
});

export const researcherUpdateSchema = baseUpdate.extend({
  role: z.literal(SystemRoles.RESEARCHER),
  email: z.string().email("Email inválido"),
  institution: z.string().min(1, "Required"),
  fieldOfStudy: z.string().optional().nullable(),
  specialization: z.string().optional(),
});

export const patientUpdateSchema = baseUpdate.extend({
  role: z.literal(SystemRoles.PATIENT),
  birthDate: z.string().min(1, "Required"),
  weight: z.number().min(0, "Required"),
  height: z.number().min(0, "Required"),
  scholarShip: z.enum(
    Object.keys(ScholarShip) as [keyof typeof ScholarShip, ...string[]],
    { errorMap: () => ({ message: "Required" }) }
  ),

  socioEconomicLevel: z.nativeEnum(SocioEconomicLevel, {
    errorMap: () => ({ message: "Required" }),
  }),

  zipCode: z.string().min(1, "Required"),
  street: z.string().min(1, "Required"),
  number: z.string().min(1, "Required"),
  complement: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  neighborhood: z.string().min(1, "Required"),
});

export const healthProUpdateSchema = baseUpdate.extend({
  role: z.literal(SystemRoles.HEALTH_PROFESSIONAL),
  email: z.string().email("Email invalido"),
  specialization: z.string().min(1, "Required"),
});

export const userSchema = z.discriminatedUnion("role", [
  researcherCreateSchema,
  patientCreateSchema,
  healthProCreateSchema,
]);

export const userUpdateSchema = z.discriminatedUnion("role", [
  researcherUpdateSchema,
  patientUpdateSchema,
  healthProUpdateSchema,
]);

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

export type ResearcherFormData = z.infer<typeof researcherCreateSchema>;
export type PatientFormData = z.infer<typeof patientCreateSchema>;
export type HealthProFormData = z.infer<typeof healthProCreateSchema>;

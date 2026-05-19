import { ScholarShip, SocioEconomicLevel, SystemRoles } from "@/core/enums";
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
  password: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().min(8, "Mínimo de 8 caracteres").optional().nullable()
    )
    .optional()
    .nullable(),
});

const researcherCreateFlatSchema = baseCreate.extend({
  role: z.literal(SystemRoles.RESEARCHER),
  email: z.string().email("Email inválido"),
  institution: z.string().min(1, "Required"),
  fieldOfStudy: z.string().optional().nullable(),
});

export const researcherCreateSchema = z.object({
  email: z.string().email("Email inválido"),
  institutionId: z.string().min(1, "Instituicao obrigatoria"),
  fieldOfStudy: z.string().optional().nullable(),
  user: z.object({
    fullName: z.string().min(1, "Informe o nome"),
    cpf: z.string().regex(cpfRegex, "CPF inválido"),
    phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      required_error: "Gênero é obrigatório",
    }),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    active: z.boolean().optional(),
  }),
});

export const patientCreateSchema = baseCreate.extend({
  role: z.literal(SystemRoles.PATIENT),
  birthDate: z
    .string()
    .min(1, "Required")
    .refine((value) => {
      const date = new Date(value);
      const now = new Date();
      return date <= now;
    }, "Data de nascimento inválida"),
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

export const researcherUpdateSchema = z.object({
  email: z.string().email("Email inválido"),
  institutionId: z.string().min(1, "Instituicao obrigatoria"),
  fieldOfStudy: z.string().optional().nullable(),
  user: z.object({
    fullName: z.string().min(1, "Informe o nome"),
    cpf: z.string().regex(cpfRegex, "CPF inválido"),
    phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      required_error: "Gênero é obrigatório",
    }),
    password: z
      .preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().min(8, "Mínimo de 8 caracteres").optional().nullable()
      )
      .optional()
      .nullable(),
    active: z.boolean().optional(),
  }),
});

export const patientUpdateSchema = baseUpdate.extend({
  role: z.literal(SystemRoles.PATIENT),
  birthDate: z
    .string()
    .min(1, "Required")
    .refine((value) => {
      const date = new Date(value);
      const now = new Date();
      return date <= now;
    }, "Data de nascimento inválida"),
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
  researcherCreateFlatSchema,
  patientCreateSchema,
  healthProCreateSchema,
]);

export const userUpdateSchema = z.discriminatedUnion("role", [
  patientUpdateSchema,
  healthProUpdateSchema,
]);

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

export type ResearcherFormData = z.infer<typeof researcherCreateSchema>;
export type PatientFormData = z.infer<typeof patientCreateSchema>;
export type HealthProFormData = z.infer<typeof healthProCreateSchema>;

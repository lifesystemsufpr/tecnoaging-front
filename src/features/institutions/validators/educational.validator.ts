import { institutionNameSchema } from "@/core/libs/validators";
import z from "zod";

export const educationalUnitSchema = z.object({
  id: z.string().optional(),
  title: institutionNameSchema,
});

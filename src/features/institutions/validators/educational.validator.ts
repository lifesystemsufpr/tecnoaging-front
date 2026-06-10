import { fullNameSchema } from "@/core/libs/validators";
import z from "zod";

export const educationalUnitSchema = z.object({
  id: z.string().optional(),
  title: fullNameSchema,
});

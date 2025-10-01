import { z } from "zod";

export const emptyToUndefined = <S extends z.ZodTypeAny>(schema: S) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema.optional()
  );

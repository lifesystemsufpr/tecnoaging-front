import type { ApiErrorResponse } from "../types/api-error";
import type { ValidationErrorDetails } from "../types/validation-error";

export function extractFieldErrors(
  error: ApiErrorResponse<ValidationErrorDetails>
): Record<string, string> {
  const result: Record<string, string> = {};

  error.details?.fields.forEach((field) => {
    const message = Object.values(field.constraints)[0];

    result[field.field] = message;
  });

  return result;
}

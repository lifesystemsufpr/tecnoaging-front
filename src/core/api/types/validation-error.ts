import { ApiError } from "@/core/services/http.service";
import { ApiErrorResponse } from "./api-error";

export interface ValidationErrorDetails {
  fields: ValidationFieldError[];
}

export interface ValidationFieldError {
  field: string;
  constraints: Record<string, string>;
}

export type ValidationApiError = ApiError<
  ApiErrorResponse<ValidationErrorDetails>
>;

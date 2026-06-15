export interface ApiErrorResponse<TDetails = unknown> {
  statusCode: number;
  message: string[];
  error: string;
  timestamp: string;
  path: string;
  details?: TDetails;
}

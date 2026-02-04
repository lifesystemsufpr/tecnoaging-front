export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: PaginationMeta;
}

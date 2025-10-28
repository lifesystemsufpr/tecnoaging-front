interface FetchManagerByIdParams {
  access_token: string;
  id?: string;
  pageSize?: number;
  cursor?: string;
}

export async function fetchManagerById({
  access_token,
  id,
}: FetchManagerByIdParams) {}

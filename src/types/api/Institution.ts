import { Institution } from "../domain/Institution";

export interface InstitutionRequest {
  id?: string;
  access_token?: string;
  title?: string;
}

export interface InstitutionResponse {
  data: Institution[];
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

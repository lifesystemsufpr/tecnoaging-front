import { Institution } from "../domain/Institution";

export interface InstitutionRequest {
  id?: string;
  access_token?: string;
  title?: string;
}

export interface InstitutionResponse extends Institution {}

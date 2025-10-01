import { Patient } from "../domain/Patient";
import { User } from "../domain/Person";
import { PaginationMeta } from "./PaginationMeta";

export interface PatientRequest {
  user: Omit<User, "id" | "role">;
  birthday: string;
  scholarship: string;
  socio_economic_level: string;
  weight: number;
  height: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PatientResponse extends Patient {}

export interface PatientPaginatedResponse {
  data: Patient[];
  meta: PaginationMeta;
}

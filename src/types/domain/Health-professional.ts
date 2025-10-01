import { User } from "./Person";

export interface HealthProfessional extends User {
  id?: string;
  speciality: string;
  email: string;
}

export interface HealthProfessionalWithoutUser {
  id: string;
  speciality: string;
  email: string;
}

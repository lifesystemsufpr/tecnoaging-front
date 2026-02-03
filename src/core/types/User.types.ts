import { Gender, ScholarShip, SocioEconomicLevel } from "../enums";
import { Institution } from "./Institutions.types";

export interface User {
  id?: string;
  fullName: string;
  cpf: string;
  gender: Gender;
  phone?: string;
  role?: string;
  password?: string;
  active?: boolean;
  updatedAt?: string;
}

export interface Participant extends User {
  id?: string;
  birthday: string;
  scholarship: ScholarShip;
  socio_economic_level: SocioEconomicLevel;
  weight: number;
  height: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  neighborhood: string;
  updatedAt?: string;
}

export interface HealthProfessional extends User {
  id?: string;
  speciality: string;
  email: string;
}

export interface Researcher extends User {
  id?: string;
  email: string;
  institution: Institution;
  institutionId?: string;
  institutionName?: string;
  fieldOfStudy?: string;
}

export type UserList = User[];
export type ParticipantList = Participant[];
export type HealthProfessionalList = HealthProfessional[];
export type ResearcherList = Researcher[];

export interface FetchListResponse<T> {
  [page: number]: T[];
}

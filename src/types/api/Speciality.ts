import { Speciality } from "../domain/Speciality";

export type SpecialityRequest = {
  id?: string;
  access_token?: string;
  title: string;
};

export interface SpecialityResponse extends Speciality {}

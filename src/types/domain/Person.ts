import { GENDER } from "../enums/gender";

export interface User {
  id?: string;
  fullName: string;
  cpf: string;
  gender: GENDER;
  phone?: string;
  role?: string;
  password?: string;
}

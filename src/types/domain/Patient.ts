import { ScholarShip } from "../enums/scholar-ship";
import { SocioEconomicLevel } from "../enums/socio-economic-level";
import { User } from "./Person";

export interface Patient extends User {
  id: string;
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

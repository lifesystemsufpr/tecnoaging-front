import { ScholarShip, SocioEconomicLevel, UF_LIST } from "@/core/enums";
import { User } from "@/core/types";

export interface ParticipantRequest {
  birthDay: string;
  scholarship: ScholarShip;
  socio_economic_level: SocioEconomicLevel;
  weight: number;
  height: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: UF_LIST;
  user: User
}
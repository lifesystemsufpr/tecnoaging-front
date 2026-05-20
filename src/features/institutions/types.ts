export interface Institution {
  id?: string;
  title: string;
  updatedAt?: string;
}

export interface HealthUnit {
  id: string;
  name: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  neighborhood: string;
}

export interface HealthUnitRequest extends Omit<HealthUnit, "id"> {
  active?: boolean;
}

export type InstitutionList = Institution[];
export type HealthUnitList = HealthUnit[];

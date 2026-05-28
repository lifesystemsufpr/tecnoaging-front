export interface EducationUnit {
  id?: string;
  title: string;

  createdAt?: string;
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

  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthUnitRequest extends Omit<
  HealthUnit,
  "id" | "createdAt" | "updatedAt"
> {}

export interface EducationUnitRequest extends Omit<
  EducationUnit,
  "id" | "createdAt" | "updatedAt"
> {}

export type EducationUnitList = EducationUnit[];
export type HealthUnitList = HealthUnit[];

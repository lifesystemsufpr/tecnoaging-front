// patient.mocks.ts
import { Address } from "@/types/domain/Address";
import { User } from "@/types/domain/Person";
import { ScholarShip } from "@/types/enums/scholar-ship";
import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";
import { Patient } from "@/types/domain/Patient";

export type PatientFields = Pick<
  Patient,
  | "birthDate"
  | "scholarShip"
  | "socioeEconomicLevel"
  | "weight"
  | "height"
  | "address"
>;

/** -----------------------------
 * USERS MOCK (12 itens)
 * ----------------------------- */
export const USERS_MOCK: User[] = [
  { id: "u1", fullName: "Ana Souza", cpf: "842.931.264-14" },
  { id: "u2", fullName: "Bruno Lima", cpf: "786.451.394-80" },
  { id: "u3", fullName: "Carla Mendes", cpf: "483.276.117-04" },
  { id: "u4", fullName: "Diego Alves", cpf: "314.070.921-89" },
  { id: "u5", fullName: "Ellen Martins", cpf: "391.615.486-93" },
  { id: "u6", fullName: "Fábio Pereira", cpf: "503.898.809-14" },
  { id: "u7", fullName: "Giulia Ramos", cpf: "865.266.090-58" },
  { id: "u8", fullName: "Henrique Vieira", cpf: "928.847.173-15" },
  { id: "u9", fullName: "Isabela Castro", cpf: "353.167.871-02" },
  { id: "u10", fullName: "João Silva", cpf: "426.024.616-01" },
  { id: "u11", fullName: "Karen Oliveira", cpf: "349.568.203-13" },
  { id: "u12", fullName: "Lucas Barbosa", cpf: "776.830.976-67" },
];

/** -----------------------------
 * CAMPOS DE PACIENTE MOCK (12 itens)
 * ----------------------------- */
export const PATIENT_FIELDS_MOCK: PatientFields[] = [
  {
    birthDate: "1993-07-14",
    scholarShip: ScholarShip.HIGH_SCHOOL_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.C,
    weight: 72.4,
    height: 1.75,
    address: {
      number: 120,
      street: "Rua das Acácias",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-120",
      country: "Brasil",
      complement: "Apto 51",
    } as Address,
  },
  {
    birthDate: "1988-02-03",
    scholarShip: ScholarShip.HIGHER_EDUCATION_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.B,
    weight: 64.2,
    height: 1.68,
    address: {
      number: 45,
      street: "Av. Atlântica",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22070-001",
      country: "Brasil",
      complement: "Bloco 2",
    } as Address,
  },
  {
    birthDate: "1979-11-22",
    scholarShip: ScholarShip.FUNDAMENTAL_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.D,
    weight: 80.5,
    height: 1.72,
    address: {
      number: 940,
      street: "Rua da Bahia",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30160-011",
      country: "Brasil",
    } as Address,
  },
  {
    birthDate: "1999-05-09",
    scholarShip: ScholarShip.HIGH_SCHOOL_INCOMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.C,
    weight: 58.9,
    height: 1.61,
    address: {
      number: 318,
      street: "Rua XV de Novembro",
      city: "Curitiba",
      state: "PR",
      zipCode: "80020-310",
      country: "Brasil",
      complement: "Fundos",
    } as Address,
  },
  {
    birthDate: "1991-10-30",
    scholarShip: ScholarShip.POSTGRADUATE,
    socioeEconomicLevel: SocioEconomicLevel.A,
    weight: 69.1,
    height: 1.78,
    address: {
      number: 77,
      street: "Av. Borges de Medeiros",
      city: "Porto Alegre",
      state: "RS",
      zipCode: "90020-021",
      country: "Brasil",
    } as Address,
  },
  {
    birthDate: "2001-03-18",
    scholarShip: ScholarShip.FUNDAMENTAL_INCOMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.E,
    weight: 55.3,
    height: 1.59,
    address: {
      number: 200,
      street: "Av. Sete de Setembro",
      city: "Salvador",
      state: "BA",
      zipCode: "40060-001",
      country: "Brasil",
      complement: "Casa 02",
    } as Address,
  },
  {
    birthDate: "1985-08-11",
    scholarShip: ScholarShip.HIGHER_EDUCATION_INCOMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.B,
    weight: 83.7,
    height: 1.82,
    address: {
      number: 1560,
      street: "Av. Boa Viagem",
      city: "Recife",
      state: "PE",
      zipCode: "51021-000",
      country: "Brasil",
      complement: "Cobertura",
    } as Address,
  },
  {
    birthDate: "1996-12-27",
    scholarShip: ScholarShip.MASTERS,
    socioeEconomicLevel: SocioEconomicLevel.A,
    weight: 61.0,
    height: 1.66,
    address: {
      number: 310,
      street: "Av. Beira Mar",
      city: "Fortaleza",
      state: "CE",
      zipCode: "60165-121",
      country: "Brasil",
    } as Address,
  },
  {
    birthDate: "1975-04-05",
    scholarShip: ScholarShip.DOCTORATE,
    socioeEconomicLevel: SocioEconomicLevel.A,
    weight: 78.2,
    height: 1.74,
    address: {
      number: 12,
      street: "Esplanada dos Ministérios",
      city: "Brasília",
      state: "DF",
      zipCode: "70050-000",
      country: "Brasil",
      complement: "Anexo B",
    } as Address,
  },
  {
    birthDate: "1994-09-01",
    scholarShip: ScholarShip.HIGH_SCHOOL_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.C,
    weight: 67.8,
    height: 1.7,
    address: {
      number: 800,
      street: "Av. Djalma Batista",
      city: "Manaus",
      state: "AM",
      zipCode: "69050-010",
      country: "Brasil",
    } as Address,
  },
  {
    birthDate: "1982-06-23",
    scholarShip: ScholarShip.FUNDAMENTAL_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.D,
    weight: 74.0,
    height: 1.69,
    address: {
      number: 55,
      street: "Av. Nazaré",
      city: "Belém",
      state: "PA",
      zipCode: "66035-170",
      country: "Brasil",
      complement: "Sala 101",
    } as Address,
  },
  {
    birthDate: "2000-01-15",
    scholarShip: ScholarShip.HIGHER_EDUCATION_COMPLETE,
    socioeEconomicLevel: SocioEconomicLevel.B,
    weight: 62.6,
    height: 1.64,
    address: {
      number: 410,
      street: "Av. Beira-Mar Norte",
      city: "Florianópolis",
      state: "SC",
      zipCode: "88015-700",
      country: "Brasil",
    } as Address,
  },
];

/** -----------------------------
 * FACTORIES
 * ----------------------------- */
export function buildPatientWithId<T extends User>(
  user: T,
  fields: PatientFields
): Patient & T {
  return {
    ...user,
    ...fields,
  } as Patient & T;
}

export function buildPatientsWithIds<T extends User>(
  users: T[],
  fieldsList: PatientFields[] = PATIENT_FIELDS_MOCK
): (Patient & T)[] {
  return users.map((u, idx) =>
    buildPatientWithId(u, fieldsList[idx % fieldsList.length])
  );
}

/** -----------------------------
 * LISTA PRONTA: Patients com ID
 * ----------------------------- */
export const PATIENTS_WITH_ID_MOCK: (Patient & User)[] =
  buildPatientsWithIds(USERS_MOCK);

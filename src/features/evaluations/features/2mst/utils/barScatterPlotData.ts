import { Gender } from "@/core/enums";

export type AgeGroup =
  | "60-64"
  | "65-69"
  | "70-74"
  | "75-79"
  | "80-84"
  | "85-89"
  | "≥90";

export const AGE_GROUPS: AgeGroup[] = [
  "60-64",
  "65-69",
  "70-74",
  "75-79",
  "80-84",
  "85-89",
  "≥90",
];

export interface PercentileEntry {
  percentile: number;
  values: Partial<Record<AgeGroup, number>>;
}

// Tabela de percentis — Feminino (2-Minute Step Test - número de passos)
const FEMALE_PERCENTILES: PercentileEntry[] = [
  {
    percentile: 95,
    values: { "70-74": 106, "75-79": 103, "80-84": 95, "85-89": 67, "≥90": 58 },
  },
  {
    percentile: 90,
    values: { "70-74": 101, "75-79": 99, "80-84": 89, "85-89": 63, "≥90": 56 },
  },
  {
    percentile: 85,
    values: { "70-74": 97, "75-79": 96, "80-84": 84, "85-89": 61, "≥90": 54 },
  },
  {
    percentile: 80,
    values: { "70-74": 94, "75-79": 92, "80-84": 80, "85-89": 60, "≥90": 52 },
  },
  {
    percentile: 75,
    values: { "70-74": 91, "75-79": 89, "80-84": 76, "85-89": 58, "≥90": 49 },
  },
  {
    percentile: 70,
    values: { "70-74": 88, "75-79": 86, "80-84": 72, "85-89": 56, "≥90": 47 },
  },
  {
    percentile: 65,
    values: { "70-74": 84, "75-79": 82, "80-84": 68, "85-89": 55, "≥90": 46 },
  },
  {
    percentile: 60,
    values: { "70-74": 81, "75-79": 79, "80-84": 65, "85-89": 54, "≥90": 44 },
  },
  {
    percentile: 55,
    values: { "70-74": 77, "75-79": 74, "80-84": 63, "85-89": 51, "≥90": 43 },
  },
  {
    percentile: 50,
    values: { "70-74": 73, "75-79": 71, "80-84": 61, "85-89": 50, "≥90": 42 },
  },
  {
    percentile: 45,
    values: { "70-74": 70, "75-79": 68, "80-84": 60, "85-89": 48, "≥90": 40 },
  },
  {
    percentile: 40,
    values: { "70-74": 67, "75-79": 65, "80-84": 59, "85-89": 47, "≥90": 39 },
  },
  {
    percentile: 35,
    values: { "70-74": 64, "75-79": 62, "80-84": 57, "85-89": 45, "≥90": 38 },
  },
  {
    percentile: 30,
    values: { "70-74": 62, "75-79": 61, "80-84": 56, "85-89": 44, "≥90": 35 },
  },
  {
    percentile: 25,
    values: { "70-74": 61, "75-79": 60, "80-84": 54, "85-89": 43, "≥90": 33 },
  },
  {
    percentile: 20,
    values: { "70-74": 60, "75-79": 59, "80-84": 52, "85-89": 41, "≥90": 33 },
  },
  {
    percentile: 15,
    values: { "70-74": 59, "75-79": 58, "80-84": 50, "85-89": 40, "≥90": 32 },
  },
  {
    percentile: 10,
    values: { "70-74": 58, "75-79": 56, "80-84": 46, "85-89": 38, "≥90": 31 },
  },
  {
    percentile: 5,
    values: { "70-74": 55, "75-79": 51, "80-84": 43, "85-89": 37, "≥90": 31 },
  },
];

// Tabela de percentis — Masculino (Chair Sit and Reach Test)
const MALE_PERCENTILES: PercentileEntry[] = [
  {
    percentile: 95,
    values: {
      "70-74": 124,
      "75-79": 112,
      "80-84": 100,
      "85-89": 86,
      "≥90": 76,
    },
  },
  {
    percentile: 90,
    values: { "70-74": 121, "75-79": 107, "80-84": 96, "85-89": 84, "≥90": 71 },
  },
  {
    percentile: 85,
    values: { "70-74": 119, "75-79": 102, "80-84": 92, "85-89": 80, "≥90": 67 },
  },
  {
    percentile: 80,
    values: { "70-74": 116, "75-79": 98, "80-84": 88, "85-89": 78, "≥90": 66 },
  },
  {
    percentile: 75,
    values: { "70-74": 111, "75-79": 94, "80-84": 85, "85-89": 74, "≥90": 64 },
  },
  {
    percentile: 70,
    values: { "70-74": 106, "75-79": 91, "80-84": 82, "85-89": 70, "≥90": 61 },
  },
  {
    percentile: 65,
    values: { "70-74": 101, "75-79": 88, "80-84": 79, "85-89": 66, "≥90": 60 },
  },
  {
    percentile: 60,
    values: { "70-74": 97, "75-79": 84, "80-84": 74, "85-89": 64, "≥90": 59 },
  },
  {
    percentile: 55,
    values: { "70-74": 94, "75-79": 81, "80-84": 70, "85-89": 61, "≥90": 56 },
  },
  {
    percentile: 50,
    values: { "70-74": 91, "75-79": 78, "80-84": 67, "85-89": 60, "≥90": 54 },
  },
  {
    percentile: 45,
    values: { "70-74": 87, "75-79": 73, "80-84": 64, "85-89": 58, "≥90": 52 },
  },
  {
    percentile: 40,
    values: { "70-74": 84, "75-79": 70, "80-84": 62, "85-89": 56, "≥90": 50 },
  },
  {
    percentile: 35,
    values: { "70-74": 80, "75-79": 68, "80-84": 61, "85-89": 55, "≥90": 48 },
  },
  {
    percentile: 30,
    values: { "70-74": 77, "75-79": 65, "80-84": 60, "85-89": 53, "≥90": 46 },
  },
  {
    percentile: 25,
    values: { "70-74": 73, "75-79": 63, "80-84": 58, "85-89": 51, "≥90": 45 },
  },
  {
    percentile: 20,
    values: { "70-74": 70, "75-79": 62, "80-84": 56, "85-89": 50, "≥90": 43 },
  },
  {
    percentile: 15,
    values: { "70-74": 68, "75-79": 60, "80-84": 55, "85-89": 48, "≥90": 42 },
  },
  {
    percentile: 10,
    values: { "70-74": 65, "75-79": 60, "80-84": 53, "85-89": 46, "≥90": 41 },
  },
  {
    percentile: 5,
    values: { "70-74": 59, "75-79": 56, "80-84": 47, "85-89": 44, "≥90": 39 },
  },
];

/**
 * Retorna a tabela de percentis conforme o sexo.
 */
export function getPercentilesForGender(gender: Gender): PercentileEntry[] {
  return gender === Gender.MALE ? MALE_PERCENTILES : FEMALE_PERCENTILES;
}

/**
 * Retorna o valor do percentil para um sexo, faixa etária e percentil específicos.
 */
export function getPercentileValue(
  gender: Gender,
  ageGroup: AgeGroup,
  percentile: number
): number | undefined {
  const table = getPercentilesForGender(gender);
  const entry = table.find((e) => e.percentile === percentile);
  return entry?.values[ageGroup];
}

/**
 * Determina a faixa etária a partir da idade do paciente.
 */
export function getAgeGroup(age: number): AgeGroup | undefined {
  if (age >= 60 && age <= 64) return "60-64";
  if (age >= 65 && age <= 69) return "65-69";
  if (age >= 70 && age <= 74) return "70-74";
  if (age >= 75 && age <= 79) return "75-79";
  if (age >= 80 && age <= 84) return "80-84";
  if (age >= 85 && age <= 89) return "85-89";
  if (age >= 90) return "≥90";
  return undefined;
}

/**
 * Cores para cada faixa etária.
 */
export const AGE_GROUP_COLORS: Partial<Record<AgeGroup, string>> = {
  "70-74": "#4A6FA5",
  "75-79": "#9B72CB",
  "80-84": "#E091C9",
  "85-89": "#A8C256",
  "≥90": "#5BBCD6",
};

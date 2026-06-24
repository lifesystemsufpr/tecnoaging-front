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

// Tabela de percentis — Feminino (30-Second Chair Stand Test)
const FEMALE_PERCENTILES: PercentileEntry[] = [
  {
    percentile: 95,
    values: { "70-74": 25, "75-79": 24, "80-84": 22, "85-89": 20, "≥90": 19 },
  },
  {
    percentile: 90,
    values: { "70-74": 22, "75-79": 22, "80-84": 20, "85-89": 18, "≥90": 18 },
  },
  {
    percentile: 85,
    values: { "70-74": 21, "75-79": 20, "80-84": 19, "85-89": 18, "≥90": 16 },
  },
  {
    percentile: 80,
    values: { "70-74": 20, "75-79": 20, "80-84": 18, "85-89": 18, "≥90": 15 },
  },
  {
    percentile: 75,
    values: { "70-74": 20, "75-79": 19, "80-84": 18, "85-89": 17, "≥90": 15 },
  },
  {
    percentile: 70,
    values: { "70-74": 19, "75-79": 18, "80-84": 17, "85-89": 16, "≥90": 15 },
  },
  {
    percentile: 65,
    values: { "70-74": 18, "75-79": 18, "80-84": 17, "85-89": 15, "≥90": 14 },
  },
  {
    percentile: 60,
    values: { "70-74": 18, "75-79": 18, "80-84": 16, "85-89": 15, "≥90": 14 },
  },
  {
    percentile: 55,
    values: { "70-74": 18, "75-79": 17, "80-84": 15, "85-89": 14, "≥90": 14 },
  },
  {
    percentile: 50,
    values: { "70-74": 18, "75-79": 17, "80-84": 15, "85-89": 14, "≥90": 13 },
  },
  {
    percentile: 45,
    values: { "70-74": 17, "75-79": 16, "80-84": 15, "85-89": 14, "≥90": 12 },
  },
  {
    percentile: 40,
    values: { "70-74": 16, "75-79": 16, "80-84": 14, "85-89": 14, "≥90": 11 },
  },
  {
    percentile: 35,
    values: { "70-74": 16, "75-79": 15, "80-84": 14, "85-89": 13, "≥90": 10 },
  },
  {
    percentile: 30,
    values: { "70-74": 15, "75-79": 15, "80-84": 14, "85-89": 13, "≥90": 10 },
  },
  {
    percentile: 25,
    values: { "70-74": 15, "75-79": 14, "80-84": 13, "85-89": 12, "≥90": 9 },
  },
  {
    percentile: 20,
    values: { "70-74": 14, "75-79": 13, "80-84": 12, "85-89": 11, "≥90": 8 },
  },
  {
    percentile: 15,
    values: { "70-74": 13, "75-79": 12, "80-84": 12, "85-89": 10, "≥90": 8 },
  },
  {
    percentile: 10,
    values: { "70-74": 12, "75-79": 11, "80-84": 10, "85-89": 9, "≥90": 8 },
  },
  {
    percentile: 5,
    values: { "70-74": 10, "75-79": 10, "80-84": 9, "85-89": 8, "≥90": 6 },
  },
];

// Tabela de percentis — Masculino (30-Second Chair Stand Test)
const MALE_PERCENTILES: PercentileEntry[] = [
  {
    percentile: 95,
    values: { "70-74": 25, "75-79": 25, "80-84": 23, "85-89": 21, "≥90": 20 },
  },
  {
    percentile: 90,
    values: { "70-74": 23, "75-79": 22, "80-84": 20, "85-89": 19, "≥90": 18 },
  },
  {
    percentile: 85,
    values: { "70-74": 21, "75-79": 20, "80-84": 20, "85-89": 18, "≥90": 17 },
  },
  {
    percentile: 80,
    values: { "70-74": 20, "75-79": 20, "80-84": 19, "85-89": 18, "≥90": 16 },
  },
  {
    percentile: 75,
    values: { "70-74": 20, "75-79": 19, "80-84": 18, "85-89": 17, "≥90": 15 },
  },
  {
    percentile: 70,
    values: { "70-74": 19, "75-79": 19, "80-84": 18, "85-89": 16, "≥90": 15 },
  },
  {
    percentile: 65,
    values: { "70-74": 19, "75-79": 18, "80-84": 18, "85-89": 16, "≥90": 15 },
  },
  {
    percentile: 60,
    values: { "70-74": 18, "75-79": 18, "80-84": 17, "85-89": 16, "≥90": 14 },
  },
  {
    percentile: 55,
    values: { "70-74": 18, "75-79": 18, "80-84": 16, "85-89": 15, "≥90": 14 },
  },
  {
    percentile: 50,
    values: { "70-74": 18, "75-79": 17, "80-84": 16, "85-89": 15, "≥90": 13 },
  },
  {
    percentile: 45,
    values: { "70-74": 17, "75-79": 17, "80-84": 15, "85-89": 14, "≥90": 12 },
  },
  {
    percentile: 40,
    values: { "70-74": 17, "75-79": 16, "80-84": 15, "85-89": 14, "≥90": 12 },
  },
  {
    percentile: 35,
    values: { "70-74": 16, "75-79": 16, "80-84": 14, "85-89": 14, "≥90": 11 },
  },
  {
    percentile: 30,
    values: { "70-74": 16, "75-79": 15, "80-84": 14, "85-89": 13, "≥90": 10 },
  },
  {
    percentile: 25,
    values: { "70-74": 15, "75-79": 15, "80-84": 14, "85-89": 12, "≥90": 10 },
  },
  {
    percentile: 20,
    values: { "70-74": 15, "75-79": 14, "80-84": 13, "85-89": 12, "≥90": 9 },
  },
  {
    percentile: 15,
    values: { "70-74": 14, "75-79": 13, "80-84": 12, "85-89": 10, "≥90": 8 },
  },
  {
    percentile: 10,
    values: { "70-74": 12, "75-79": 12, "80-84": 10, "85-89": 10, "≥90": 8 },
  },
  {
    percentile: 5,
    values: { "70-74": 11, "75-79": 10, "80-84": 10, "85-89": 9, "≥90": 7 },
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
 * Cores para cada faixa etária (paleta similar à imagem de referência).
 */
export const AGE_GROUP_COLORS: Partial<Record<AgeGroup, string>> = {
  "70-74": "#4A6FA5",
  "75-79": "#9B72CB",
  "80-84": "#E091C9",
  "85-89": "#A8C256",
  "≥90": "#5BBCD6",
};

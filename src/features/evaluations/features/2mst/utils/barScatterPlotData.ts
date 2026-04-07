import { Gender } from "@/core/enums";

export type AgeGroup = "60-64" | "65-69" | "70-74" | "75-79" | "80-84" | "85-89" | "≥90";

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
  values: Record<AgeGroup, number>;
}

// Tabela de percentis — Feminino (2-Minute Step Test - número de passos)
const FEMALE_PERCENTILES: PercentileEntry[] = [
  { percentile: 95, values: { "60-64": 115, "65-69": 110, "70-74": 107, "75-79": 100, "80-84": 91, "85-89": 85, "≥90": 73 } },
  { percentile: 90, values: { "60-64": 110, "65-69": 107, "70-74": 103, "75-79": 96,  "80-84": 88, "85-89": 80, "≥90": 68 } },
  { percentile: 85, values: { "60-64": 107, "65-69": 104, "70-74": 100, "75-79": 93,  "80-84": 85, "85-89": 76, "≥90": 64 } },
  { percentile: 80, values: { "60-64": 104, "65-69": 101, "70-74": 97,  "75-79": 90,  "80-84": 82, "85-89": 73, "≥90": 61 } },
  { percentile: 75, values: { "60-64": 101, "65-69": 98,  "70-74": 94,  "75-79": 87,  "80-84": 79, "85-89": 70, "≥90": 58 } },
  { percentile: 70, values: { "60-64": 98,  "65-69": 95,  "70-74": 91,  "75-79": 84,  "80-84": 76, "85-89": 67, "≥90": 55 } },
  { percentile: 65, values: { "60-64": 96,  "65-69": 93,  "70-74": 89,  "75-79": 82,  "80-84": 74, "85-89": 65, "≥90": 53 } },
  { percentile: 60, values: { "60-64": 94,  "65-69": 91,  "70-74": 87,  "75-79": 80,  "80-84": 72, "85-89": 63, "≥90": 51 } },
  { percentile: 55, values: { "60-64": 92,  "65-69": 89,  "70-74": 85,  "75-79": 78,  "80-84": 70, "85-89": 61, "≥90": 49 } },
  { percentile: 50, values: { "60-64": 90,  "65-69": 87,  "70-74": 83,  "75-79": 76,  "80-84": 68, "85-89": 59, "≥90": 47 } },
  { percentile: 45, values: { "60-64": 88,  "65-69": 85,  "70-74": 81,  "75-79": 74,  "80-84": 66, "85-89": 57, "≥90": 45 } },
  { percentile: 40, values: { "60-64": 86,  "65-69": 83,  "70-74": 79,  "75-79": 72,  "80-84": 64, "85-89": 55, "≥90": 43 } },
  { percentile: 35, values: { "60-64": 84,  "65-69": 81,  "70-74": 77,  "75-79": 70,  "80-84": 62, "85-89": 53, "≥90": 41 } },
  { percentile: 30, values: { "60-64": 82,  "65-69": 79,  "70-74": 75,  "75-79": 68,  "80-84": 60, "85-89": 51, "≥90": 39 } },
  { percentile: 25, values: { "60-64": 80,  "65-69": 77,  "70-74": 73,  "75-79": 66,  "80-84": 58, "85-89": 49, "≥90": 37 } },
  { percentile: 20, values: { "60-64": 77,  "65-69": 74,  "70-74": 70,  "75-79": 63,  "80-84": 55, "85-89": 46, "≥90": 34 } },
  { percentile: 15, values: { "60-64": 74,  "65-69": 71,  "70-74": 67,  "75-79": 60,  "80-84": 52, "85-89": 43, "≥90": 31 } },
  { percentile: 10, values: { "60-64": 70,  "65-69": 67,  "70-74": 63,  "75-79": 56,  "80-84": 48, "85-89": 39, "≥90": 27 } },
  { percentile: 5,  values: { "60-64": 65,  "65-69": 62,  "70-74": 58,  "75-79": 51,  "80-84": 43, "85-89": 34, "≥90": 22 } },
];

// Tabela de percentis — Masculino (2-Minute Step Test - número de passos)
const MALE_PERCENTILES: PercentileEntry[] = [
  { percentile: 95, values: { "60-64": 120, "65-69": 116, "70-74": 112, "75-79": 105, "80-84": 96,  "85-89": 88, "≥90": 76 } },
  { percentile: 90, values: { "60-64": 116, "65-69": 112, "70-74": 108, "75-79": 101, "80-84": 92,  "85-89": 84, "≥90": 72 } },
  { percentile: 85, values: { "60-64": 112, "65-69": 108, "70-74": 104, "75-79": 97,  "80-84": 89,  "85-89": 80, "≥90": 68 } },
  { percentile: 80, values: { "60-64": 109, "65-69": 105, "70-74": 101, "75-79": 94,  "80-84": 86,  "85-89": 77, "≥90": 65 } },
  { percentile: 75, values: { "60-64": 107, "65-69": 103, "70-74": 99,  "75-79": 92,  "80-84": 84,  "85-89": 75, "≥90": 63 } },
  { percentile: 70, values: { "60-64": 105, "65-69": 101, "70-74": 97,  "75-79": 90,  "80-84": 82,  "85-89": 73, "≥90": 61 } },
  { percentile: 65, values: { "60-64": 103, "65-69": 99,  "70-74": 95,  "75-79": 88,  "80-84": 80,  "85-89": 71, "≥90": 59 } },
  { percentile: 60, values: { "60-64": 101, "65-69": 97,  "70-74": 93,  "75-79": 86,  "80-84": 78,  "85-89": 69, "≥90": 57 } },
  { percentile: 55, values: { "60-64": 99,  "65-69": 95,  "70-74": 91,  "75-79": 84,  "80-84": 76,  "85-89": 67, "≥90": 55 } },
  { percentile: 50, values: { "60-64": 97,  "65-69": 93,  "70-74": 89,  "75-79": 82,  "80-84": 74,  "85-89": 65, "≥90": 53 } },
  { percentile: 45, values: { "60-64": 95,  "65-69": 91,  "70-74": 87,  "75-79": 80,  "80-84": 72,  "85-89": 63, "≥90": 51 } },
  { percentile: 40, values: { "60-64": 93,  "65-69": 89,  "70-74": 85,  "75-79": 78,  "80-84": 70,  "85-89": 61, "≥90": 49 } },
  { percentile: 35, values: { "60-64": 91,  "65-69": 87,  "70-74": 83,  "75-79": 76,  "80-84": 68,  "85-89": 59, "≥90": 47 } },
  { percentile: 30, values: { "60-64": 89,  "65-69": 85,  "70-74": 81,  "75-79": 74,  "80-84": 66,  "85-89": 57, "≥90": 45 } },
  { percentile: 25, values: { "60-64": 87,  "65-69": 83,  "70-74": 79,  "75-79": 72,  "80-84": 64,  "85-89": 55, "≥90": 43 } },
  { percentile: 20, values: { "60-64": 84,  "65-69": 80,  "70-74": 76,  "75-79": 69,  "80-84": 61,  "85-89": 52, "≥90": 40 } },
  { percentile: 15, values: { "60-64": 81,  "65-69": 77,  "70-74": 73,  "75-79": 66,  "80-84": 58,  "85-89": 49, "≥90": 37 } },
  { percentile: 10, values: { "60-64": 77,  "65-69": 73,  "70-74": 69,  "75-79": 62,  "80-84": 54,  "85-89": 45, "≥90": 33 } },
  { percentile: 5,  values: { "60-64": 72,  "65-69": 68,  "70-74": 64,  "75-79": 57,  "80-84": 49,  "85-89": 40, "≥90": 28 } },
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
export const AGE_GROUP_COLORS: Record<AgeGroup, string> = {
  "60-64": "#3F51B5",
  "65-69": "#4A6FA5",
  "70-74": "#9B72CB",
  "75-79": "#E091C9",
  "80-84": "#A8C256",
  "85-89": "#5BBCD6",
  "≥90":   "#FF7043",
};

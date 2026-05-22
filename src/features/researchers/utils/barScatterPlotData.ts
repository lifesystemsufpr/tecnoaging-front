import { AgeGroup, PercentileEntry } from "../types";

/**
 * Retorna o valor do percentil para um sexo, faixa etária e percentil específicos.
 */
export function getPercentileValue(
  percentiles: PercentileEntry[],
  ageGroup: AgeGroup,
  percentile: number
): number | undefined {
  const entry = percentiles.find((e) => e.percentile === percentile);
  return entry?.values[ageGroup];
}

/**
 * Determina a faixa etária a partir da idade do paciente.
 */
export function getAgeGroup(age: number): AgeGroup | undefined {
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
export const AGE_GROUP_COLORS: Record<AgeGroup, string> = {
  "70-74": "#4A6FA5",
  "75-79": "#9B72CB",
  "80-84": "#E091C9",
  "85-89": "#A8C256",
  "≥90": "#5BBCD6",
};

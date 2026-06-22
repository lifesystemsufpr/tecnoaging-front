export const Dicionary = {
  Repetitions: "Repetições",
  Power: "Potência",
  "Total Energy": "Energia Total",
  "Total Time": "Tempo Total",
};

export function translateIndicatorName(name: string): string {
  return Dicionary[name] || name;
}

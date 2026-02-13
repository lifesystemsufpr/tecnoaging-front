export const Dicionary = {
  Repetitions: "Repetições",
  Power: "Potência",
  "Total Energy": "Energia Total",
};

export function translateIndicatorName(name: string): string {
  return Dicionary[name] || name;
}

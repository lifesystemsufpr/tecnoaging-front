export const Dictionary: Record<string, string> = {
  Steps: "Passos",
  Cadence: "Cadência",
  "Total Energy": "Energia Total",
  Power: "Potência",
};

export function translateIndicatorName(name: string): string {
  return Dictionary[name] || name;
}

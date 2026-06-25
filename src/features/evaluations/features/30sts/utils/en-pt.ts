export const Dicionary = {
  Repetitions: "Repetições",
  Power: "Potência",
  "Total Energy": "Energia Total",
  nSteps: "Número de Passos",
  strategy: "Estratégia",
  cadence: "Cadência",
  velInitial: "Velocidade Inicial",
  velFinal: "Velocidade Final",
  deltaVel: "Variação de Velocidade",
  slope: "Declive",
  velMean: "Velocidade Média",
  velStd: "Velocidade Padrão",
  cvVel: "Coeficiente de Variação da Velocidade",
  velMax: "Velocidade Máxima",
  velMin: "Velocidade Mínima",
  timeMean: "Tempo Médio",
  timeStd: "Tempo Padrão",
  cvTime: "Coeficiente de Variação do Tempo",
  timeMax: "Tempo Máximo",
  timeMin: "Tempo Mínimo",
  ascending: "Ascendente",
  descending: "Descendente",
  undefined: "Não definido",
  "Total Time": "Tempo Total",
};

export function translateIndicatorName(name: string): string {
  return Dicionary[name] || name;
}

export function translateIndicatorValue(value: string | number) {
  return Dicionary[value] || value;
}

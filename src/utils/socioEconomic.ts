import { SocioEconomicLevel } from "@/types/enums/socio-economic-level";

const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);

const ranges: Record<SocioEconomicLevel, { min?: number; max?: number }> = {
  [SocioEconomicLevel.A]: { min: 21000 },
  [SocioEconomicLevel.B]: { min: 10800, max: 20999 },
  [SocioEconomicLevel.C]: { min: 4800, max: 10799 },
  [SocioEconomicLevel.D]: { min: 2400, max: 4799 },
  [SocioEconomicLevel.E]: { max: 2399 },
};

export const socioLabel = (level: SocioEconomicLevel) => {
  const r = ranges[level];
  let faixa = "";
  if (r.min != null && r.max != null)
    faixa = `${fmtBRL(r.min)} a ${fmtBRL(r.max)}`;
  else if (r.min != null) faixa = `acima de ${fmtBRL(r.min)}`;
  else if (r.max != null) faixa = `até ${fmtBRL(r.max)}`;
  return `${level} (${faixa})`;
};

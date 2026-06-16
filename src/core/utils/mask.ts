import {
  formatCEP,
  formatCNH,
  formatCNPJ,
  formatCPF,
  formatCRLV,
  formatCurrency,
  formatEmail,
  formatName,
  formatPhone,
  formatPlate,
  formatRenavam,
  formatRNTRC,
} from "./format";

export type InputMaskType =
  | "cpf"
  | "cnpj"
  | "phone"
  | "currency"
  | "plate"
  | "renavam"
  | "rntrc"
  | "crlv"
  | "cep"
  | "cnh"
  | "email"
  | "name";

export function applyMask(value: string, mask?: InputMaskType) {
  if (!mask) return value;

  switch (mask) {
    case "cpf":
      return formatCPF(value);
    case "cnpj":
      return formatCNPJ(value);
    case "phone":
      return formatPhone(value);
    case "currency":
      return formatCurrency(value);
    case "plate":
      return formatPlate(value);
    case "renavam":
      return formatRenavam(value);
    case "rntrc":
      return formatRNTRC(value);
    case "crlv":
      return formatCRLV(value);
    case "cep":
      return formatCEP(value);
    case "cnh":
      return formatCNH(value);
    case "name":
      return formatName(value);
    case "email":
      return formatEmail(value);
    default:
      return value;
  }
}

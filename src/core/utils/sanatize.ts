// Remove all non-digit characters
export function sanatizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// Remove all non-digit characters
export function sanatizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function sanitizeNumberText(value: string): string {
  if (!value) return "";

  const normalized = value.replace(/,/g, ".").replace(/[^0-9.-]/g, "");

  if (!/[0-9]/.test(normalized)) return "";

  const isNegative = normalized.startsWith("-");
  const unsigned = normalized.replace(/-/g, "");

  const [integerPart = "", ...fractionParts] = unsigned.split(".");
  const fractionPart = fractionParts.join("");
  const hasDecimal = normalized.includes(".");

  const trimmedInteger = integerPart.replace(/^0+(?=\d)/, "");

  const signedInteger = isNegative ? `-${trimmedInteger}` : trimmedInteger;

  if (hasDecimal) {
    if (!trimmedInteger && !fractionPart) return "";
    return `${signedInteger || (isNegative ? "-" : "")}.${fractionPart}`;
  }

  return signedInteger;
}

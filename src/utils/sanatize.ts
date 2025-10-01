// Remove all non-digit characters
export function sanatizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// Remove all non-digit characters
export function sanatizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

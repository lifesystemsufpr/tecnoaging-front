export function formatCpf(value?: string): string {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export const formatDateBr = (dateStr?: string): string => {
  if (!dateStr) return "Sem informação";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
};

export function calcularIdadeAnos(
  nascimento?: string,
  dataRef?: string
): number {
  if (!nascimento || !dataRef) return 0;
  const nasc = new Date(nascimento);
  const ref = new Date(dataRef);
  let idade = ref.getFullYear() - nasc.getFullYear();
  const m = ref.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function formatPhoneBR(phone?: string | null) {
  if (!phone) return "—";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11)
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

export function genderPt(g?: string) {
  if (g === "MALE") return "Masculino";
  if (g === "FEMALE") return "Feminino";
  if (g === "OTHER") return "Outro";
  return "—";
}

import { SystemRoles } from "../enums";

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}

export function formatCpf(value?: string): string {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export const formatData = (dateStr?: string): string => {
  if (!dateStr) return "Sem informação";
  const date = new Date(dateStr);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export function calculateAge(
  bornDate?: string,
  referenceDate?: string
): number {
  if (!bornDate || !referenceDate) return 0;
  const born = new Date(bornDate);
  const ref = new Date(referenceDate);
  let idade = ref.getFullYear() - born.getFullYear();
  const m = ref.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < born.getDate())) idade--;
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

export function rolePt(r?: SystemRoles | string) {
  switch (r) {
    case SystemRoles.MANAGER:
      return "Administrador";
    case SystemRoles.HEALTH_PROFESSIONAL:
      return "Profissional de Saúde";
    case SystemRoles.PATIENT:
      return "Paciente";
    case SystemRoles.RESEARCHER:
      return "Pesquisador";
    default:
      return "—";
  }
}

export const fmtNumber = (n?: number, opts: Intl.NumberFormatOptions = {}) =>
  typeof n === "number"
    ? new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
        ...opts,
      }).format(n)
    : "—";

export const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);

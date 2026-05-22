export const formatDateBr = (dateStr?: string): string => {
  if (!dateStr) return "Sem informação";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
};

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
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

export const formatEvaluationName = (type: string) => {
  switch (type) {
    case "TTSTS":
      return "30STS";
    case "FTSTS":
      return "5TSTS";
    case "TMSTS":
      return "2MST";
    default:
      return type;
  }
};

export function formatDate(dateString: string, useUTC: boolean = false) {
  const date = new Date(dateString);

  if (useUTC) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(date);
  }

  return date.toLocaleDateString("pt-BR");
}

// MASKS

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCPF(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatCNPJ(value: string) {
  const v = onlyDigits(value).slice(0, 14);
  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function formatPhone(value: string) {
  const v = onlyDigits(value).slice(0, 11);
  return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCurrency(value: string) {
  const digits = onlyDigits(value);
  const number = (Number(digits) / 100).toFixed(2);
  return number.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatPlate(value: string) {
  const v = value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);

  if (v.length > 3) {
    return `${v.slice(0, 3)}-${v.slice(3)}`;
  }

  return v;
}

export function formatRenavam(value: string) {
  const v = onlyDigits(value).slice(0, 11);

  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{6})(\d)/, "$1.$2.$3");
}

export function formatRNTRC(value: string) {
  const v = onlyDigits(value).slice(0, 8);

  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
}

export function formatCRLV(value: string) {
  const v = onlyDigits(value).slice(0, 11);

  return v
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
}

export function formatCEP(value: string) {
  const v = onlyDigits(value).slice(0, 8);
  return v.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function formatCNH(value: string) {
  return onlyDigits(value).slice(0, 11);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(d);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}

export function durationMs(
  startIso?: string | null,
  endIso?: string | null
): number | null {
  if (!startIso || !endIso) return null;
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (isNaN(a) || isNaN(b)) return null;
  return Math.max(0, b - a);
}

export function formatDuration(ms?: number | null): string {
  if (!ms && ms !== 0) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const mmm = String(millis).padStart(3, "0");
  return `${mm}:${ss}.${mmm}`;
}

export function toISODateStart(d?: string | null): string | null {
  if (!d) return null;
  const dt = new Date(`${d}T00:00:00`);
  return dt.toISOString();
}

export function toISODateEnd(d?: string | null): string | null {
  if (!d) return null;
  const [year, month, day] = d.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return dt.toISOString();
}

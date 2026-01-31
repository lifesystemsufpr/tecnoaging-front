import { Participant } from "@/core/types";

export const formatAddressLine1 = (data?: Partial<Participant>) => {
  if (!data) return "—";
  return (
    [
      data.street || "",
      data.number ? `, ${data.number}` : "",
      data.complement ? ` — ${data.complement}` : "",
    ]
      .join("")
      .trim() || "—"
  );
};

export const formatAddressLine2 = (data?: Partial<Participant>) => {
  if (!data) return "—";
  return (
    [data.neighborhood, data.city, data.state].filter(Boolean).join(" • ") ||
    "—"
  );
};

export const formatZipCode = (zip?: string) => {
  return zip ? zip.replace(/^(\d{5})(\d{3})$/, "$1-$2") : "—";
};

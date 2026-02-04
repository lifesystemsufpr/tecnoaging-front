import { ColumnConfig } from "@/core/components/layout/GenericTable/types/GenericTable.types";
import { QuestionnaireListItem } from "../types/domain";

const formatDate = (value?: unknown) => {
  if (!value) return "-";
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime())
    ? "-"
    : parsed.toLocaleDateString("pt-BR");
};

export const questionnaireListColumns: ColumnConfig<QuestionnaireListItem>[] = [
  { key: "questionnaireTitle", header: "Questionário" },
  { key: "participantName", header: "Participante" },
  { key: "healthProfessionalName", header: "Profissional" },
  {
    key: "date",
    header: "Data",
    valueFormatter: (value) => formatDate(value),
  },
  { key: "classification", header: "Classificação" },
  { key: "totalScore", header: "Pontuação" },
];

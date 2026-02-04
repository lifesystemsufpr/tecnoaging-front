import { ColumnConfig } from "@/core/components/layout";
import { EvaluationRaw } from "../types/Evaluation.types";
import { formatDateTime, formatEvaluationName } from "@/core/utils/format";

export const participantColumns: ColumnConfig<EvaluationRaw>[] = [
  {
    key: "type",
    header: "Tipo",
    width: 110,
    render: (params) => formatEvaluationName(params.value as string),
  },
  {
    key: "profissional_nome",
    header: "Profissional",
    flex: 1.2,
    valueGetter: (row) => row.healthProfessional?.fullName ?? "",
  },
  {
    key: "unidade_nome",
    header: "Unidade",
    width: 220,
    flex: 1.1,
    valueGetter: (row) => row.healthcareUnit?.name ?? "",
  },
  {
    key: "time_init",
    header: "Inicio",
    render: (params) => formatDateTime(params.value as string),
  },
];

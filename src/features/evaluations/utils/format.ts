import { EvaluationType } from "../types/Evaluation.types";

const evaluationTypeMap: Record<EvaluationType, string> = {
  FTSTS: "5TSTS",
  TTSTS: "30STS",
  TMST: "2MST",
};

export function formatEvaluationName(type: EvaluationType) {
  return evaluationTypeMap[type] || type;
}

export const routeDetailMap = (
  type: EvaluationType | "TMSTS",
  id: string
): string => {
  switch (type) {
    case "FTSTS":
      return `/5tsts/${id}`;
    case "TTSTS":
      return `/30sts/${id}`;
    case "TMSTS":
      return `/2mst/${id}`;
    case "TMST":
      return `/2mst/${id}`;
    default:
      return "/evaluations";
  }
};

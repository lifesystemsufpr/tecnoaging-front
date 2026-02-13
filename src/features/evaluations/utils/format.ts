import { EvaluationType } from "../types/Evaluation.types";

const evaluationTypeMap: Record<EvaluationType, string> = {
  FTSTS: "5TSTS",
  TTSTS: "30STS",
};

export function formatEvaluationName(type: EvaluationType) {
  return evaluationTypeMap[type] || type;
}

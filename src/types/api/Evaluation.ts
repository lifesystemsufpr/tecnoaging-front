import { Evaluation } from "../domain/Evaluation";
import { PaginationMeta } from "./PaginationMeta";

export interface EvaluationResponse extends Evaluation {
  children?: React.ReactNode;
}

export interface ListEvaluationsResponse {
  data: EvaluationResponse[];
  meta: PaginationMeta;
}

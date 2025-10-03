import { Evaluation, EvaluationRaw } from "../domain/Evaluation";
import { PaginationMeta } from "./PaginationMeta";

export interface EvaluationResponse extends Evaluation {}

export interface ListEvaluationsResponse {
  data: EvaluationResponse[];
  meta: PaginationMeta;
}

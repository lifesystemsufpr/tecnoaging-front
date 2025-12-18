import { User } from "../domain/Person";
import { Researcher } from "../domain/Reseracher";
import { PaginationMeta } from "./PaginationMeta";

export interface ResearcherResponse extends Researcher {
  children?: React.ReactNode;
}

export interface ResearcherPaginatedResponse {
  data: Researcher[];
  meta: PaginationMeta;
}

export interface ResearcherRequest {
  user: User;
  email: string;
  institutionId: string;
  fieldOfStudy: string;
}

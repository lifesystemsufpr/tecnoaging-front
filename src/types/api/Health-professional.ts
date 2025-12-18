import {
  HealthProfessional,
  HealthProfessionalWithoutUser,
} from "../domain/Health-professional";
import { User } from "../domain/Person";
import { PaginationMeta } from "./PaginationMeta";

export interface HealthProfessionalRequest
  extends Omit<HealthProfessionalWithoutUser, "id"> {
  user: User;
}

export interface HealthProfessionalResponse extends HealthProfessional {
  children?: React.ReactNode;
}

export interface HealthProfessionalPaginatedResponse {
  data: HealthProfessional[];
  meta: PaginationMeta;
}

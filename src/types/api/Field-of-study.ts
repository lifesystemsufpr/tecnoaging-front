import { FieldOfStudy } from "../domain/Field-of-study";

export type FieldOfStudyRequest = {
  id?: string;
  access_token?: string;
  title: string;
};

export interface FieldOfStudyResponse extends FieldOfStudy {}

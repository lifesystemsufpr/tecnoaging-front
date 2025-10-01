import { Institution } from "./Institution";
import { User } from "./Person";

export interface Researcher extends User {
  id?: string;
  email: string;
  institution: Institution;
  fieldOfStudy?: string;
}

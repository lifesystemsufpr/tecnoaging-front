import { Gender } from "@/core/enums";

export interface ManagerProfile {
  id: string;
  cpf: string;
  fullName: string;
  gender: Gender;
  phone?: string | null;
  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ManagerResponse extends ManagerProfile {
  children?: React.ReactNode;
}

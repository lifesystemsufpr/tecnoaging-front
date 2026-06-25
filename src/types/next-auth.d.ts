import { SystemRoles } from "@/core/enums";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      username: string;
      cpf?: string;
      role?: SystemRoles;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    cpf?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string | null;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string | null;
    accessTokenExpires?: number;
    error?: string;
    user?: {
      id: string;
      username: string;
      cpf?: string;
      role?: string;
    };
  }
}

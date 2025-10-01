import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: DefaultSession["user"] & {
      id?: string;
      username?: string | null;
      cpf?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id?: string;
      username?: string | null;
      cpf?: string;
      role?: string;
    };
  }
}

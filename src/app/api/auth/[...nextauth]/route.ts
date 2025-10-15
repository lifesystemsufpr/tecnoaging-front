import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchLogin } from "@/services/api-auth";
import { LoginResponse, TokenPayload } from "@/types/auth.d";
import { parseJwt } from "@/lib/parseJwt";
import { userFromAuthorize, userFromClaims } from "@/lib/userAdapter";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: { label: "CPF", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null;

          const res = await fetchLogin({
            username: credentials.username,
            password: credentials.password,
          });

          if (!res.ok) {
            throw new Error("Credenciais inválidas");
          }

          const data: LoginResponse = await res.json();
          const accessToken: string = data.access_token || data.refresh_token;

          if (!accessToken) return null;

          const claims: TokenPayload = parseJwt(accessToken);

          return {
            id: claims.sub,
            username: claims.username || claims.cpf,
            cpf: claims.cpf,
            role: claims.role,
            iat: claims.iat,
            exp: claims.exp,
            accessToken,
          };
        } catch (error) {
          console.error("Erro na autorização:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const appUser = userFromAuthorize(user);
        if (appUser) token.user = appUser;
        token.accessToken = (user as any).accessToken ?? token.accessToken;
        return token;
      }

      if (!token.user && token.accessToken) {
        try {
          const claims = parseJwt(String(token.accessToken));
          const appUser = userFromClaims(claims);
          if (appUser) token.user = appUser;
        } catch {}
      }

      if (trigger === "update" && session?.user) {
        const appUser = userFromAuthorize(session.user);
        if (appUser) token.user = appUser;
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string | undefined;
      session.user = (token.user as any) ?? session.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

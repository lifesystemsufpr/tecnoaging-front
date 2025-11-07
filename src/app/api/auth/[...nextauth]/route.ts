import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchLogin } from "@/services/api-auth";
import { LoginResponse, TokenPayload } from "@/types/auth.d";
import { parseJwt } from "@/lib/parseJwt";
import { userFromAuthorize, userFromClaims } from "@/lib/userAdapter";
import { API_BASE_URL } from "@/services/Routes";

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Falha ao atualizar token");

    const data: LoginResponse = await res.json();

    const claims: TokenPayload = parseJwt(data.access_token);

    const appUser = userFromClaims(claims);

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + (claims.exp - claims.iat) * 1000,
      user: appUser ?? token.user,
    };
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: { label: "CPF", type: "text" },
        password: { label: "Senha", type: "password" },
        remember: { label: "Lembrar-me", type: "checkbox" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null;

          const res = await fetchLogin({
            username: credentials.username,
            password: credentials.password,
            remember: credentials.remember == "true",
          });

          if (!res.ok) throw new Error("Credenciais inválidas");

          const data: LoginResponse = await res.json();

          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;

          if (!accessToken) return null;

          const claims: TokenPayload = parseJwt(accessToken);
          const appUser = userFromAuthorize({
            id: claims.sub,
            username: claims.username || claims.cpf,
            cpf: claims.cpf,
            role: claims.role,
            iat: claims.iat,
            exp: claims.exp,
            accessToken,
          });

          return {
            ...appUser,
            accessToken,
            refreshToken,
            accessTokenExpires: Date.now() + (claims.exp - claims.iat) * 1000,
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
        token.user = userFromAuthorize(user);
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        return token;
      }

      if (!token.user && token.accessToken) {
        try {
          const claims = parseJwt(String(token.accessToken));
          const appUser = userFromClaims(claims);
          if (appUser) token.user = appUser;
        } catch (err) {
          console.error("Erro ao restaurar usuário:", err);
        }
      }

      if (trigger === "update" && session?.user) {
        const appUser = userFromAuthorize(session.user);
        if (appUser) token.user = appUser;
      }

      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      if (!token.refreshToken) {
        console.warn("Token expirado, mas não há refresh_token para renovar.");
        return { ...token, error: "RefreshAccessTokenError" };
      }

      console.warn("Token de acesso expirado. Refresh desabilitado.");
      return { ...token, error: "AccessTokenExpired" };

      //return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string | undefined;
      (session as any).error = token.error;
      session.user = (token.user as any) ?? session.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

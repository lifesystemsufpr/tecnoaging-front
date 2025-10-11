import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { parseJwt } from "./lib/parseJwt";

// Rotas públicas que não exigem autenticação
const PUBLIC_PATHS = ["/login", "/signup", "/unauthorized"];

// Rotas permitidas por role
const roleAccess = {
  MANAGER: [
    "/home-manager",
    "/users",
    "/users/researchers",
    "/users/health-professionals",
    "/users/patients",
    "/evaluations",
    "/institutions",
    "/specialities",
    "/study-areas",
    "/health-unit",
    "/5tsts",
    "/5tsts/*",
    "/30sts",
  ],
  RESEARCHER: [
    "/login",
    "/home-researcher",
    "/evaluations",
    "/home",
    "/5tsts",
    "/5tsts/*",
    "/30sts",
    "/population-analysis",
  ],
  HEALTH_PROFESSIONAL: [
    "/home",
    "/users",
    "/users/profile",
    "/users/patients",
    "/evaluations",
    "/5tsts",
    "/5tsts/*",
    "/30sts",
  ],
  PATIENT: ["/home", "/evaluations"],
};

function getUserFromToken(nextAuthToken) {
  if (!nextAuthToken) return null;

  if (nextAuthToken.user && typeof nextAuthToken.user === "object") {
    return nextAuthToken.user;
  }

  if (nextAuthToken.accessToken) {
    return parseJwt(String(nextAuthToken.accessToken));
  }

  return null;
}

export async function middleware(request) {
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { exp: tokenExp } = parseJwt(
    String(nextAuthToken?.accessToken) || "{}"
  );
  const isAuthenticated = Boolean(
    nextAuthToken && tokenExp * 1000 > Date.now()
  );
  const { pathname } = request.nextUrl;

  if (!isAuthenticated) {
    if (pathname != "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      return NextResponse.next();
    }
  }

  const user = getUserFromToken(nextAuthToken);
  const userRole = user?.role;

  // Redirecionamento da raiz
  if (pathname === "/") {
    if (userRole) {
      switch (userRole) {
        case "MANAGER":
          return NextResponse.redirect(
            new URL("/users/researchers", request.url)
          );
        case "RESEARCHER":
          return NextResponse.redirect(new URL("/home", request.url));
        case "HEALTH_PROFESSIONAL":
          return NextResponse.redirect(new URL("/home", request.url));
        case "PATIENT":
          return NextResponse.redirect(new URL("/home", request.url));
        default:
          break;
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Usuário autenticado acessando rota pública? PERMITIDO
  if (isAuthenticated && isPublic) {
    return NextResponse.next();
  }

  // Rota protegida e usuário não autenticado? Redireciona
  if (!isPublic && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificação de permissões
  if (userRole) {
    const allowedPaths = roleAccess[userRole] || [];

    const isAllowed =
      allowedPaths.includes("*") ||
      allowedPaths.some((allowedPath) => {
        if (allowedPath.endsWith("/*")) {
          const basePath = allowedPath.slice(0, -2);
          return pathname.startsWith(basePath);
        }
        return (
          pathname === allowedPath || pathname.startsWith(`${allowedPath}/`)
        );
      });

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|unauthorized|.*\\.(?:svg|png|jpg|jpeg|webp|ico|css|js)).*)",
  ],
};

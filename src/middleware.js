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

export async function middleware(request) {
  const token = parseJwt(
    (
      await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })
    )?.accessToken || ""
  );

  const { pathname } = request.nextUrl;

  // Redirecionamento da raiz
  if (pathname === "/") {
    if (token?.role) {
      switch (token.role) {
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

  // Usuário autenticado acessando rota pública? PERMITIDO
  if (token && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Rota protegida e usuário não autenticado? Redireciona
  const isPublic = PUBLIC_PATHS.includes(pathname);
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificação de permissões
  if (token) {
    const userRole = token?.role;
    const allowedPaths = roleAccess[userRole] || [];

    const isAllowed =
      allowedPaths.includes("*") ||
      allowedPaths.some((allowedPath) => pathname.startsWith(allowedPath));

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

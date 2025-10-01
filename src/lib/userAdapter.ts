export type Claims = {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
};

export type AppUser = {
  id: string;
  username: string;
  cpf: string;
  role: string;
};

export function userFromClaims(c: Partial<Claims>): AppUser | null {
  const id = c.sub ?? (c as any).id;
  const username = c.username ?? (c as any).name;
  const role = c.role;
  const cpf = (c as any).cpf ?? username;
  if (!id || !username || !role || !cpf) return null;
  return { id, username, role, cpf };
}

export function userFromAuthorize(u: any): AppUser | null {
  const id = u?.id ?? u?.sub ?? u?.userId;
  const username = u?.username ?? u?.name;
  const role = u?.role ?? u?.roles?.[0];
  const cpf = u?.cpf ?? username;
  if (!id || !username || !role || !cpf) return null;
  return { id, username, role, cpf };
}

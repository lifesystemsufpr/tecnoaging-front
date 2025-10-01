export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  username?: string;
  cpf?: string;
  sub?: string;
  role?: string;
  iat?: number;
  exp?: number;
  acess_token?: string;
}

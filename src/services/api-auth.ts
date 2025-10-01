import { LoginRequest } from "../types/auth.d";
import { API_ROUTES } from "./Routes";

export async function fetchLogin({
  username,
  password,
}: LoginRequest): Promise<Response> {
  return await fetch(API_ROUTES.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

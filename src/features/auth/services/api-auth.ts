import { API_ROUTES } from "@/core/config/api.routes";
import { LoginRequest } from "../../../types/auth";

export async function fetchLogin({
  username,
  password,
  remember,
}: LoginRequest): Promise<Response> {
  try {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cpf: username,
        password,
        keepMeLoggedIn: remember,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login error response:", errorText);
    }

    return response;
  } catch (error) {
    console.error("Login fetch error:", error);
    throw error;
  }
}

export async function refreshToken(refreshToken: string): Promise<Response> {
  try {
    const response = await fetch(API_ROUTES.REFRESH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Refresh token error:", errorText);
      throw new Error(errorText || "Falha ao renovar token");
    }

    return response;
  } catch (error) {
    console.error("Refresh token fetch error:", error);
    throw error;
  }
}

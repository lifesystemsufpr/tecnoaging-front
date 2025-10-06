import { LoginRequest } from "../types/auth.d";
import { API_ROUTES } from "./Routes";

export async function fetchLogin({
  username,
  password,
}: LoginRequest): Promise<Response> {
  try {
    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error response:', errorText);
    }

    return response;
  } catch (error) {
    console.error('Login fetch error:', error);
    throw error;
  }
}

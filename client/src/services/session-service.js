import { tokenKey } from "../config";
import apiFetch from "./api-fetch";

export async function login(credentials) {
  const { token, username } = await apiFetch("/users/login", {
    body: credentials,
  });
  sessionStorage.setItem(tokenKey, token);
  return username
}

export function logout() {
  sessionStorage.clear()
}

import { tokenKey } from "../config";
import apiFetch from "./api-fetch";

export async function login(credentials) {
  const response = await apiFetch("/users/login", {
    body: credentials,
  });
  if(response.errors){
    console.log("ERROR", response.errors)
    return response
  }
  sessionStorage.setItem(tokenKey, response.token);
  return response
}

export function logout() {
  sessionStorage.clear()
}

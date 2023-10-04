import apiFetch from "./api-fetch"

export async function login(credentials){
  const { token } = await apiFetch("users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
  return token
}
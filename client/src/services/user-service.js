import apiFetch from "./api-fetch"

export async function signUp(data){
  await apiFetch("/users/signup", {
    body: data,
  })
}
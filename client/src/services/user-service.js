import apiFetch from "./api-fetch"

export async function signUp(data){
  await apiFetch("/users/signup", {
    body: data,
  })
}

export async function listUsers({search=""}){
  return await apiFetch(`/users?search=${search}`)
}
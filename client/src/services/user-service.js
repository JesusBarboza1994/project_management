import { tokenKey } from "../config";
import apiFetch from "./api-fetch"

export async function signUp(data){
  const {token, username} =  await apiFetch("/users/signup", {
    body: data,
  })
  sessionStorage.setItem(tokenKey, token);
  return username
}

export async function listUsers({search="", id="none"}){
  return await apiFetch(`/users?search=${search}&id=${id}`)
}

export async function removeCollaborator({id, email}){
  let url = "/users/collaborators"
  let params = []
  if(id) params.push(`id=${id}`)
  if(email) params.push(`email=${email}`)
  
  if(params.length !== 0) url = `${url}?${params.join("&")}`
  return await apiFetch(url , {
    method: "DELETE"
  })
}
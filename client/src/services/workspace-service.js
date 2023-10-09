import apiFetch from "./api-fetch";

export async function listWorkspaces(){
  return await apiFetch("/workspaces")
}

export async function getWorkspace(id){
  return await apiFetch(`/workspaces/${id}`)
}

export async function createWorkspace(name){
  return await apiFetch("/workspaces", {
    body: {name}
  })
}

export async function deleteWorkspace(id){
  return await apiFetch(`/workspaces/${id}`, {
    method: "DELETE"
  })
}
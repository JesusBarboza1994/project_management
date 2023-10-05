import apiFetch from "./api-fetch";

export async function listWorkspaces(){
  return await apiFetch("/workspaces")
}

export async function getWorkspace(id){
  return await apiFetch(`/workspaces/${id}`)
}
import apiFetch from "./api-fetch";

export async function listProjects(workspaceId){
  return await apiFetch(`/projects/${workspaceId}`)
}

export async function createProject(body){
  const { title, workspaceId } = body
  return await apiFetch(`/projects/${workspaceId}`, {
    method: "POST",
    body: JSON.stringify({title})
  })
}
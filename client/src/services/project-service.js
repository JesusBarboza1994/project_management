import apiFetch from "./api-fetch";

export async function listProjects(workspaceId){
  return await apiFetch(`/projects/${workspaceId}`)
}
export async function createProject(body){
  const { title, workspaceId } = body
  return await apiFetch(`/projects/${workspaceId}`, {
    method: "POST",
    body: {title}
  })
}
export async function updateColorProject({color, id}){
  return await apiFetch(`/projects/color/${id}`, {
    method: "PATCH",
    body: {color}
  })
}
export async function updateFavoriteProject(id){
  return await apiFetch(`/projects/favorite/${id}`, {
    method: "PATCH"
  })
}
export async function deleteProject(id){
  return await apiFetch(`/projects/${id}`, {
    method: "DELETE"
  })
}
export async function sharedProject(body){
  const { email, permission, id } = body
  return await apiFetch(`/projects/shared/${id}`, {
    method: "PATCH",
    body: {email, permission}
  })
}
export async function restoreProject(id){
  const project = JSON.parse(sessionStorage.getItem("currentProject")).id
  return await apiFetch(`/projects/trash/${id}?project=${project}`, {
    method: "PATCH",
  });
}
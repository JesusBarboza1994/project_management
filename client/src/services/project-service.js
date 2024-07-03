import { BASE_URI } from "../config";
import apiFetch from "./api-fetch";

export async function listProjects(workspaceId){
  return await apiFetch(`/projects/${workspaceId}`)
}
export async function createProject(body){
  const { title, workspaceId, color } = body
  return await apiFetch(`/projects/${workspaceId}`, {
    method: "POST",
    body: {title, color}
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
  const { email, permission, id, mixed } = body
  if(mixed){
    return await apiFetch(`/mixed-projects/shared/${id}`, {
      method: "PATCH",
      body: {email, permission}
    })
  }else{
    return await apiFetch(`/projects/shared/${id}`, {
      method: "PATCH",
      body: {email, permission}
    })
  }
}
export async function restoreProject(id){
  return await apiFetch(`/projects/trash/${id}`, {
    method: "PATCH",
  });
}

export async function updateTitleProject(id){
  const {title} = JSON.parse(sessionStorage.getItem("currentProject"))
  return await apiFetch(`/projects/name/${id}`, {
    body: {title},
    method: "PATCH",
  });
}

export async function listCollaborationProjects(){
  return await apiFetch(`/projects/list/collaboration`)
}

export async function generateExcelProject(filters){
  const {id, search="", order=0, init_date="", end_date="",  progress=0, type} = filters
  const token = sessionStorage.getItem('token')
  
  const body = {
    search, 
    order,
    init_date,
    end_date,
    relative_progress: progress, 
  }
  console.log("🚀 ~ BODYYYYYYYYY:", JSON.stringify(body))
  try {
    const response = await fetch(`${BASE_URI}/${type ? "projects" : "mixed-projects"}/generate-excel/${id}`,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
    const blob = await response.blob(); // Obtener los datos del blob
    // Crear una URL del blob para descargar el archivo
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace y simular clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = 'actividades.xlsx'; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo', error);
  }
}
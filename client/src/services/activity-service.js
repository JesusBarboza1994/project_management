import apiFetch from "./api-fetch";

export async function listActivities(id_parent) {
  return await apiFetch(`/activities/${id_parent}`);
}

export async function listTreeActivities(){
  const project = JSON.parse(sessionStorage.getItem("currentProject"))
  return await apiFetch(`/activities/tree/${project.id}`);
}

export async function createActivity(body){
  const project = JSON.parse(sessionStorage.getItem("currentProject")).id
  return await apiFetch(`/activities?project=${project}`, {
    body: body,
  });
}

export async function deleteActivity(id){
  const project = JSON.parse(sessionStorage.getItem("currentProject")).id
  return await apiFetch(`/activities/${id}?project=${project}`, {
    method: "DELETE",
  });
}

export async function updateActivity(id, body){
  const project = JSON.parse(sessionStorage.getItem("currentProject")).id
  const { relativeWeight: relative_weight, relativeProgress: relative_progress, initDate: init_date, endDate: end_date } = body
  return await apiFetch(`/activities/${id}?project=${project}`, {
    body: {relative_weight, relative_progress, init_date, end_date},
    method: "PATCH",
  });
}

export async function updateNameActivity(id, title){
  const project = JSON.parse(sessionStorage.getItem("currentProject")).id
  return await apiFetch(`/activities/title/${id}?project=${project}`, {
    body: {title},
    method: "PATCH",
  });
}

export async function tableActivitiesWithFilters(filters){
  const {id, search="", order=0, init_date="", end_date="",  relative_progress=0} = filters
  console.log("🚀 ~ tableActivitiesWithFilters ~ IDDDDDD:", id)
  return await apiFetch(`/activities/table/${id}`,{
    method: "POST",
    body: {
      search, 
      order, // Busca el orden de la actividad. Si es 2, trae los de orden 1 y 2. Es lista desplegable
      init_date,
      end_date,
      relative_progress, //Menor o igual. Debería ser un slicer.
    }
  })
}
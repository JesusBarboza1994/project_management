import apiFetch from "./api-fetch";

export async function listActivities(id_parent) {
  return await apiFetch(`/activities/${id_parent}`);
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

import apiFetch from "./api-fetch";

export async function listActivities(id_parent) {
  return await apiFetch(`/activities/${id_parent}`);
}

export async function createActivity(body){
  return await apiFetch(`/activities`, {
    body: body,
  });
}

export async function deleteActivity(id){
  return await apiFetch(`/activities/${id}`, {
    method: "DELETE",
  });
}
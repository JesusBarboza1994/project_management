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

export async function updateActivity(id, body){
  const { relativeWeight: relative_weight, relativeProgress: relative_progress } = body
  return await apiFetch(`/activities/${id}`, {
    body: {relative_weight, relative_progress},
    method: "PATCH",
  });
}
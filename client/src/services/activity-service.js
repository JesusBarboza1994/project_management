import apiFetch from "./api-fetch";

export async function listActivities(id_parent) {
  return await apiFetch(`/activities/${id_parent}`);
}

export async function createActivity(body){
  return await apiFetch(`/activities`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
}
import { colors } from "../styles";
import apiFetch from "./api-fetch";

export async function createMixedProject({selectedMixedProjects}){
  const { title, projects } = selectedMixedProjects
  const ids = projects.map(project => project._id)
  const color = Object.keys(colors.randomColors)[Math.floor(Math.random() * Object.keys(colors.randomColors).length)]
  return await apiFetch("/mixed-projects",{
    method: "POST",
    body: {
      title,
      color,
      ids
    }
  })
}

export async function showMixedProject({id}){
  return await apiFetch(`/mixed-projects/${id}`)
}
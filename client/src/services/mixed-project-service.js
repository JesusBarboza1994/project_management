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

export async function showMixedProject(filters){
  const {id, search="", order=0, init_date="", end_date="",  relative_progress=0} = filters
  return await apiFetch(`/mixed-projects/${id}`,{
    method: "POST",
    body: {
      search, // Busca por el nombre de la actividad.
      order, // Busca el orden de la actividad. Si es 2, trae los de orden 1 y 2. Es lista desplegable
      init_date,
      end_date,
      relative_progress, //Menor o igual. Debería ser un slicer.
    }
  })
}

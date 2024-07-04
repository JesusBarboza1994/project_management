import Project from "../../models/project.model.js"

export async function showProject({id}){
  const project = await Project.findById(id)
  return project
}
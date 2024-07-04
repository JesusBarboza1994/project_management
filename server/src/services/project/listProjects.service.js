import Project from "../../models/project.model.js";

export async function listProjects({workspace}){
  const projects = await Project.find({workspace})
  return projects
}
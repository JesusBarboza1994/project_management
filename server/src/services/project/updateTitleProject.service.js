import Project from "../../models/project.model.js";

export async function updateTitleProject({id, title}){
  return await Project.findByIdAndUpdate(id, {title}, {new: true})
}
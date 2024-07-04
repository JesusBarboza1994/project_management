import Project from "../../models/project.model.js";
import { CustomError } from "../../utils/customError.js";

export async function updateColorProject({ id, color }){
  const updatedProject = await Project.findById(id);
  if(!updatedProject) throw new CustomError("Proyecto no encontrado", 404)
  updatedProject.color = color;
  await updatedProject.save();
  return updatedProject;
}
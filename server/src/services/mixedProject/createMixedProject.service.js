import MixedProject from "../../models/mixedProject.model.js";
import Project from "../../models/project.model.js";
import { CustomError } from "../../utils/customError.js";

export async function createMixedProject({ids, title, color, user}){
  const actualProjects = await Project.find({ _id: { $in: ids } });
  if(actualProjects.length !== ids.length) throw new CustomError("Uno o más de los proyectos no es válido.", 404, "NOT_FOUND");
  
  const projectsArray = ids.map(id => ({ project: id }))
  const newMixedPproject = await MixedProject.create({
    title,
    projects: projectsArray,
    collaborators: [{
      color,
      user: user,
      permission: 'owner'
    }],
  });
  return newMixedPproject
}
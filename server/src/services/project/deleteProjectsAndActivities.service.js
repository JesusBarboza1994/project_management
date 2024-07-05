import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { deleteDescendantActivities } from "../activity/recursive/deleteDescendantActivitiesRecursively.service.js";

export async function deleteProjectsAndActivities(workspaceId) {
  // Busca y elimina los proyectos relacionados con el workspace
  const projects = await Project.find({ workspace: workspaceId });
  for (const project of projects) {
    // Llama a la función recursivamente para eliminar actividades asociadas
    await deleteDescendantActivities(project._id);

    // Elimina el proyecto actual
    await Project.findByIdAndDelete(project._id);
    await User.updateMany({}, { $pull: { collaborations: { project: project._id } } });
  }
}

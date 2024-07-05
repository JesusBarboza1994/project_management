import Activity from "../../models/activity.model.js";
import Project from "../../models/project.model.js";
import { CustomError } from "../../utils/customError.js";

export async function listActivities({id_parent, user}) {
  const activities = await Activity.find({ parent: id_parent });
  const project = await Project.findById(id_parent)
  if(!project) return {parent: id_parent, activities}
  const collaborator = project.collaborators.find(collaborator => collaborator.user.toString() === user) 
  if(!collaborator) throw new CustomError("No tienes permisos para ver esta actividad", 403, "FORBIDDEN")
  const permission = collaborator.permission

  return {parent: id_parent, activities, permission}
}
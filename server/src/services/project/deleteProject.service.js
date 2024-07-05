import MixedProject from "../../models/mixedProject.model.js";
import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { deleteDescendantActivities } from "../activity/recursive/deleteDescendantActivitiesRecursively.service.js";

export async function deleteProject({id, user}){
  const project = await Project.findById(id);
  if (!project.is_deleted) {
    const collaborator = project.collaborators.find(
      (collaborator) => collaborator.user.toString() === user
    );
    const collaborators = [
      ...project.collaborators.filter(
        (collaborator) => collaborator.user.toString() !== user
      ),
      {
        user,
        favorite: false,
        permission: collaborator.permission,
      },
    ];
    await Project.findByIdAndUpdate(id, {
      is_deleted: true,
      collaborators: collaborators,
    })
    return { message: "Proyecto en papelera" };
  }
  await User.findOneAndUpdate(
    { _id: user },
    { $pull: { collaborations: { project: project._id } } }
  );
  await MixedProject.updateMany(
    { "projects.project": project._id },
    { $pull: { projects: { project: project._id } } }
  );
  deleteDescendantActivities(id);
  await Project.findByIdAndDelete(id);
  return { message: "Proyecto eliminado" };
}
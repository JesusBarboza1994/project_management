import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";

export async function setFavoriteProject({id, userId}){
  const project = await Project.findById(id);
  if(!project) throw new CustomError("Proyecto no encontrado", 404);

  const user = await User.findOne({ _id: userId });
  if (!user) throw new CustomError("Usuario no encontrado", 404);

  const collaboration = user.collaborations.find((collab) =>
    collab.project.equals(project._id)
  );
  if (!collaboration) throw new CustomError("Colaboración no encontrada en usuario.", 404);
  collaboration.favorite = !collaboration.favorite;
  await user.save();
  
  const collaborator = project.collaborators.find(
    (collaborator) => collaborator.user.toString() === userId
  );
  project.collaborators = [
    ...project.collaborators.filter(
      (collaborator) => collaborator.user.toString() !== userId
    ),
    {
      user: userId,
      favorite: !collaboration.favorite,
      permission: collaborator.permission,
    },
  ];
  await project.save();

  return project
}
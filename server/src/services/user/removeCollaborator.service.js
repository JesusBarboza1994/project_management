import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";

export async function removeCollaborator({id, email}){
  const project = await Project.findById(id);
    const user = await User.findOne({email});
    if (!project || !user) throw new CustomError('Proyecto o usuario no encontrado', 404, 'NOT_FOUND');
    project.collaborators = project.collaborators.filter(collaborator => collaborator.user.toString() !== user._id.toString());
    await project.save();
    return project
}
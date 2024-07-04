import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import Workspace from "../../models/workspace.model.js";
import { CustomError } from "../../utils/customError.js";

export async function createProject({title, color, workspaceId, user}){
  const workspace = await Workspace.findById(workspaceId)
  if (!workspace || !(workspace.user.toHexString() == user)){
    throw new CustomError("Este workspace no pertenece a este usuario", 400, 'INVALID_WORKSPACE')
  }

  const newProject = new Project({
    title,
    color,
    workspace: workspaceId,
    user,
    collaborators: [
      {
        user,
        permission: "owner",
      },
    ],
  });
  await User.findOneAndUpdate(
    { _id: user },
    {
      $push: {
        collaborations: { project: newProject._id, permission: "owner" },
      },
    }
  )
  await newProject.save();
  return newProject
}
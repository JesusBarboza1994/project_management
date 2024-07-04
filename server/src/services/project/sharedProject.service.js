import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";

export async function sharedProject({ id, email, permission }) {
  const userShared = await User.findOne({ email });
  const updateProject = await Project.findByIdAndUpdate(
    id,
    {
      $push: {
        collaborators: {
          user: userShared,
          permission,
        },
      },
    },
    { new: true }
  )

  if(!updateProject) throw new CustomError("Proyecto no encontrado", 404)
  
  userShared.collaborations.push({
    project: updateProject._id,
    permission
  })
  userShared.save()
  return updateProject
  
}

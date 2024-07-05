import MixedProject from "../../models/mixedProject.model.js";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";

export async function shareMixedProject({ id, email, permission }){
  const userShared = await User.findOne({ email });

  const updatedProject = await MixedProject.findByIdAndUpdate(
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
  if(!updatedProject) throw new CustomError("Proyecto combinado no encontrado", 404, "BAD_REQUEST")
  
  userShared.collaborations.push({
    project: updatedProject._id,
    permission,
  });
  userShared.save();
  return updatedProject
}
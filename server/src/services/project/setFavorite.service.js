import Project from "../../models/project.model.js";
import User from "../../models/user.model.js";
import { CustomError } from "../../utils/customError.js";

export async function setFavoriteProject({id, userId}){
  const project = await Project.findById(id);
  if(!project) throw new CustomError("Proyecto no encontrado", 404);

  const user = await User.findOne({ _id: userId });
  if (!user) throw new CustomError("Usuario no encontrado", 404);

  const collaboration = user.collaborations.map((collab) =>{
    const value = {
      project: collab.project,
      permission: collab.permission,
      _id: collab._id
    }
    if(collab.project.toString() === project._id.toString()){
      console.log("🚀 ~ setFavoriteProject ~ value:", value)
      value.favorite = !collab.favorite
    }else {
      value.favorite = collab.favorite
    }
    return value
  })

  user.collaborations = collaboration
  await user.save();
  
  const collaborator = project.collaborators.map((collaborator) => {
    if(collaborator.user.toString() === userId){
      collaborator.favorite = !collaborator.favorite
      console.log("🚀 ~ setFavoriteProject ~ collaborator:", collaborator)
    }
    return collaborator
  })
  
  project.collaborators = collaborator
  await project.save();

  return project
}
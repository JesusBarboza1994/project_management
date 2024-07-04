import Workspace from "../../models/workspace.model.js";
import { CustomError } from "../../utils/customError.js";

export async function updateWorkspace({id, name}){
  const updatedWorkspace = await Workspace.findById(id);
  if(!updatedWorkspace) throw new CustomError("Espacio de trabajo no encontrado", 404)
  updatedWorkspace.name = name;
  await updatedWorkspace.save();
  return updatedWorkspace;
}
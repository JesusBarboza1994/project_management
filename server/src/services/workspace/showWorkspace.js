import Workspace from "../../models/workspace.model.js";
import { CustomError } from "../../utils/customError.js";

export async function showWorkspace({id, user}){
  const workspace = await Workspace.findOne({_id: id, user});
  if(!workspace) throw new CustomError("No se encontro el espacio de trabajo", 404, 'NOT_FOUND')
  return workspace
}
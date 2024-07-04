import Workspace from "../../models/workspace.model.js";
import { deleteProjectsAndActivities } from "../../utils/delete_associated.js";

export async function deleteWorkspace({id}){
  await deleteProjectsAndActivities(id)
  await Workspace.findByIdAndDelete(id)
}
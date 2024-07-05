import Workspace from "../../models/workspace.model.js";
import { deleteProjectsAndActivities } from "../project/deleteProjectsAndActivities.service.js";

export async function deleteWorkspace({id}){
  await deleteProjectsAndActivities(id)
  await Workspace.findByIdAndDelete(id)
}
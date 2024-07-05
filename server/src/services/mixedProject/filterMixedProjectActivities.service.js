import { CustomError } from "../../utils/customError.js";
import MixedProject from "../../models/mixedProject.model.js";
import { listAllActivitiesByProject } from "../activity/listAllActivitiesByProject.js";

export async function filterMixedProjectActivities({id, order, search="", date="", relative_progress=0}){
  const mixed_project = await MixedProject.findById(id)
  if(!mixed_project) throw new CustomError("Proyecto combinado no encontrado", 404, "BAD_REQUEST")
  let max_order_in_all_projects = 0
  const mixed_activities = []
  for await (const project of mixed_project.projects) {
    console.log("PROJ", project)
    const { activities, max_order } = await listAllActivitiesByProject({id:project.project.toString(), order, search, date, relative_progress})
    if(max_order > max_order_in_all_projects){
      max_order_in_all_projects = max_order
    }
    mixed_activities.push(...activities)
  }
  return {mixed_activities, max_order: max_order_in_all_projects}
}
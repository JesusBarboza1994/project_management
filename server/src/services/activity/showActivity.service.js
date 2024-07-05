import Activity from "../../models/activity.model.js";
import { CustomError } from "../../utils/customError.js";

export async function showActivity({id}){
  const activity = await Activity.findById(id);
  if(!activity) throw new CustomError('No se encontro la actividad', 404, 'NOT_FOUND')
  return activity
}
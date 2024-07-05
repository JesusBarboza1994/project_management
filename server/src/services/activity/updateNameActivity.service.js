import Activity from "../../models/activity.model.js";
import { CustomError } from "../../utils/customError.js";

export async function updateNameActivity({id, title}){
  const activity = await Activity.findByIdAndUpdate(id, { title }, { new: true });
  if(!activity) throw new CustomError('No se encontro la actividad', 404, 'NOT_FOUND')
  return activity
}
import Activity from "../../models/activity.model.js";

export async function resetParentActivity({parentActivity}){
  // Actualizar SOLO a la actividad padre
  if(parentActivity && !parentActivity.has_subactivities){
    await Activity.findByIdAndUpdate(parentActivity._id, {has_subactivities: true,
      relative_progress: 0,
      absolute_progress: 0
    }, { new: true } )  
  } 
}
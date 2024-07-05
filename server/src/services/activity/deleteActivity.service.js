import Activity from "../../models/activity.model.js";
import { deleteDescendantActivities } from "./recursive/deleteDescendantActivitiesRecursively.service.js";

export async function deleteActivityAndDescendants({ id }){
  console.log("ID", id)
  // Actividad a eliminar (donde se dió click)
  const currentActivity = await Activity.findById(id);
  // El parent puede ser Project o Activity, si es project va a retornar null
  const parentActivity = await Activity.findById(currentActivity.parent);
  
  // Llama a la función para eliminar actividades descendientes
  await deleteDescendantActivities(id);
  // Elimina la actividad actual
  await Activity.findByIdAndDelete(id);


  
  const activitiesSameParent = await Activity.find({ parent: currentActivity.parent });
  const sumWeight = activitiesSameParent.reduce((acc, activity) => acc + activity.relative_weight, 0) 
  activitiesSameParent.forEach(async(activity) => {
    await Activity.findByIdAndUpdate(activity._id, {
      relative_weight_percentage: activity.relative_weight / sumWeight
    })
  }
  )
  return {currentActivity, parentActivity, sumWeight}
}
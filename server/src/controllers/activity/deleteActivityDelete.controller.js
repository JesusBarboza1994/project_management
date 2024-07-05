import { deleteActivityAndDescendants } from "../../services/activity/deleteActivity.service.js";
import { updateActivityRecursively } from "../../services/activity/recursive/updateActivityRecursively.service.js";
import { updateParentActivitiesRecursively } from "../../services/activity/recursive/updateParentActivitiesRecursively.service.js";
import { updateActivityWithSameParent } from "../../services/activity/updateActivityWithSameParent.service.js";

export default async function deleteActivityDeleteController(req, res){
  try {
    const id = req.params.id
    const {currentActivity, sumWeight, parentActivity} = await deleteActivityAndDescendants({ id });
    // Actualiza actividades hermanas
    // Actividades hermanas, nunca será null porque siempre tendra contenido a la actividad principal
    await updateActivityWithSameParent({parent: currentActivity.parent, sumWeight});
    
    const parentAbsoluteWeight = parentActivity ? parentActivity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    
    await updateActivityRecursively(currentActivity, parentAbsoluteWeight, currentActivity.order);
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivitiesRecursively(currentActivity.parent);
  
    res.status(200).json(
      {
        message: "Delete activity succesfully",
        project:{
          ...total_progress
        }
      }
    )
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error al eliminar la actividad y subactividades' });
  }
}
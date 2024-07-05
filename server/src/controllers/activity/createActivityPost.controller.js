import { createActivity } from "../../services/activity/createActivity.service.js";
import { updateActivityRecursively } from "../../services/activity/recursive/updateActivityRecursively.service.js";
import { updateParentActivitiesRecursively } from "../../services/activity/recursive/updateParentActivitiesRecursively.service.js";
import { resetParentActivity } from "../../services/activity/resetParentActivity.service.js";
import { updateActivityWithSameParent } from "../../services/activity/updateActivityWithSameParent.service.js";

export default async function createActivityPostController(req, res){
  try {
    const {title, relative_weight, parent } = req.body;

    const {sumWeight, parentActivity, newActivity } = await createActivity({title, relative_weight, parent});
    await updateActivityWithSameParent({parent, sumWeight});

    const parentAbsoluteWeight = parentActivity ? parentActivity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(newActivity, parentAbsoluteWeight);
    
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivitiesRecursively(newActivity.parent);
    
    await resetParentActivity({parentActivity});

    res.status(201).json({
      message: "Create activity succesfully",
      project:{
        ...total_progress
      }
    })
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
}
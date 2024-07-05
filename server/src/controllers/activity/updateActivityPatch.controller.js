import Activity from "../../models/activity.model.js";
import { updateActivityRecursively } from "../../services/activity/recursive/updateActivityRecursively.service.js";
import { updateParentActivitiesRecursively } from "../../services/activity/recursive/updateParentActivitiesRecursively.service.js";
import { updateActivity } from "../../services/activity/updateActivity.service.js";
import { updateActivityWithSameParent } from "../../services/activity/updateActivityWithSameParent.service.js";
import { CustomError } from "../../utils/customError.js";
import { esTextoNoNumerico } from "../../utils/utils.js";

export default async function updateActivityPatchController(req, res){
  try {
    
    const id = req.params.id;
    const { relative_weight, relative_progress, init_date, end_date } = req.body;
    if(esTextoNoNumerico(relative_weight)) throw new CustomError("El peso debe ser un número", 400, "WRONG_FORMAT")
    if(esTextoNoNumerico(relative_progress) || Number(relative_progress) > 1 ) throw new CustomError("El progreso debe ser un número menor a 100%", 400, "WRONG_FORMAT")
    
    const {currentActivity, parentActivity, sumWeight} = await updateActivity({ id, relative_weight, relative_progress, init_date, end_date })
    await updateActivityWithSameParent({parent: currentActivity.parent, sumWeight})
    const parentAbsoluteWeight = parentActivity ? parentActivity.absolute_weight : 1;
    
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(currentActivity, parentAbsoluteWeight);
    
    if(+relative_progress !== currentActivity.relative_progress && +relative_progress !== 0 && !currentActivity.has_subactivities){
      await Activity.findByIdAndUpdate(id, {relative_progress, absolute_progress: relative_progress*currentActivity.absolute_weight}, { new: true });
    }
    // Actualizar actividades de la cadena superior (padre en adelante)
    const parent_result = await updateParentActivitiesRecursively(currentActivity.parent);
    // Devolvemos la actividad actualizada
    res.status(200).json(
      {
        message: "Update activity succesfully",
        project:{
          ...parent_result
        }
      }
    );
  } catch (error) {
    console.log("ERROR",error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}

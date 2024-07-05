const { deleteDescendantActivities } = require("../../../utils.js/delete_associated");
const Project = require("../../models/project.model");
const Activity = require("../../models/activity.model");
const { esTextoNoNumerico} = require("../../../utils.js/utils")



async function delete_activity(req, res){
  try {
    const id = req.params.id
    // Actividad a eliminar (donde se dió click)
    const current_activity = await Activity.findById(id);
    // El parent puede ser Project o Activity, si es project va a retornar null
    const parent_activity = await Activity.findById(current_activity.parent);
    
    // Llama a la función para eliminar actividades descendientes
    await deleteDescendantActivities(id);
    // Elimina la actividad actual
    await Activity.findByIdAndDelete(id);
    // Actualiza actividades hermanas
    // Actividades hermanas, nunca será null porque siempre tendra contenido a la actividad principal
    const activities_same_parent = await Activity.find({ parent: current_activity.parent });
    const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, 0) 
    activities_same_parent.forEach(async(activity) => {
      await Activity.findByIdAndUpdate(activity._id, {
        relative_weight_percentage: activity.relative_weight / sum_weight
      })
    })
    const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(current_activity, parent_absolute_weight, current_activity.order);
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivitiesRecursively(current_activity.parent);
  
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

async function update_activity(req, res){
  const id = req.params.id;
  const { relative_weight, relative_progress, init_date, end_date } = req.body;
  if(esTextoNoNumerico(relative_weight)) return res.status(400).json({error: "El peso debe ser un número"})
  if(esTextoNoNumerico(relative_progress) || Number(relative_progress) > 1 ) return res.status(400).json({error: "El progreso debe ser un número menor a 100%"})
  const current_activity = await Activity.findByIdAndUpdate(id, { relative_weight }, { new: true });
  if(!current_activity.has_subactivities) {
    const initDate = formatStringToDate(init_date)
    const endDate= formatStringToDate(end_date)
    if(initDate > endDate) return res.status(400).json({error: "La fecha de inicio no puede ser mayor a la fecha de fin"})
    await Activity.findByIdAndUpdate(id, {init_date: initDate, end_date: endDate}, { new: true });
  }
  const parent_activity = await Activity.findById(current_activity.parent);
  const activities_same_parent = await Activity.find({ parent: current_activity.parent });
  const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
  // Actualizar pesos relativos de las actividades hermanas
  activities_same_parent.forEach(async(activity) => {
    await Activity.findByIdAndUpdate(activity._id, {
      relative_weight_percentage: activity.relative_weight / sum_weight
    })
  })
  const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
  // Llamamos a la función recursiva para actualizar las actividades descendientes
  const data = await updateActivityRecursively(current_activity, parent_absolute_weight);
  console.log("🚀 ~ update_activity ~ data:", data)
  const updated_current_activity = await Activity.findById(id);
  if(+relative_progress !== updated_current_activity.relative_progress && +relative_progress !== 0 && !updated_current_activity.has_subactivities){
    await Activity.findByIdAndUpdate(id, {relative_progress, absolute_progress: relative_progress*updated_current_activity.absolute_weight}, { new: true });
  }
  // Actualizar actividades de la cadena superior (padre en adelante)
  const parent_result = await updateParentActivitiesRecursively(current_activity.parent);
  // Devolvemos la actividad actualizada
  res.status(200).json(
    {
      message: "Update activity succesfully",
      project:{
        ...parent_result
      }
    }
  );
}

async function updateActivityRecursively(activity, parent_absolute_weight, order) {
  const parent_activity = await Activity.findById(activity.parent);
  const activities_same_parent = await Activity.find({ parent: activity.parent });
  let totalAbsoluteProgress = 0;
  for (const act of activities_same_parent) {
    act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_absolute_weight : 1);
    if(order && act.order[act.order.length -1] > order[order.length -1]){
      act.order[act.order.length -1] = (act.order[act.order.length -1] - 1)
    }
    if (!act.has_subactivities) {
      act.absolute_progress = act.absolute_weight * act.relative_progress;
    } else {
      const subactivities = await Activity.find({ parent: act._id });
      let sumAbsoluteProgress = 0;
      for (const subactivity of subactivities) {
        subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
        if(order) subactivity.order[order.length-1] = subactivity.order[order.length-1] - 1
        
        if (!subactivity.has_subactivities) {
          subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
        } else {
          const sub_subactivities = await Activity.find({ parent: subactivity._id });
          subactivity.absolute_progress = await updateActivityRecursively(sub_subactivities[0], subactivity.absolute_weight, order);
        }
        
        sumAbsoluteProgress += subactivity.absolute_progress;
        await subactivity.save();
      }

      act.absolute_progress = sumAbsoluteProgress;
    }

    await act.save();

    totalAbsoluteProgress += act.absolute_progress;
  }

  return totalAbsoluteProgress;
}

async function calculateSumWeight(parentId) {
  const activities = await Activity.find({ parent: parentId });
  return activities.reduce((acc, activity) => acc + activity.relative_weight, 0);
}

async function calculateAbsoluteProgress(activityId) {
  const subActivities = await Activity.find({ parent: activityId });
  return subActivities.reduce((acc, subActivity) => {
    return acc + subActivity.has_subactivities ? calculateAbsoluteProgress(subActivity._id) : (subActivity.absolute_weight * subActivity.relative_progress);
  }, 0);
}

async function update_activities_with_same_parent(activities, parent_activity, sum_weight){
  let absolute_weight
  let relative_weight_percentage
  activities.forEach(async(activity) => { 
    absolute_weight = parent_activity ? 
      activity.relative_weight/sum_weight * parent_activity.absolute_weight : 
      activity.relative_weight/sum_weight
    relative_weight_percentage = activity.relative_weight/sum_weight
    absolute_progress =  absolute_weight * activity.relative_progress
    await Activity.findByIdAndUpdate(activity._id, {absolute_weight, relative_weight_percentage, absolute_progress}, { new: true } )
  })
}

module.exports = {
  list_activities,
  create_activity,
  show_activity,
  delete_activity,
  update_activity,
  update_name_activity
}
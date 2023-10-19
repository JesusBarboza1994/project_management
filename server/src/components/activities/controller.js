const { deleteDescendantActivities } = require("../../utils.js/delete_associated");
const Activity = require("./model");


async function list_activities(req, res){
  try {
    const id_parent = req.params.id_parent
    const activities = await Activity.find({ parent: id_parent });
    console.log(list_activities)
    res.status(200).json({parent: id_parent, activities});
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener la lista de proyectos' });
  }
}

async function create_activity(req, res){
  let absolute_weight, index;
  try {
    const {description, relative_weight, parent } = req.body;
    const parent_activity = await Activity.findById(parent);
    const activities_same_parent = await Activity.find({ parent: parent });
    const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, 0) + relative_weight;
    if(!parent_activity){
      index = 1
      absolute_weight = relative_weight/sum_weight
    }else{

      index = parent_activity.index + 1
      absolute_weight = (+relative_weight/sum_weight) * parent_activity.absolute_weight
    }
    relative_weight_percentage = relative_weight/sum_weight
    // Crear la actividad
    const new_activity = new Activity({description, relative_weight, absolute_weight, index, parent, relative_weight_percentage});
    await new_activity.save();
    // Actualizar los datos de las actividades hermanas
    if(activities_same_parent.length !==0) await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
    
    // Actualizar a la actividad padre
    if(parent_activity && !parent_activity.has_subactivities){
      await Activity.findByIdAndUpdate(parent_activity._id, {has_subactivities: true,
        relative_progress: 0,
        absolute_progress: 0
      }, { new: true } )
      
    } 

    res.status(201).json(new_activity)
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
}
async function show_activity(req, res){
  try {
    const id = req.params.id
    const activity = await Activity.findById(id);
    res.status(200).json(activity);
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
}

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
    await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
    // Actualiza actividad padre
    if(parent_activity){
      if(activities_same_parent.length===0){
        await Activity.findByIdAndUpdate(parent_activity._id, {has_subactivities: false, relative_progress: 0, absolute_progress: 0}, { new: true } )
      }else{
        // Se debe actualizar la actividad padre con los datos actualizados de las actividades hermanas
        const updated_activities_same_parent = await Activity.find({ parent: parent_activity._id });
        const absolute_progress = updated_activities_same_parent.reduce((acc, activity) => acc + activity.absolute_progress, 0)
        await Activity.findByIdAndUpdate(parent_activity._id, { absolute_progress}, { new: true } )
      }
    }
    res.status(200).json({ message: 'Actividad y todas las subactividades eliminadas' });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error al eliminar la actividad y subactividades' });
  }
}

async function update_activity(req, res){
  // try {
    const id = req.params.id;
    const {relative_weight, relative_progress} = req.body;
    updateActivityAndDescendants(id, relative_weight, relative_progress) 
  //   // Actividad a actualizar
  //   const current_activity = await Activity.findById(id);
  //   // Actividad padre
  //   const parent_activity = await Activity.findById(current_activity.parent);
  //   // Las actividades hermanas que incluyen a la actividad base
  //   const activities_same_parent = await Activity.find({ parent: current_activity.parent });
  //   // Es necesario retirar de la nueva suma al peso de la actividad actual e incluir el nuevo peso
  //   // siempre se deben enviar weight y progress
  //   const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, -current_activity.relative_weight) + Number(relative_weight)
  //   const absolute_weight = parent_activity ? relative_weight/sum_weight * parent_activity.absolute_weight : relative_weight/sum_weight
  //   const relative_weight_percentage = relative_weight/sum_weight

  //   const absolute_progress =  absolute_weight * relative_progress
    
  //   // Actualizar las actividades hermanas  
  //   if(activities_same_parent.length !==0){
  //     await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
  //   }
    
  //   // Actualizar la actividad actual
  //   // Si tiene subactvidades, entonces no debe actualizar progreso absolute_progress,
  //   if(current_activity.has_subactivities){
  //     await Activity.findByIdAndUpdate(id, {
  //       relative_weight,
  //       relative_weight_percentage, 
  //       absolute_weight,
  //       updated_at: new Date(),
  //     },{new: true})
  //   // si no lo es, entonces actualiza todo
  //   }else{
  //     await Activity.findByIdAndUpdate(id, {
  //       relative_weight,
  //       relative_progress,
  //       relative_weight_percentage, 
  //       absolute_progress, 
  //       absolute_weight,
  //       updated_at: new Date(),
  //     },{new: true})
  //   }
  //   const updated_activity = await Activity.findByIdAndUpdate(id, { 
  //     relative_weight: relative_weight,
  //     relative_progress: relative_progress,
  //     relative_weight_percentage, 
  //     absolute_progress, 
  //     absolute_weight,
  //     updated_at: new Date(), 
  //   }, {new: true});

  //   // Actualizar las actividades hijas
  //   // const sub_activities = await Activity.find({ parent: id });
  //   // if(sub_activities.length !==0){
  //   //   sub_activities.forEach(async(activity) => {
  //   //     await Activity.findByIdAndUpdate(activity._id, {}, { new: true } )
  //   //   })
  //   // }

  //   // Actualizar la actividad padre
  //   const updated_activities_same_parent = await Activity.find({ parent: current_activity.parent});
  //   await Activity.findByIdAndUpdate(parent_activity._id, {
  //     absolute_progress: updated_activities_same_parent.reduce((acc, activity) => acc + activity.absolute_progress, 0) 
  //   }, { new: true })
  //   res.status(200).json(updated_activity);
  // } catch (error) {
  //   console.log("ERROR",error)
  //   res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
  // }
}

async function updateActivityAndDescendants(activityId, relativeWeight, relativeProgress) {
  try {
    const currentActivity = await Activity.findById(activityId);
    const parentActivity = await Activity.findById(currentActivity.parent);

    // Recalcula los campos de la actividad actual
    const sumWeight = await calculateSumWeight(currentActivity.parent);
    const absolute_weight = parentActivity
      ? relativeWeight / sumWeight * parentActivity.absolute_weight
      : relativeWeight / sumWeight;

    // Si la actividad tiene subactividades, actualiza su relative_weight y relative_progress
    if (currentActivity.has_subactivities) {
      await Activity.findByIdAndUpdate(activityId, {
        relative_weight: relativeWeight,
        relative_progress: 0,  // Reset relative_progress to 0
        absolute_weight,
        updated_at: new Date(),
      });
    } else {
      // Si no tiene subactividades, actualiza todos los campos
      const absoluteProgress = absolute_weight * relativeProgress;
      await Activity.findByIdAndUpdate(activityId, {
        relative_weight: relativeWeight,
        relative_weight_percentage: relativeWeight / sumWeight,
        absolute_weight,
        relative_progress: currentActivity.has_subactivities ? 0 : relativeProgress,
        absolute_progress: currentActivity.has_subactivities ? calculateAbsoluteProgress(activityId) : absoluteProgress,
        updated_at: new Date(),
      });
    }

    // Recursivamente actualiza las actividades hijas
    const subActivities = await Activity.find({ parent: activityId });
    for (const subActivity of subActivities) {
      await updateActivityAndDescendants(subActivity._id, subActivity.relative_weight, subActivity.relative_progress);
    }
  } catch (error) {
    console.log("ERROR", error);
    throw error;
  }
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
  update_activity
}
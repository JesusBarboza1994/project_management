const { deleteDescendantActivities } = require("../../utils.js/delete_associated");
const Project = require("../projects/model");
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
    // // Actualizar los datos de las actividades hermanas
    // if(activities_same_parent.length !==0) await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
    // Actualizar pesos relativos de las actividades hermanas
    const updated_activities_same_parent = await Activity.find({ parent });
    updated_activities_same_parent.forEach(async(activity) => {
      await Activity.findByIdAndUpdate(activity._id, {
        relative_weight_percentage: activity.relative_weight / sum_weight
      })
    })

    const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(new_activity, parent_absolute_weight);
    
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivities(new_activity.parent);
    
    // Actualizar SOLO a la actividad padre
    if(parent_activity && !parent_activity.has_subactivities){
      await Activity.findByIdAndUpdate(parent_activity._id, {has_subactivities: true,
        relative_progress: 0,
        absolute_progress: 0
      }, { new: true } )
      
    } 

    res.status(201).json({
      message: "Create activity succesfully",
      project:{
        total_progress
      }
    })
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
    activities_same_parent.forEach(async(activity) => {
      await Activity.findByIdAndUpdate(activity._id, {
        relative_weight_percentage: activity.relative_weight / sum_weight
      })
    })
    const parent_absolute_weight = parent_activity ? parent_activity.absolute_weight : 1;
    // Llamamos a la función recursiva para actualizar las actividades descendientes
    await updateActivityRecursively(current_activity, parent_absolute_weight);
    // Actualizar actividades de la cadena superior (padre en adelante)
    const total_progress = await updateParentActivities(current_activity.parent);
  
    res.status(200).json(
      {
        message: "Delete activity succesfully",
        project:{
          total_progress
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
  const { relative_weight, relative_progress } = req.body;
  const current_activity = await Activity.findByIdAndUpdate(id, { relative_weight }, { new: true });
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
  await updateActivityRecursively(current_activity, parent_absolute_weight);
  const updated_current_activity = await Activity.findById(id);
  if(+relative_progress !== updated_current_activity.relative_progress && +relative_progress !== 0 && !updated_current_activity.has_subactivities){
    await Activity.findByIdAndUpdate(id, {relative_progress, absolute_progress: relative_progress*updated_current_activity.absolute_weight}, { new: true });
  }
  // Actualizar actividades de la cadena superior (padre en adelante)
  const total_progress = await updateParentActivities(current_activity.parent);
  // Devolvemos la actividad actualizada
  res.status(200).json(
    {
      message: "Delete activity succesfully",
      project:{
        total_progress
      }
    }
  );
}

async function updateParentActivities(activityId) {
  const activity = await Activity.findById(activityId);
  if (!activity) {
    const main_activities = await Activity.find({ parent: activityId });
    const {total_progress}=  await Project.findByIdAndUpdate(activityId, { total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
    return total_progress; // Terminar si no se encuentra la actividad
  }

  // Actualizar la actividad actual
  const activities_same_parent = await Activity.find({ parent: activity._id });
  const absolute_progress = activities_same_parent.reduce((acc, act) => acc + act.absolute_progress, 0);
  await Activity.findByIdAndUpdate(activity._id, { absolute_progress });

  // Obtener la actividad padre y llamar recursivamente
  const parentActivity = await Activity.findById(activity.parent);
  if (parentActivity) {
    await updateParentActivities(parentActivity._id);
  }else{
    const main_activities = await Activity.find({ parent: activity.parent });
    const {total_progress}=  await Project.findByIdAndUpdate(activity.parent, { total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
    return total_progress;
  }
}


async function updateActivityRecursively(activity, parent_absolute_weight) {
  const parent_activity = await Activity.findById(activity.parent);
  const activities_same_parent = await Activity.find({ parent: activity.parent });
  const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
  
  let totalAbsoluteProgress = 0;
  for (const act of activities_same_parent) {
    act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_absolute_weight : 1);
    
    
    if (!act.has_subactivities) {
      act.absolute_progress = act.absolute_weight * act.relative_progress;
    } else {
      const subactivities = await Activity.find({ parent: act._id });
      let sumAbsoluteProgress = 0;
      for (const subactivity of subactivities) {
        subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
        if (!subactivity.has_subactivities) {
          subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
        } else {
          const sub_subactivities = await Activity.find({ parent: subactivity._id });
          subactivity.absolute_progress = await updateActivityRecursively(sub_subactivities[0], subactivity.absolute_weight);
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
  update_activity
}
// async function update_activity2(req, res){
//   try {
//     const id = req.params.id;
//     const {relative_weight, relative_progress} = req.body;
//     // updateActivityAndDescendants(id, relative_weight, relative_progress) 
//     // Actividad a actualizar
//     const current_activity = await Activity.findById(id);

//     // Actividad padre
//     const parent_activity = await Activity.findById(current_activity.parent);
//     // Las actividades hermanas que incluyen a la actividad base
//     const activities_same_parent = await Activity.find({ parent: current_activity.parent });
//     // Es necesario retirar de la nueva suma al peso de la actividad actual e incluir el nuevo peso
//     // siempre se deben enviar weight y progress
//     const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, -current_activity.relative_weight) + Number(relative_weight)
//     const absolute_weight = parent_activity ? relative_weight/sum_weight * parent_activity.absolute_weight : relative_weight/sum_weight
//     const relative_weight_percentage = relative_weight/sum_weight

//     const absolute_progress =  absolute_weight * relative_progress
    
//     // Actualizar las actividades hermanas  
//     if(activities_same_parent.length !==0){
//       await update_activities_with_same_parent(activities_same_parent, parent_activity, sum_weight)
//     }
    
//     // Actualizar la actividad actual
//     // Si tiene subactvidades, entonces no debe actualizar progreso absolute_progress,
//     if(current_activity.has_subactivities){
//       await Activity.findByIdAndUpdate(id, {
//         relative_weight,
//         relative_weight_percentage, 
//         absolute_weight,
//         updated_at: new Date(),
//       },{new: true})
//     // si no lo es, entonces actualiza todo
//     }else{
//       await Activity.findByIdAndUpdate(id, {
//         relative_weight,
//         relative_progress,
//         relative_weight_percentage, 
//         absolute_progress, 
//         absolute_weight,
//         updated_at: new Date(),
//       },{new: true})
//     }
//     const updated_activity = await Activity.findByIdAndUpdate(id, { 
//       relative_weight: relative_weight,
//       relative_progress: relative_progress,
//       relative_weight_percentage, 
//       absolute_progress, 
//       absolute_weight,
//       updated_at: new Date(), 
//     }, {new: true});

//     // Actualizar las actividades hijas
//     // const sub_activities = await Activity.find({ parent: id });
//     // if(sub_activities.length !==0){
//     //   sub_activities.forEach(async(activity) => {
//     //     await Activity.findByIdAndUpdate(activity._id, {}, { new: true } )
//     //   })
//     // }

//     // Actualizar la actividad padre
//     const updated_activities_same_parent = await Activity.find({ parent: current_activity.parent});
//     await Activity.findByIdAndUpdate(parent_activity._id, {
//       absolute_progress: updated_activities_same_parent.reduce((acc, activity) => acc + activity.absolute_progress, 0) 
//     }, { new: true })
//     res.status(200).json(updated_activity);
//   } catch (error) {
//     console.log("ERROR",error)
//     res.status(500).json({ error: 'Error al actualizar el proyecto' }); // Agregamos una respuesta de error  
//   }
// }
// async function updateActivityRecursively(activity) {
//   const parent_activity = await Activity.findById(activity.parent);
//   const activities_same_parent = await Activity.find({ parent: activity.parent });
//   const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
//   // Actualizamos hermanas e hijas como subactividades de manera recursiva
//   for (const act of activities_same_parent) {
//     const act_absolute_weight = act.relative_weight / sum_weight * (parent_activity ? parent_activity.absolute_weight : 1);
//     let act_absolute_progress
//     if (!act.has_subactivities) {
//       act_absolute_progress = act.absolute_weight * act.relative_progress;
//     } else {
//       const subactivities = await Activity.find({ parent: act._id });
//       let sumAbsoluteProgress = 0;

//       // Actualizamos subactividades de manera recursiva
//       for (const subactivity of subactivities) {
//         subactivity.absolute_weight = subactivity.relative_weight * act_absolute_weight;
//         if (!subactivity.has_subactivities) {
//           subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
//         } else {
//           await updateActivityRecursively(subactivity);
//         }
//         sumAbsoluteProgress += subactivity.absolute_progress;
//         await subactivity.save();
//       }

//       act_absolute_progress = sumAbsoluteProgress;
//     }
//     act.absolute_progress = act_absolute_progress;
//     act.absolute_weight = act_absolute_weight;
//     await act.save();
//   }
// }
// async function updateActivityRecursively(activity) {
//   const parent_activity = await Activity.findById(activity.parent);
//   const activities_same_parent = await Activity.find({ parent: activity.parent });
//   const sum_weight = activities_same_parent.reduce((acc, act) => acc + act.relative_weight, 0);
//   let totalAbsoluteProgress = 0;
  
//   for (const act of activities_same_parent) {
//     act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_activity.absolute_weight : 1);
    
//     if (!act.has_subactivities) {
//       act.absolute_progress = act.absolute_weight * act.relative_progress;
//       await act.save();
//     } else {
//       const subactivities = await Activity.find({ parent: act._id });
//       let sumAbsoluteProgress = 0;

//       for (const subactivity of subactivities) {
//         subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
//         if (!subactivity.has_subactivities) {
//           subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
//         } else {
//           sumAbsoluteProgress +=  await updateActivityRecursively(subactivity);
//         }
//         await subactivity.save();
//       }

//       act.absolute_progress = sumAbsoluteProgress;
//       await act.save();
//     }

//     totalAbsoluteProgress += act.absolute_progress;
//   }

//   return totalAbsoluteProgress;
// }

// async function update_activity2(req, res){
//   const id = req.params.id;
//   const { relative_weight } = req.body;
//   const current_activity = await Activity.findByIdAndUpdate(id,{relative_weight}, { new: true })
//   const parent_activity = await Activity.findById(current_activity.parent);
//   const activities_same_parent = await Activity.find({ parent: current_activity.parent });
//   const sum_weight = activities_same_parent.reduce((acc, activity) => acc + activity.relative_weight, 0)
  
//   // Actualiza hermanas e hijas como subactividades
//   activities_same_parent.map(async(activity) => {
//     let sum_abs_prog_activity = 0
//     activity.relative_weight_percentage = activity.relative_weight/sum_weight
//     activity.absolute_weight = relative_weight/sum_weight * (parent_activity ? parent_activity.absolute_weight : 1)
//     if(!activity.has_subactivities){
//       activity.absolute_progress = activity.absolute_weight * activity.relative_progress
//     }else{
//       const subactivities = await Activity.find({ parent: activity._id });
//       sum_abs_prog_activity = subactivities.map(async(subactivity) => {
//         let sum_abs_prog_sub = 0
//         subactivity.absolute_weight = subactivity.relative_weight * activity.absolute_weight
//         if(!subactivity.has_subactivities){
//           subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress
//         }else{
//           const subsubactivities = await Activity.find({ parent: subactivity._id });
//           sum_abs_prog_sub = subsubactivities.map(async(subsubactivity) => {
//             let sum_abs_prog_sub_sub = 0
//             subsubactivity.absolute_weight = subsubactivity.relative_weight * subactivity.absolute_weight
//             if(!subsubactivity.has_subactivities){
//               subsubactivity.absolute_progress = subsubactivity.absolute_weight * subsubactivity.relative_progress
//             }else{
//               const subsubsubactivities = await Activity.find({ parent: subsubactivity._id });
//               sum_abs_prog_sub_sub = subsubsubactivities.map(async(subsubsubactivity) => {
//                 // ...
//               })
//             }
//             sum_abs_prog_sub_sub += subsubsubactivity.absolute_progress
//             subsubactivity.save()
//             return sum_abs_prog_sub_sub
//           })
//           subactivity.absolute_progress = sum_abs_prog_sub
//         }
//         sum_abs_prog_activity += subactivity.absolute_progress
//         subactivity.save()
//         return sum_abs_prog_activity
//       })  
//       activity.absolute_progress = sum_abs_prog_activity
//     }
//     activity.save()
//   })
  
// }

// async function updateActivityAndDescendants(activityId, relativeWeight, relativeProgress) {
//   try {
//     const currentActivity = await Activity.findById(activityId);
//     const parentActivity = await Activity.findById(currentActivity.parent);

//     // Recalcula los campos de la actividad actual
//     const sumWeight = await calculateSumWeight(currentActivity.parent);
//     const absolute_weight = parentActivity
//       ? relativeWeight / sumWeight * parentActivity.absolute_weight
//       : relativeWeight / sumWeight;

//     // Si la actividad tiene subactividades, actualiza su relative_weight y relative_progress
//     if (currentActivity.has_subactivities) {
//       await Activity.findByIdAndUpdate(activityId, {
//         relative_weight: relativeWeight,
//         relative_progress: 0,  // Reset relative_progress to 0
//         absolute_weight,
//         updated_at: new Date(),
//       });
//     } else {
//       // Si no tiene subactividades, actualiza todos los campos
//       const absoluteProgress = absolute_weight * relativeProgress;
//       await Activity.findByIdAndUpdate(activityId, {
//         relative_weight: relativeWeight,
//         relative_weight_percentage: relativeWeight / sumWeight,
//         absolute_weight,
//         relative_progress: currentActivity.has_subactivities ? 0 : relativeProgress,
//         absolute_progress: currentActivity.has_subactivities ? calculateAbsoluteProgress(activityId) : absoluteProgress,
//         updated_at: new Date(),
//       });
//     }

//     // Recursivamente actualiza las actividades hijas
//     const subActivities = await Activity.find({ parent: activityId });
//     for (const subActivity of subActivities) {
//       await updateActivityAndDescendants(subActivity._id, subActivity.relative_weight, subActivity.relative_progress);
//     }
//   } catch (error) {
//     console.log("ERROR", error);
//     throw error;
//   }
// }
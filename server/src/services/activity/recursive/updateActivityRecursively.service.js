import Activity from "../../../models/activity.model.js";

// export async function updateActivityRecursively(activity, parent_absolute_weight, order) {
//   const parent_activity = await Activity.findById(activity.parent);
//   const activitiesSameParent = await Activity.find({ parent: activity.parent });
//   let totalAbsoluteProgress = 0;
//   for (const act of activitiesSameParent) {
//     act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_absolute_weight : 1);
//     if(order && act.order[act.order.length -1] > order[order.length -1]){
//       act.order[act.order.length -1] = (act.order[act.order.length -1] - 1)
//     }
//     if (!act.has_subactivities) {
//       act.absolute_progress = act.absolute_weight * act.relative_progress;
//     } else {
//       const subactivities = await Activity.find({ parent: act._id });
//       let sumAbsoluteProgress = 0;
//       for (const subactivity of subactivities) {
//         subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
//         if(order) subactivity.order[order.length-1] = subactivity.order[order.length-1] - 1
        
//         if (!subactivity.has_subactivities) {
//           subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
//         } else {
//           const sub_subactivities = await Activity.find({ parent: subactivity._id });
//           subactivity.absolute_progress = await updateActivityRecursively(sub_subactivities[0], subactivity.absolute_weight, order);
//         }
        
//         sumAbsoluteProgress += subactivity.absolute_progress;
//         await subactivity.save();
//       }

//       act.absolute_progress = sumAbsoluteProgress;
//     }

//     await act.save();

//     totalAbsoluteProgress += act.absolute_progress;
//   }

//   return totalAbsoluteProgress;
// }

export async function updateActivityRecursively(activity, parent_absolute_weight, order) {
  const parent_activity = await Activity.findById(activity.parent);
  const activitiesSameParent = await Activity.find({ parent: activity.parent });
  let totalAbsoluteProgress = 0;
  
  // Crear un array para almacenar las operaciones de bulk
  const bulkOperations = [];
  
  for (const act of activitiesSameParent) {
    act.absolute_weight = act.relative_weight_percentage * (parent_activity ? parent_absolute_weight : 1);
    if (order && act.order[act.order.length - 1] > order[order.length - 1]) {
      act.order[act.order.length - 1] = (act.order[act.order.length - 1] - 1);
    }
    if (!act.has_subactivities) {
      act.absolute_progress = act.absolute_weight * act.relative_progress;
    } else {
      const subactivities = await Activity.find({ parent: act._id });
      let sumAbsoluteProgress = 0;
      for (const subactivity of subactivities) {
        subactivity.absolute_weight = subactivity.relative_weight_percentage * act.absolute_weight;
        if (order) subactivity.order[order.length - 1] = subactivity.order[order.length - 1] - 1;
        
        if (!subactivity.has_subactivities) {
          subactivity.absolute_progress = subactivity.absolute_weight * subactivity.relative_progress;
        } else {
          const sub_subactivities = await Activity.find({ parent: subactivity._id });
          subactivity.absolute_progress = await updateActivityRecursively(sub_subactivities[0], subactivity.absolute_weight, order);
        }
        
        sumAbsoluteProgress += subactivity.absolute_progress;
        
        // Añadir la operación de actualización a bulkOperations
        bulkOperations.push({
          updateOne: {
            filter: { _id: subactivity._id },
            update: { $set: { absolute_weight: subactivity.absolute_weight, order: subactivity.order, absolute_progress: subactivity.absolute_progress } }
          }
        });
      }

      act.absolute_progress = sumAbsoluteProgress;
    }

    // Añadir la operación de actualización a bulkOperations
    bulkOperations.push({
      updateOne: {
        filter: { _id: act._id },
        update: { $set: { absolute_weight: act.absolute_weight, order: act.order, absolute_progress: act.absolute_progress } }
      }
    });

    totalAbsoluteProgress += act.absolute_progress;
  }

  // Ejecutar todas las operaciones de bulk
  if (bulkOperations.length > 0) {
    await Activity.bulkWrite(bulkOperations);
  }

  return totalAbsoluteProgress;
}

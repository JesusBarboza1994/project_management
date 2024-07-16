import Activity from "../../../models/activity.model.js";
import Project from "../../../models/project.model.js";


// export async function updateParentActivitiesRecursively(activityId) {
//   const activity = await Activity.findById(activityId);
//   if (!activity) {
//     const main_activities = await Activity.find({ parent: activityId });
//     const init_date = main_activities.map(activity => activity.init_date).sort((a, b) => a - b)[0];
//     const end_date = main_activities.map(activity => activity.end_date).sort((a, b) => a - b)[main_activities.length-1];
//     const {total_progress}=  await Project.findByIdAndUpdate(activityId, { init_date, end_date,total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
//     return {total_progress, init_date, end_date}; // Terminar si no se encuentra la actividad
//   }
//   // Actualizar la actividad actual
//   const activities_same_parent = await Activity.find({ parent: activity._id });
//   const init_date = activities_same_parent.map(activity => activity.init_date).sort((a, b) => a - b)[0];
//   const end_date = activities_same_parent.map(activity => activity.end_date).sort((a, b) => a - b)[activities_same_parent.length-1];
//   const absolute_progress = activities_same_parent.reduce((acc, act) => acc + act.absolute_progress, 0);
//   const has_subactivities = activities_same_parent.length === 0 ? false : true
//   const relative_progress = absolute_progress / activity.relative_weight_percentage
//   await Activity.findByIdAndUpdate(activity._id, { absolute_progress, init_date, end_date, has_subactivities, relative_progress });

//   // Obtener la actividad padre y llamar recursivamente
//   const parentActivity = await Activity.findById(activity.parent);
//   if (parentActivity) {
//     return await updateParentActivitiesRecursively(parentActivity._id);
//   }else{
//     const main_activities = await Activity.find({ parent: activity.parent, index: 1 });
//     const initDate = main_activities.map(activity => activity.init_date).sort((a, b) => a - b)[0];
//     const endDate = main_activities.map(activity => activity.end_date).sort((a, b) => a - b)[main_activities.length-1];
//     const {total_progress }=  await Project.findByIdAndUpdate(activity.parent, { total_progress: main_activities.reduce((acc, act) => acc + act.absolute_progress, 0) }, { new: true });
//     return {total_progress, init_date: initDate, end_date: endDate};
//   }
// }


export async function updateParentActivitiesRecursively(activityId) {
  const bulkOperations = [];

  async function recursiveUpdate(activityId) {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      const main_activities = await Activity.find({ parent: activityId });
      const init_date = main_activities.map(activity => activity.init_date).sort((a, b) => a - b)[0];
      const end_date = main_activities.map(activity => activity.end_date).sort((a, b) => a - b)[main_activities.length - 1];
      const total_progress = main_activities.reduce((acc, act) => acc + act.absolute_progress, 0);

      bulkOperations.push({
        updateOne: {
          filter: { _id: activityId },
          update: { $set: { init_date, end_date, total_progress } }
        }
      });

      return { total_progress, init_date, end_date };
    }

    // Actualizar la actividad actual
    const activities_same_parent = await Activity.find({ parent: activity._id });
    const init_date = activities_same_parent.map(activity => activity.init_date).sort((a, b) => a - b)[0];
    const end_date = activities_same_parent.map(activity => activity.end_date).sort((a, b) => a - b)[activities_same_parent.length - 1];
    const absolute_progress = activities_same_parent.reduce((acc, act) => acc + act.absolute_progress, 0);
    const has_subactivities = activities_same_parent.length > 0;
    const relative_progress = absolute_progress / activity.relative_weight_percentage;

    bulkOperations.push({
      updateOne: {
        filter: { _id: activity._id },
        update: { $set: { absolute_progress, init_date, end_date, has_subactivities, relative_progress } }
      }
    });

    // Obtener la actividad padre y llamar recursivamente
    const parentActivity = await Activity.findById(activity.parent);
    if (parentActivity) {
      return await recursiveUpdate(parentActivity._id);
    } else {
      const main_activities = await Activity.find({ parent: activity.parent, index: 1 });
      const initDate = main_activities.map(activity => activity.init_date).sort((a, b) => a - b)[0];
      const endDate = main_activities.map(activity => activity.end_date).sort((a, b) => a - b)[main_activities.length - 1];
      const total_progress = main_activities.reduce((acc, act) => acc + act.absolute_progress, 0);

      bulkOperations.push({
        updateOne: {
          filter: { _id: activity.parent },
          update: { $set: { total_progress, init_date: initDate, end_date: endDate } }
        }
      });

      return { total_progress, init_date: initDate, end_date: endDate };
    }
  }

  const result = await recursiveUpdate(activityId);

  if (bulkOperations.length > 0) {
    await Activity.bulkWrite(bulkOperations);
  }

  return result;
}

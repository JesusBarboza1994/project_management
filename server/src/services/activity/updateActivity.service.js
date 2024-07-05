import Activity from "../../models/activity.model.js";
import { formatStringToDate } from "../../utils/utils.js";

export async function updateActivity({id, relative_weight, relative_progress, init_date, end_date }){
  const currentActivity = await Activity.findByIdAndUpdate(id, { relative_weight }, { new: true });
  const parentActivity = await Activity.findById(currentActivity.parent);
  if(!currentActivity.has_subactivities) {
    const initDate = formatStringToDate(init_date)
    const endDate= formatStringToDate(end_date)
    if(initDate > endDate) return res.status(400).json({error: "La fecha de inicio no puede ser mayor a la fecha de fin"})
    await Activity.findByIdAndUpdate(id, {init_date: initDate, end_date: endDate}, { new: true });
  }

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

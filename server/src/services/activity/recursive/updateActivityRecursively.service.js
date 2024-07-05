import Activity from "../../../models/activity.model.js";

export async function updateActivityRecursively(activity, parent_absolute_weight, order) {
  const parent_activity = await Activity.findById(activity.parent);
  const activitiesSameParent = await Activity.find({ parent: activity.parent });
  let totalAbsoluteProgress = 0;
  for (const act of activitiesSameParent) {
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
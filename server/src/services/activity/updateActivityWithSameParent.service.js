import Activity from "../../models/activity.model.js";
// Actualizar pesos relativos de las actividades hermanas
export async function updateActivityWithSameParent({parent, sumWeight}){
  const updated_activities_same_parent = await Activity.find({ parent });
  updated_activities_same_parent.forEach(async(activity) => {
    await Activity.findByIdAndUpdate(activity._id, {
      relative_weight_percentage: activity.relative_weight / sumWeight
    })
  })
}
import Activity from "../../../models/activity.model.js";

export async function listActivitiesRecursively(id) {
  const activities = await Activity.find({ parent: id }).lean()
  if(activities.length === 0) return []
  for (const activity of activities) {
    activity.activities = await listActivitiesRecursively(activity._id);
  }
  return activities
}
import Activity from "../../models/activity.model.js";
import Project from "../../models/project.model.js";

export async function createActivity({title, relative_weight, parent}){
  let absoluteWeight, index;
  const parentActivity = await Activity.findById(parent);
  const activitiesSameParent = await Activity.find({ parent: parent });
  const sumWeight = activitiesSameParent.reduce((acc, activity) => acc + activity.relative_weight, 0) + relative_weight;
  let order
  let initDate
  if(!parentActivity){
    index = 1
    const ordersSameParent = activitiesSameParent.map(activity =>activity.order
      ).reduce((acc, order) => acc.concat(order),[])
    order = ( activitiesSameParent.length === 0 ) ? 
      [1] 
      : 
      [Math.max(...ordersSameParent) + 1]
    absoluteWeight = relative_weight/sumWeight
    const project = await Project.findById(parent);
    if(project.init_date){
      initDate = project.init_date
    } else {
      initDate = new Date()
    }
  } else {
    if(parentActivity.init_date){
      initDate = parentActivity.init_date
    } else {
      initDate = new Date()
    }
    if(activitiesSameParent.length === 0){
      order = [...parentActivity.order, 1]
    } else {
      const ordersSameParent = activitiesSameParent.map(activity => {
        return activity.order.slice(parentActivity.order.length)
      }).reduce((acc, order) => acc.concat(order),[])
      order = [...parentActivity.order, Math.max(...ordersSameParent) + 1]
    }
    index = parentActivity.index + 1
    absoluteWeight = (+relative_weight/sumWeight) * parentActivity.absolute_weight
  }
  const relativeWeightPercentage = relative_weight/sumWeight
  const endDate = initDate
  const newActivity = await Activity.create({
    title,
    relative_weight,
    absolute_weight: absoluteWeight,
    index,
    order,
    parent,
    relative_weight_percentage: relativeWeightPercentage,
    init_date: initDate,
    end_date: endDate
  });

  return { newActivity, sumWeight, parentActivity }
}
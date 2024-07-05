import { filterMixedProjectActivities } from "../../services/mixedProject/filterMixedProjectActivities.service.js";

export default async function filterMixedProjectActivitiesPostController(req, res){
  try {
    const { id } = req.params
    const { search="", order, date="", relative_progress=0} = req.body
    
    const { mixed_activities, max_order } = await filterMixedProjectActivities({id, order, search, date, relative_progress})
    return res.status(200).json({ mixed_activities, max_order });
  } catch (error) {
    console.error(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}

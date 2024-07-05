import { listActivities } from "../../services/activity/listActivities.service.js";

export default async function listActivitiesGetController(req, res){
  try {
    const id_parent = req.params.id_parent
    const user = req.user
    const response = await listActivities({id_parent, user})
    res.status(200).json(response);
    
  } catch (error) {
    console.log("ERROR",error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}

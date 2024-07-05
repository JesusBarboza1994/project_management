import { updateNameActivity } from "../../services/activity/updateNameActivity.service.js";

export default async function updateNameActivityPatchController(req, res){
  try {
    const id = req.params.id;
    const { title } = req.body;
    const activity = await updateNameActivity({ id, title });
    res.status(200).json(activity);
  } catch (error) {
    console.log("ERROR", error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}

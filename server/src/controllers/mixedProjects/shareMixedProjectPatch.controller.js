import { shareMixedProject } from "../../services/mixedProject/shareMixedProject.service.js";

export default async function shareMixedProjectPatchController(req, res){
  try {
    const id = req.params.id;
    const { email, permission } = req.body;

    const updateMixedProject = await shareMixedProject({ id, email, permission });

    res.status(200).send(updateMixedProject);
  } catch (error) {
    console.log(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })  
  }
}
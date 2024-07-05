import { sharedProject } from "../../services/project/sharedProject.service.js";

export default async function sharedProjectPatchController(req, res) {
  try {
    const id = req.params.id;
    const { email, permission } = req.body;

    const updateProject = await sharedProject({ id, email, permission });
    
    return res.status(200).json(updateProject);
  } catch (error) {
    console.log(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}
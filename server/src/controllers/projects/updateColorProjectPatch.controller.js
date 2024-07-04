import { updateColorProject } from "../../services/project/updateColorProject.service.js";

export default async function updateColorProjectPatchController(req, res) {
  try {
    const id = req.params.id;
    const { color } = req.body;
    const updatedProject = await updateColorProject({ id, color });
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.log(error);
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}
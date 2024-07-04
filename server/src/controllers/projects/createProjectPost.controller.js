import { createProject } from "../../services/project/createProject.service.js";
// TODO: Validar que el usuario que crea el proyecto dentro del workspace, sea dueño del workspace

export default async function createProjectPostController(req, res) {
  try {
    const { title, color } = req.body;
    const user = req.user
    const workspaceId = req.params.id_workspace
    const project = await createProject({title, color, workspaceId, user});
    
    res.status(201).json(project);
  } catch (error) {
    console.log("🚀 ~ craeteUserPostController ~ error:", error)
    if(error.status >= 400 && error.status < 500) return res.status(400).send({ success: false, errors: error.message, code: error.code })
    return res.status(500).send({ success: false, errors: error.message })
  }
}
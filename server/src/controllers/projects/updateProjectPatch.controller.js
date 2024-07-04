import { updateProject } from "../../services/project/updateProject.service.js";

export default async function updateProjectPatchController(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const updated_project = await updateProject({ id, body });
    res.status(200).json(updated_project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el proyecto" }); // Agregamos una respuesta de error
  }
}
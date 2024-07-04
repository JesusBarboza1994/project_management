import { showProject } from "../../services/project/showProject.service.js";

// TODO: Validar que el dueño del project tenga acceso a este
export default async function showProjectGetController(req, res) {
  try {
    const project = await showProject({id:req.params.id});
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
}
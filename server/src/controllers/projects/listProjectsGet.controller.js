import { listProjects } from "../../services/project/listProjects.service.js";

export default async function listProjectsGetController(req, res) {
  try {
    // Consulta todos los proyectos
    const projects = await listProjects({workspace: req.params.id_workspace});
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay proyectos en este workspace" });
    }
    // Responde con la lista de projects en formato JSON
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la lista de proyectos" });
  }
}